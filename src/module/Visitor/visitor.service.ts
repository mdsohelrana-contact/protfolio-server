import status from "http-status";
import AppError from "../../middlewares/AppError";
import prisma from "../../shared/prismaClient";
import { extractVisitorData } from "../../utils/getVisitorData";

const createOrUpdateVisitor = async (req: any, visitorData: any) => {
  const {
    pagesVisited = [],
    clickedLinks = [],
    clickedProjects = [],
    timeSpent = 0,
    referrer = "",
  } = visitorData;
  const visitorMeta = extractVisitorData(req);
  const now = new Date();

  const existing = await prisma.visitor.findFirst({
    where: {
      ipAddress: visitorMeta.ipAddress,
      createdAt: {
        gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      },
    },
    include: {
      clickedProjects: true,
    },
  });

  if (existing) {
    const mergedPages = Array.from(
      new Set([...existing.pagesVisited, ...pagesVisited])
    );
    const mergedLinks = Array.from(
      new Set([...existing.clickedLinks, ...clickedLinks])
    );
    const existingProjectIds = existing.clickedProjects.map((p: any) => p.id);
    const newUniqueProjects = clickedProjects.filter(
      (proj: any) => proj.id && !existingProjectIds.includes(proj.id)
    );

    // Ensure only valid projects exist in DB
    const validProjects = await prisma.projectClick.findMany({
      where: {
        id: {
          in: newUniqueProjects.map((p: any) => p.id),
        },
      },
      select: { id: true },
    });

    const updated = await prisma.visitor.update({
      where: { id: existing.id },
      data: {
        timeSpent: existing.timeSpent + timeSpent,
        visitCount: existing.visitCount + 1,
        pagesVisited: mergedPages,
        clickedLinks: mergedLinks,
        clickedProjects: {
          connect: validProjects.map((p) => ({ id: p.id })),
        },
        updatedAt: now,
      },
    });

    return { data: updated, isReturning: true };
  }

  // Create new visitor
  const validProjectConnect = await prisma.projectClick.findMany({
    where: {
      id: {
        in: clickedProjects.map((p: any) => p.id),
      },
    },
    select: { id: true },
  });

  const created = await prisma.visitor.create({
    data: {
      ...visitorMeta,
      pagesVisited,
      clickedLinks,
      clickedProjects: {
        connect: validProjectConnect.map((p) => ({ id: p.id })),
      },
      referrer,
      visitTime: now,
      timeSpent,
      isReturning: false,
      deviceType:
        (visitorMeta.deviceType as import("@prisma/client").DeviceType) ||
        "Desktop",
    },
  });
  console.log("🚀 ~ created:", created)

  return { data: created, isReturning: false };
};

// Get all visitors
const getVisitors = async () => {
  const visitors = await prisma.visitor.findMany({
    include: {
      clickedProjects: true,
    },
    orderBy: {
      visitTime: "desc",
    },
  });

  if (visitors.length === 0) {
    throw new AppError(status.NOT_FOUND, "No visitors found.");
  }

 const formattedVisitors = visitors.map((visitor) => ({
    id: visitor.id,
    ipAddress: visitor.ipAddress,
    country: visitor.country,
    city: visitor.city,
    deviceType: visitor.deviceType,
    browser: visitor.browser,
    os: visitor.os,
    visitTime: visitor.visitTime.toISOString(),
    timeSpent: visitor.timeSpent,
    pagesVisited: visitor.pagesVisited,
    clickedLinks: visitor.clickedLinks,
    referrer: visitor.referrer,
    isReturning: visitor.isReturning,
    clickedProjects: visitor.clickedProjects.map((project) => ({
      projectId: project.projectId,
      projectTitle: project.projectTitle,
      clickType: project.clickType,
      timestamp: project.timestamp.toISOString(),
      timeSpentOnProject: project.timeSpentOnProject,
    })),
  }));

  return formattedVisitors; // ✅ Returns array
};

// Analyze visitors
const getAnalyticsSummary = async () => {

  const visitors = await prisma.visitor.findMany({
    include: {
      clickedProjects: true,
    },
  });

  if (visitors.length === 0) {
    throw new AppError(status.NOT_FOUND, "No visitors found.");
  }

  // Total visitors
  const totalVisitors = visitors.length;

  // Unique visitors by ipAddress
  const uniqueVisitors = new Set(visitors.map((visitor) => visitor.ipAddress))
    .size;

  // Total page views (sum of pagesVisited length)
  const totalPageViews = visitors.reduce(
    (sum, visitor) => sum + (visitor.pagesVisited?.length || 0),
    0
  );

  // Average time spent (sum timeSpent / totalVisitors)
  const totalTimeSpent = visitors.reduce(
    (sum, visitor) => sum + (visitor.timeSpent || 0),
    0
  );
  const averageTimeSpent = totalVisitors ? totalTimeSpent / totalVisitors : 0;

  // Total message
  const totalMessages = await prisma.contactMessage.count();

  // Top countries count
  const countryCountMap: Record<string, number> = {};
  visitors.forEach(({ country }) => {
    if (country) {
      countryCountMap[country] = (countryCountMap[country] || 0) + 1;
    }
  });
  const topCountries = Object.entries(countryCountMap)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count);

  // Device breakdown count
  const deviceCountMap: Record<string, number> = {};
  visitors.forEach(({ deviceType }) => {
    deviceCountMap[deviceType] = (deviceCountMap[deviceType] || 0) + 1;
  });
  const deviceBreakdown = Object.entries(deviceCountMap)
    .map(([device, count]) => ({ device, count }))
    .sort((a, b) => b.count - a.count);


  // Top pages by views (aggregate all pagesVisited)
  const pageViewCountMap: Record<string, number> = {};
  visitors.forEach(({ pagesVisited }) => {
    if (pagesVisited && pagesVisited.length) {
      pagesVisited.forEach((page) => {
        pageViewCountMap[page] = (pageViewCountMap[page] || 0) + 1;
      });
    }
  });
  const topPages = Object.entries(pageViewCountMap)
    .map(([page, views]) => ({ page, views }))
    .sort((a, b) => b.views - a.views);

  // Project clicks summary
  const projectClicksMap: Record<
    string,
    { projectTitle: string; clicks: number; totalTimeSpent: number }
  > = {};

  visitors.forEach(({ clickedProjects }) => {
    clickedProjects.forEach(
      ({ projectId, projectTitle, timeSpentOnProject }) => {
        if (!projectClicksMap[projectId]) {
          projectClicksMap[projectId] = {
            projectTitle,
            clicks: 0,
            totalTimeSpent: 0,
          };
        }
        projectClicksMap[projectId].clicks += 1;
        projectClicksMap[projectId].totalTimeSpent += timeSpentOnProject || 0;
      }
    );
  });

  const projectClicks = Object.entries(projectClicksMap).map(
    ([, { projectTitle, clicks, totalTimeSpent }]) => ({
      projectTitle,
      clicks,
      avgTimeSpent: clicks ? totalTimeSpent / clicks : 0,
    })
  );

  // Return the analytics summary
  return {
    totalVisitors,
    totalMessages,
    uniqueVisitors,
    totalPageViews,
    averageTimeSpent,
    topCountries,
    deviceBreakdown,
    topPages,
    projectClicks,
  };
};

// Delete old visitors
const cleanupOldVisitors = async () => {
  const cutoff = new Date(new Date().setMonth(new Date().getMonth() - 1));
  const result = await prisma.visitor.deleteMany({
    where: {
      createdAt: { lt: cutoff },
    },
  });
  return result;
};

export const visitorService = {
  createOrUpdateVisitor,
  cleanupOldVisitors,
  getVisitors,
  getAnalyticsSummary,
};

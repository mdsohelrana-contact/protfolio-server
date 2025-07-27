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

  return { data: created, isReturning: false };
};

// Get all visitors
const getVisitors = async () => {

  // ! TODO: Implement MORE DETAILS for each visitor

  const visitors = await prisma.visitor.findMany({
    include: {
      clickedProjects: true,
    },
    orderBy: {
      visitTime: "desc",
    },
  });

  return visitors;
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
};

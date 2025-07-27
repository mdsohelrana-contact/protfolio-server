import express from "express";
import { getVisitorData } from "../../utils/getVisitorData";
import prisma from "../../shared/prismaClient";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const visitor = await getVisitorData(req);
    const {  pagesVisited,
      clickedLinks,
      referrer,
      timeSpent,
      ...rest
    } = req.body;

    console.log(req.body, "Visitor Data:", visitor);

    // Check if already visited in last 60 mins
    const recent = await prisma.visitor.findFirst({
      where: {
        ipAddress: visitor.ipAddress,
        visitTime: {
          gte: new Date(Date.now() - 1000 * 60 * 60),
        },
      },
    });

    if (recent) {
      res.status(200).json({ message: "Already tracked recently" });
      return;
    }

    const visitorData = {
      ...visitor,
      pagesVisited,
      clickedLinks,
      referrer,
      visitTime: new Date(),
      isReturning: !!recent,
      timeSpent,
      deviceType: visitor.deviceType as any,
    };

    await prisma.visitor.create({
      data: {
        ...visitorData,
      },
    });

    res.status(200).json({ message: "Visitor tracked" });
  } catch (err) {
    res.status(500).json({ message: "Error tracking visitor" });
  }
});

router.get("/visitors", async (req, res) => {
  try {
    const visitors = await prisma.visitor.findMany({
      include: {
        clickedProjects: true,
      },
      orderBy: {
        visitTime: "desc",
      },
    });

    res.status(200).json({ success: true, data: visitors });
  } catch (error) {
    console.error("Error fetching visitors:", error);
    res.status(500).json({ success: false, message: "Failed to fetch visitors" });
  }
});

export const visitorRoutes = router;

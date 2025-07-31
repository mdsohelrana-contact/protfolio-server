import express from "express";
import { visitorController } from "./visitor.controller";

const router = express.Router();

router.post("/", visitorController.handleVisitorTracking);

router.delete("/cleanup", visitorController.handleCleanupOldVisitors);

router.get("/visitors", visitorController.handleGetVisitors);

router.get("/analytics", visitorController.handleGetAnalyticsSummary);

export const visitorRoutes = router;

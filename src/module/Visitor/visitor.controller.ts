import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { visitorService } from "./visitor.service";
import responseHandler from "../../shared/responseHandler";

// Create visitor or update existing visitor
const handleVisitorTracking = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const result = await visitorService.createOrUpdateVisitor(req, req.body);
      responseHandler(
        res,
        true,
        result.isReturning
          ? "Visitor updated successfully"
          : "Visitor tracked successfully",
        {
          ...result,
        }
      );
    } catch (error) {
      console.error("❌ Error in visitor tracking:", error);
      if (!res.headersSent) {
        responseHandler(res, false, "Failed to track visitor", null);
      }
    }
  }
);

// Get all visitors
const handleGetVisitors = catchAsync(async (req: Request, res: Response) => {
  const result = await visitorService.getVisitors();
  responseHandler(res, true, "Visitors fetched successfully", {
    ...result,
  });
});

// Get visitors analytics summary
const handleGetAnalyticsSummary = catchAsync(
  async (req: Request, res: Response) => {
    const result = await visitorService.getAnalyticsSummary();
    responseHandler(res, true, "Analytics summary fetched successfully", {
      ...result,
    });
  }
);

// Delete old visitors
const handleCleanupOldVisitors = catchAsync(
  async (req: Request, res: Response) => {
    const result = await visitorService.cleanupOldVisitors();
    responseHandler(res, true, "Old visitors cleaned up successfully", {
      ...result,
    });
  }
);

export const visitorController = {
  handleVisitorTracking,
  handleCleanupOldVisitors,
  handleGetVisitors,
  handleGetAnalyticsSummary
};

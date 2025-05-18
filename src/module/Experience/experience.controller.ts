import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { experienceService } from "./experience.service";
import responseHandler from "../../shared/responseHandler";

const crateExperience = catchAsync(async (req: Request, res: Response) => {
  const result = await experienceService.createExperience(req.body, req.user!);

  responseHandler(res, true, "Experience created successfully", result);
});

const getAllExperiences = catchAsync(async (req: Request, res: Response) => {
  const result = await experienceService.getAllExperiences();

  responseHandler(res, true, "Experiences fetched successfully", result);
});

const updateExperience = catchAsync(async (req: Request, res: Response) => {
  const result = await experienceService.updateExperience(
    req.params.id,
    req.body,
    req.user!
  );

  responseHandler(res, true, "Experience updated successfully", result);
});

const deleteExperience = catchAsync(async (req: Request, res: Response) => {
  await experienceService.deleteExperience(req.params.id, req.user!);

  responseHandler(res, true, "Experience deleted successfully");
});

export const ExperienceControllers = {
  crateExperience,
  getAllExperiences,
  updateExperience,
  deleteExperience,
};

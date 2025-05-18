import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import responseHandler from "../../shared/responseHandler";
import { SkillsServices } from "./skills.service";

const createSkillCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await SkillsServices.createSkillCategory(req.body, req.user!);

  responseHandler(res, true, "Skill category created successfully", result);
});

const createSkill = catchAsync(async (req: Request, res: Response) => {
  const result = await SkillsServices.createSkill(req.body, req.user!);

  responseHandler(res, true, "Skill created successfully", result);
});

const getSkillCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await SkillsServices.getAllSkillCategories();

  responseHandler(res, true, "Skill categories fetched successfully", result);
});

const getAllSkills = catchAsync(async (req: Request, res: Response) => {
  const result = await SkillsServices.getAllSkills();

  responseHandler(res, true, "Skills fetched successfully", result);
});

const updateSkillCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await SkillsServices.updateSkillCategory(
    req.params.id,
    req.body,
    req.user!
  );

  responseHandler(res, true, "Skill category updated successfully", result);
});

const updateSkill = catchAsync(async (req: Request, res: Response) => {
  const result = await SkillsServices.updateSkill(
    req.params.id,
    req.body,
    req.user!
  );

  responseHandler(res, true, "Skill updated successfully", result);
});

const deleteSkill = catchAsync(async (req: Request, res: Response) => {
  await SkillsServices.deleteSkill(req.params.id, req.user!);

  responseHandler(res, true, "Skill deleted successfully");
});

const deleteSkillCategory = catchAsync(async (req: Request, res: Response) => {
  await SkillsServices.deleteSkillCategory(req.params.id, req.user!);

  responseHandler(res, true, "Skill category deleted successfully");
});

export const SkillsControllers = {
  createSkillCategory,
  updateSkillCategory,
  getSkillCategories,
  getAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  deleteSkillCategory,
};

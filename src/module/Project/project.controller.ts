import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import responseHandler from "../../shared/responseHandler";
import { ProjectServices } from "./project.service";

const allowedCategories = [
  "FULLSTACK",
  "FRONTEND",
  "BACKEND",
  "LANDING_PAGE",
  "API",
];

// create project
const createProject = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return responseHandler(res, false, "Unauthorized: user not found", null);
  }

  const result = await ProjectServices.createProject(req.body, user);

  responseHandler(res, true, "Project created successfully", result);
});

// get all projects
const getAllProjects = catchAsync(async (req: Request, res: Response) => {
  const categoryQuery = req.query.category as string;

  let category: string | undefined = undefined;
  if (categoryQuery && allowedCategories.includes(categoryQuery)) {
    category = categoryQuery;
  }

  const result = await ProjectServices.getAllProjects(category);

  responseHandler(res, true, "Projects fetched successfully", result);
});

// get deleted projects
const getDeletedProjects = catchAsync(async (req: Request, res: Response) => {
  const categoryQuery = req.query.category as string;

  let category: string | undefined = undefined;
  if (categoryQuery && allowedCategories.includes(categoryQuery)) {
    category = categoryQuery;
  }

  const result = await ProjectServices.getDeletedProjects(category);

  responseHandler(res, true, "Deleted projects fetched successfully", result);
});

// get single project
const getSingleProject = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectServices.getSingleProject(req.params.id);

  responseHandler(res, true, "Project fetched successfully", result);
});

// update project
const updateProject = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { id } = req.params;
  if (!user) {
    return responseHandler(res, false, " user not found", null);
  }

  const result = await ProjectServices.updateProject(id, req.body, user);

  responseHandler(res, true, "Project updated successfully", result);
});

// hard delete project
const hardDeleteProject = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectServices.hardDeleteProject(
    req.params.id,
    req.user!
  );

  responseHandler(res, true, "Project deleted successfully", result);
});

// soft delete project
const softDeleteProject = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectServices.softDeleteProject(
    req.params.id,
    req.user!
  );

  responseHandler(res, true, "Project deleted successfully", result);
});

export const ProjectControllers = {
  createProject,
  getAllProjects,
  getSingleProject,
  updateProject,
  hardDeleteProject,
  softDeleteProject,
  getDeletedProjects,
};

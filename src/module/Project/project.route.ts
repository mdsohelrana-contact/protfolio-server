import express from "express";
import auth from "../../middlewares/auth";
import { ProjectControllers } from "./project.controller";
import validateRequest from "../../middlewares/validationRequest";
import { projectSchema } from "./project.validation";
import cloudinary from "../../utils/cloudinary";
import upload from "../../middlewares/multer";
import AppError from "../../middlewares/AppError";
import status from "http-status";
import path from "path";
import uploadBufferToCloudinary from "../../utils/uploadToCloudinary";
import { uploadAndParse } from "../../middlewares/uploadAndParse";

const router = express.Router();

router.get("/", ProjectControllers.getAllProjects);
router.get("/deleted", auth("OWNER"), ProjectControllers.getDeletedProjects);

router.post(
  "/",
  upload.array("files"),
  uploadAndParse("projects", "images", true),

  validateRequest(projectSchema.CreateProjectSchema),

  auth("OWNER"),

  ProjectControllers.createProject
);

router.patch(
  "/:id",
  upload.array("files"),
  uploadAndParse("projects", "images", true),

  validateRequest(projectSchema.UpdateProjectSchema),
  auth("OWNER"),
  ProjectControllers.updateProject
);

router.delete(
  "/force/:id",
  auth("OWNER"),
  ProjectControllers.hardDeleteProject
);
router.delete("/soft/:id", auth("OWNER"), ProjectControllers.softDeleteProject);

router.patch("/:id/restore", auth("OWNER"), ProjectControllers.restoreProject);

router.get("/:id", ProjectControllers.getSingleProject);

export const ProjectRoutes = router;

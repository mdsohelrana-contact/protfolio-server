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

const router = express.Router();

router.get("/", ProjectControllers.getAllProjects);
router.get("/deleted", auth("OWNER"), ProjectControllers.getDeletedProjects);

router.post(
  "/",
  upload.array("files"),

  async (req, res, next) => {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        throw new AppError(status.BAD_REQUEST, "No file uploaded");
      }

      const uploadPromise = files.map((file) =>
        uploadBufferToCloudinary(file.buffer, "projects")
      );

      const uploadResults = await Promise.all(uploadPromise);
      const imageUrls = uploadResults.map((result: any) => result.secure_url);

      //  parse
      if (req.body.data && typeof req.body.data === "string") {
        req.body.data = JSON.parse(req.body.data);
      }

      // parse tags and keyFeatures inside data,
      if (req.body.data.tags && typeof req.body.data.tags === "string") {
        req.body.data.tags = JSON.parse(req.body.data.tags);
      }
      if (
        req.body.data.keyFeatures &&
        typeof req.body.data.keyFeatures === "string"
      ) {
        req.body.data.keyFeatures = JSON.parse(req.body.data.keyFeatures);
      }

      req.body = {
        ...req.body.data,
        images: imageUrls,
      };

      next();
    } catch (error) {
      next(error);
    }
  },
  validateRequest(projectSchema.CreateProjectSchema),

  auth("OWNER"),

  ProjectControllers.createProject
);

router.patch(
  "/:id",
  upload.array("files"),

  async (req, res, next) => {
    try {
      const files = req.files as Express.Multer.File[];

      let imageUrls: string[] = [];

      if (files && files.length > 0) {
        const uploadPromise = files.map((file) =>
          uploadBufferToCloudinary(file.buffer, "projects")
        );
        const uploadResults = await Promise.all(uploadPromise);
        imageUrls = uploadResults.map((result: any) => result.secure_url);
      }

      //  Parse `data` JSON string if present
      if (req.body.data && typeof req.body.data === "string") {
        req.body.data = JSON.parse(req.body.data);
      }

      // Parse tags and keyFeatures if passed as JSON strings
      if (req.body.data?.tags && typeof req.body.data.tags === "string") {
        req.body.data.tags = JSON.parse(req.body.data.tags);
      }

      if (
        req.body.data?.keyFeatures &&
        typeof req.body.data.keyFeatures === "string"
      ) {
        req.body.data.keyFeatures = JSON.parse(req.body.data.keyFeatures);
      }

      req.body = {
        ...req.body.data,
        ...(imageUrls.length > 0 && { images: imageUrls }),
      };

      next();
    } catch (error) {
      next(error);
    }
  },

  validateRequest(projectSchema.UpdateProjectSchema), // 6. Validate schema
  auth("OWNER"), // 7. Auth middleware
  ProjectControllers.updateProject // 8. Final handler
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

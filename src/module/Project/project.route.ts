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
import uploadToCloudinary from "../../utils/uploadToCloudinary";

const router = express.Router();

router.get("/", ProjectControllers.getAllProjects);
router.get("/deleted", auth("OWNER"), ProjectControllers.getDeletedProjects);

router.post(
  "/",
  upload.single("file"),

  async (req, res, next) => {
    try {
      const file = req.file;

      if (!file) {
        throw new AppError(status.BAD_REQUEST, "No file uploaded");
      }

      // // cloudinary
      // const filePath = path.join(file.destination, file.filename);
      const result: any = await uploadToCloudinary(file.buffer, "projects");

      req.body.image = result.secure_url;

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
        image: req.body.image,
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
  upload.single("file"), // 1. Handle optional image upload

  async (req, res, next) => {
    try {
      // 2. Handle optional image upload
      const file = req.file;
      if (file) {
        const result: any = await uploadToCloudinary(file.buffer, "projects");
        req.body.image = result.secure_url;
      }

      // 3. Parse `data` JSON string if present
      if (req.body.data && typeof req.body.data === "string") {
        req.body.data = JSON.parse(req.body.data);
      }

      // 4. Parse tags and keyFeatures if passed as JSON strings
      if (req.body.data?.tags && typeof req.body.data.tags === "string") {
        req.body.data.tags = JSON.parse(req.body.data.tags);
      }

      if (
        req.body.data?.keyFeatures &&
        typeof req.body.data.keyFeatures === "string"
      ) {
        req.body.data.keyFeatures = JSON.parse(req.body.data.keyFeatures);
      }

      // 5. Final body merge
      req.body = {
        ...req.body.data,
        ...(req.body.image ? { image: req.body.image } : {}),
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

router.get("/:id/restore", auth("OWNER"), ProjectControllers.restoreProject);

router.get("/:id", ProjectControllers.getSingleProject);

export const ProjectRoutes = router;

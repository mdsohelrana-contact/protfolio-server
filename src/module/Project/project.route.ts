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

      // cloudinary
      const filePath = path.join(file.destination, file.filename);
      const result: any = await uploadToCloudinary(filePath, "projects");

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

router.get("/:id", ProjectControllers.getSingleProject);

export const ProjectRoutes = router;

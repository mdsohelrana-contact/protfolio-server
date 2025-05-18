
import express from "express";
import auth from "../../middlewares/auth";
import { ProjectControllers } from "./project.controller";
import validateRequest from "../../middlewares/validationRequest";
import { projectSchema } from "./project.validation";

const router = express.Router();

router.get("/", ProjectControllers.getAllProjects);
router.get("/deleted", auth("OWNER"), ProjectControllers.getDeletedProjects);

router.post(
  "/",
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

router.delete("/force/:id", auth("OWNER"), ProjectControllers.hardDeleteProject);
router.delete("/soft/:id", auth("OWNER"), ProjectControllers.softDeleteProject);


router.get("/:id", ProjectControllers.getSingleProject);

export const ProjectRoutes = router;

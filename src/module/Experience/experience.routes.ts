import express from "express";
import { ExperienceControllers } from "./experience.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/", ExperienceControllers.getAllExperiences);

router.post("/", auth("OWNER"), ExperienceControllers.crateExperience);

router.patch("/:id", auth("OWNER"), ExperienceControllers.updateExperience);

router.delete("/:id", auth("OWNER"), ExperienceControllers.deleteExperience);

export const ExperienceRoutes = router;

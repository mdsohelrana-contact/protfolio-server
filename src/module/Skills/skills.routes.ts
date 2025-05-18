import express from "express";
import auth from "../../middlewares/auth";
import { SkillsControllers } from "./skills.controller";

const router = express.Router();

router.get("/", SkillsControllers.getAllSkills);

router.post("/", auth("OWNER"), SkillsControllers.createSkill);

router.get("/categories", SkillsControllers.getSkillCategories);

router.post("/category", auth("OWNER"), SkillsControllers.createSkillCategory);

router.patch("/:id", auth("OWNER"), SkillsControllers.updateSkill);

router.patch(
  "/category/:id",
  auth("OWNER"),
  SkillsControllers.updateSkillCategory
);

router.delete("/:id", auth("OWNER"), SkillsControllers.deleteSkill);

router.delete(
  "/category/:id",
  auth("OWNER"),
  SkillsControllers.deleteSkillCategory
);

export const SkillsRoutes = router;

import express from "express";
import { AuthRoutes } from "../module/Auth/auth.routes";
import { ProjectRoutes } from "../module/Project/project.route";
import { SkillsRoutes } from "../module/Skills/skills.routes";
import { ContactInfoRoutes } from "../module/ContactInfo/contactInfo.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/projects",
    route: ProjectRoutes,
  },
  {
    path: "/skills",
    route: SkillsRoutes,
  },
  {
    path: "/contact-info",
    route: ContactInfoRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

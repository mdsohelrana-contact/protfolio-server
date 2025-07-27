import express from "express";
import { AuthRoutes } from "../module/Auth/auth.routes";
import { ProjectRoutes } from "../module/Project/project.route";
import { SkillsRoutes } from "../module/Skills/skills.routes";
import { ContactInfoRoutes } from "../module/ContactInfo/contactInfo.routes";
import { ContactMessageRoutes } from "../module/ContactMessage/contactMessage.routes";
import { BlogRoutes } from "../module/Blog/blog.routes";
import { AboutMeRoutes } from "../module/AboutMe/about.routes";
import { ExperienceRoutes } from "../module/Experience/experience.routes";
import { visitorRoutes } from "../module/Visitor/visitor.routes";

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
  {
    path: "/contact-message",
    route: ContactMessageRoutes,
  },
  {
    path: "/blogs",
    route: BlogRoutes,
  },
  {
    path: "/about-me",
    route: AboutMeRoutes,
  },
  {
    path: "/experience",
    route: ExperienceRoutes,
  },
  {
    path: "/visitor-track",
    route: visitorRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

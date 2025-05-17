import express from "express";
import { AuthRoutes } from "../module/Auth/auth.routes";
import { ProjectRoutes } from "../module/Project/project.route";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

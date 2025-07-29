import express from "express";
import auth from "../../middlewares/auth";
import { AboutControllers } from "./about.controller";

const router = express.Router();

router.get("/", AboutControllers.getAbout);

router.patch("/", auth("OWNER"), AboutControllers.updateAbout);

export const AboutMeRoutes = router;

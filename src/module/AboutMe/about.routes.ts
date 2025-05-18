import express from "express";
import auth from "../../middlewares/auth";
import { AboutControllers } from "./about.controller";

const router = express.Router();


router.put("/", auth("OWNER"), AboutControllers.createOrUpdate);

router.get("/", AboutControllers.getAboutMe);

export const AboutMeRoutes = router;

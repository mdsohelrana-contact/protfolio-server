import express from "express";
import auth from "../../middlewares/auth";
import { AboutControllers } from "./about.controller";

const router = express.Router();


router.patch("/:aboutId", auth("OWNER"), AboutControllers.updateAbout);

router.delete("/:aboutId", auth("OWNER"), AboutControllers.deleteAbout);
router.post("/", auth("OWNER"), AboutControllers.createAbout);

router.get("/", AboutControllers.getAbout);

export const AboutMeRoutes = router;

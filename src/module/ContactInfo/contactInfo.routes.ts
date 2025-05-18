import express from "express";
import auth from "../../middlewares/auth";
import { ContactInfoControllers } from "./contactInfo.controller";

const router = express.Router();

router.get("/", ContactInfoControllers.getContactInfo);

router.post("/", auth("OWNER"), ContactInfoControllers.createContactInfo);

router.patch("/:id", auth("OWNER"), ContactInfoControllers.updateContactInfo);

router.delete("/:id", auth("OWNER"), ContactInfoControllers.deleteContactInfo);

export const ContactInfoRoutes = router;
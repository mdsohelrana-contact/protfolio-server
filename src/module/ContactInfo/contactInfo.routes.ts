import express from "express";
import auth from "../../middlewares/auth";
import { ContactInfoControllers } from "./contactInfo.controller";
import upload from "../../middlewares/multer";
import { uploadAndParse } from "../../middlewares/uploadAndParse";

const router = express.Router();

router.get("/", ContactInfoControllers.getContactInfo);

router.post(
  "/",
  upload.single("file"),
  uploadAndParse("contactInfo", "profileImage", false),
  auth("OWNER"),
  ContactInfoControllers.createContactInfo
);

router.patch("/:id", auth("OWNER"), ContactInfoControllers.updateContactInfo);



export const ContactInfoRoutes = router;

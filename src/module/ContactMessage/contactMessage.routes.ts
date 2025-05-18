import express from "express";
import auth from "../../middlewares/auth";
import { ContactMessageControllers } from "./contactMessage.controller";

const router = express.Router();

router.get("/", auth("OWNER"), ContactMessageControllers.getMessages);

router.post("/", ContactMessageControllers.createMessage);

router.delete("/:id", auth("OWNER"), ContactMessageControllers.deleteMessage);

export const ContactMessageRoutes = router;

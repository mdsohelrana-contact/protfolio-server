import express from "express";
import { AuthControllers } from "./auth.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/register", AuthControllers.registerUser);
router.post("/login", AuthControllers.loginUser);
router.post("/refresh-token", auth("OWNER"), AuthControllers.refreshToken);

router.post("/change-password", auth("OWNER"), AuthControllers.changePassword);

export const AuthRoutes = router;

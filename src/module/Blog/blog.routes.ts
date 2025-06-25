import express from "express";
import { BlogControllers } from "./blog.controller";
import auth from "../../middlewares/auth";
import upload from "../../middlewares/multer";
import AppError from "../../middlewares/AppError";
import status from "http-status";
import uploadBufferToCloudinary from "../../utils/uploadToCloudinary";
import { uploadAndParse } from "../../middlewares/uploadAndParse";

const router = express.Router();

router.get("/", BlogControllers.getAllBlogs);

router.post(
  "/",
  upload.array("files"),
  uploadAndParse("blogs", "imageUrls", true),
  auth("OWNER"),
  BlogControllers.createBlog
);

router.get("/deleted", auth("OWNER"), BlogControllers.getAllDeletedBlogs);

router.patch(
  "/:id",
  upload.array("files"),
  uploadAndParse("blogs", "imageUrls", true),
  auth("OWNER"),
  BlogControllers.updateBlog
);

router.delete("/force/:id", auth("OWNER"), BlogControllers.hardDeleteBlog);

router.delete("/soft/:id", auth("OWNER"), BlogControllers.softDeleteBlog);

router.patch("/:id/restore", auth("OWNER"), BlogControllers.restoreBlog);

router.get("/:id", BlogControllers.getSingleBlog);

export const BlogRoutes = router;

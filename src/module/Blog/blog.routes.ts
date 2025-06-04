import express from "express";
import { BlogControllers } from "./blog.controller";
import auth from "../../middlewares/auth";
import upload from "../../middlewares/multer";
import AppError from "../../middlewares/AppError";
import status from "http-status";
import uploadBufferToCloudinary from "../../utils/uploadToCloudinary";

const router = express.Router();

router.get("/", BlogControllers.getAllBlogs);

router.post(
  "/",
  upload.array("files"),

  async (req, res, next) => {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        throw new AppError(status.BAD_REQUEST, "No file uploaded");
      }

      const uploadPromise = files.map((file) =>
        uploadBufferToCloudinary(file.buffer, "projects")
      );

      const uploadResults = await Promise.all(uploadPromise);
      const imageUrls = uploadResults.map((result: any) => result.secure_url);

      //  parse
      if (req.body.data && typeof req.body.data === "string") {
        req.body.data = JSON.parse(req.body.data);
      }

      req.body = {
        ...req.body.data,
        imageUrls: imageUrls,
      };

      next();
    } catch (error) {
      next(error);
    }
  },
  auth("OWNER"),
  BlogControllers.createBlog
);

router.get("/deleted", auth("OWNER"), BlogControllers.getAllDeletedBlogs);

router.patch(
  "/:id",
  upload.array("files"),
  async (req, res, next) => {
    try {
      const files = req.files as Express.Multer.File[];

      let imageUrls: string[] = [];

      if (files && files.length > 0) {
        const uploadPromise = files.map((file) =>
          uploadBufferToCloudinary(file.buffer, "projects")
        );

        const uploadResults = await Promise.all(uploadPromise);
        imageUrls = uploadResults.map((result: any) => result.secure_url);
      }

      //  parse
      if (req.body.data && typeof req.body.data === "string") {
        req.body.data = JSON.parse(req.body.data);
      }

      req.body = {
        ...req.body.data,
        ...(imageUrls.length > 0 && { imageUrls }),
      };

      next();
    } catch (error) {
      next(error);
    }
  },
  auth("OWNER"),
  BlogControllers.updateBlog
);

router.delete("/force/:id", auth("OWNER"), BlogControllers.hardDeleteBlog);

router.delete("/soft/:id", auth("OWNER"), BlogControllers.softDeleteBlog);

router.patch("/:id/restore", auth("OWNER"), BlogControllers.restoreBlog);

router.get("/:id", BlogControllers.getSingleBlog);

export const BlogRoutes = router;

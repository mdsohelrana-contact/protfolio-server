import express from "express";
import { BlogControllers } from "./blog.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/", BlogControllers.getAllBlogs);

router.post("/",auth("OWNER"), BlogControllers.createBlog);

router.get("/deleted", auth("OWNER"), BlogControllers.getAllDeletedBlogs);

router.patch("/:id", auth("OWNER"), BlogControllers.updateBlog);

router.delete("/force/:id", auth("OWNER"), BlogControllers.hardDeleteBlog);

router.delete("/soft/:id", auth("OWNER"), BlogControllers.softDeleteBlog);


router.get("/:id", BlogControllers.getSingleBlog);

export const BlogRoutes = router;

import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { blogService } from "./blog.service";
import responseHandler from "../../shared/responseHandler";

const createBlog = catchAsync(async (req: Request, res: Response) => {
  const result = await blogService.createBlog(req.body, req.user!);

  responseHandler(res, true, "Blog created successfully", result);
});

const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
  const result = await blogService.getAllBlogs();

  responseHandler(res, true, "Blogs fetched successfully", result);
});

const getSingleBlog = catchAsync(async (req: Request, res: Response) => {
  const result = await blogService.getSingleBlog(req.params.id);

  responseHandler(res, true, "Blog fetched successfully", result);
});

const getAllDeletedBlogs = catchAsync(async (req: Request, res: Response) => {
  const result = await blogService.getAllDeletedBlogs(req.user!);

  responseHandler(res, true, "Deleted blogs fetched successfully", result);
});

const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const result = await blogService.updateBlog(
    req.params.id,
    req.body,
    req.user!
  );

  responseHandler(res, true, "Blog updated successfully", result);
});

const hardDeleteBlog = catchAsync(async (req: Request, res: Response) => {
  await blogService.hardDeleteBlog(req.params.id, req.user!);

  responseHandler(res, true, "Blog deleted successfully");
});

const softDeleteBlog = catchAsync(async (req: Request, res: Response) => {
  await blogService.softDeleteBlog(req.params.id, req.user!);

  responseHandler(res, true, "Blog deleted successfully");
});

// restoreBlog
const restoreBlog = catchAsync(async (req: Request, res: Response) => {
  await blogService.restoreBlog(req.params.id, req.user!);

  responseHandler(res, true, "Blog restored successfully");
});


export const BlogControllers = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  getAllDeletedBlogs,
  updateBlog,
  hardDeleteBlog,
  softDeleteBlog,
  restoreBlog
};

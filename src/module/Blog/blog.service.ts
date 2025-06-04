import { JwtPayload } from "jsonwebtoken";
import { checkUserRole } from "../../utils/checkUserRole";
import prisma from "../../shared/prismaClient";
import { Blog } from "@prisma/client";
import AppError from "../../middlewares/AppError";
import status from "http-status";

const createBlog = async (payload: Blog, user: JwtPayload) => {
  await checkUserRole(user.email, ["OWNER"]);

  const existing = await prisma.blog.findFirst({
    where: { title: payload.title },
  });
  if (existing) {
    throw new AppError(
      status.CONFLICT,
      "A blog with the same title already exists."
    );
  }

  return await prisma.blog.create({
    data: {
      ...payload,
      slug: payload.title.toLowerCase().replace(/\s+/g, "-"),
      authorId: user.id,
    },
  });
};

const getAllBlogs = async () => {
  return await prisma.blog.findMany({
    where: {
      isDeleted: false,
      isPublish: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getSingleBlog = async (blogId: string) => {
  const result = await prisma.blog.findUnique({ where: { id: blogId } });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Blog not found");
  }

  return result;
};

const getAllDeletedBlogs = async (user: JwtPayload) => {
  await checkUserRole(user.email, ["OWNER"]);

  return await prisma.blog.findMany({
    where: { isDeleted: true },
    orderBy: { createdAt: "desc" },
  });
};

const updateBlog = async (blogId: string, payload: Blog, user: JwtPayload) => {
  await checkUserRole(user.email, ["OWNER"]);

  const existing = await prisma.blog.findUnique({ where: { id: blogId } });
  if (!existing) {
    throw new AppError(status.NOT_FOUND, "Blog not found");
  }

  return await prisma.blog.update({
    where: { id: blogId },
    data: payload,
  });
};

const hardDeleteBlog = async (blogId: string, user: JwtPayload) => {
  await checkUserRole(user.email, ["OWNER"]);

  const existing = await prisma.blog.findUnique({ where: { id: blogId } });
  if (!existing) {
    throw new AppError(status.NOT_FOUND, "Blog not found");
  }

  return await prisma.blog.delete({ where: { id: blogId } });
};

const softDeleteBlog = async (blogId: string, user: JwtPayload) => {
  await checkUserRole(user.email, ["OWNER"]);

  const blog = await prisma.blog.findUnique({ where: { id: blogId } });

  if (!blog) {
    throw new AppError(status.NOT_FOUND, "Blog not found");
  }

  return await prisma.blog.update({
    where: { id: blogId },
    data: { isDeleted: true },
  });
};

const restoreBlog = async (blogId: string, user: JwtPayload) => {
  await checkUserRole(user.email, ["OWNER"]);

  const blog = await prisma.blog.findUnique({ where: { id: blogId } });

  if (!blog) {
    throw new AppError(status.NOT_FOUND, "Blog not found");
  }

  return await prisma.blog.update({
    where: { id: blogId },
    data: { isDeleted: false },
  });
};

export const blogService = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  getAllDeletedBlogs,
  updateBlog,
  hardDeleteBlog,
  softDeleteBlog,
  restoreBlog,
};

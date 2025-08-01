import { ProjectCategory, Projects } from "@prisma/client";
import prisma from "../../shared/prismaClient";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../middlewares/AppError";
import status from "http-status";
import { checkUserRole } from "../../utils/checkUserRole";
import slugify from "../../utils/slugify";

// Create a new project
const createProject = async (payload: Projects, user: JwtPayload) => {
  await checkUserRole(user.email, ["OWNER"]);

  const slug = slugify(payload.title);

  const exists = await prisma.projects.findFirst({
    where: {
      OR: [
        { clientRepo: payload.clientRepo },
        { serverRepo: payload.serverRepo },
        { demoUrl: payload.demoUrl },
        { slug: slug },
      ],
    },
  });

  if (exists) {
    throw new Error(
      "A project with the same GitHub or demo URL already exists."
    );
  }

  return await prisma.projects.create({
    data: {
      ...payload,
      slug: slug,
    },
  });
};

// Get all projects
const getAllProjects = async (category: string | undefined) => {
  if (category) {
    return await prisma.projects.findMany({
      where: {
        category: category as ProjectCategory,
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  return await prisma.projects.findMany({
    where: {
      isDeleted: false,
      isFeatured: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Get a single project
const getSingleProject = async (projectId: string) => {
  const result = await prisma.projects.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Project not found");
  }

  return result;
};

// get deleted projects
const getDeletedProjects = async (
  category: string | undefined,
  user: JwtPayload
) => {
  await checkUserRole(user.email, ["OWNER"]);

  if (category) {
    return await prisma.projects.findMany({
      where: {
        category: category as ProjectCategory,
        isDeleted: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  return await prisma.projects.findMany({
    where: {
      isDeleted: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Update a project
const updateProject = async (
  projectId: string,
  payload: Projects,
  user: JwtPayload
) => {
  await checkUserRole(user.email, ["OWNER"]);

  const exists = await prisma.projects.findFirst({
    where: {
      id: projectId,
    },
  });

  if (!exists) {
    throw new AppError(status.NOT_FOUND, "Project not found");
  }

  const urlExists = await prisma.projects.findFirst({
    where: {
      OR: [
        { clientRepo: payload.clientRepo },
        { serverRepo: payload.serverRepo },
        { demoUrl: payload.demoUrl },
      ],
      NOT: { id: projectId },
    },
  });

  if (urlExists) {
    throw new AppError(
      status.BAD_REQUEST,
      "A project with the same GitHub or demo URL already exists."
    );
  }

  return await prisma.projects.update({
    where: {
      id: projectId,
    },
    data: payload,
  });
};

// Hard Delete a project
const hardDeleteProject = async (projectId: string, user: JwtPayload) => {
  await checkUserRole(user.email, ["OWNER"]);

  const exists = await prisma.projects.findFirst({
    where: {
      id: projectId,
    },
  });

  if (!exists) {
    throw new AppError(status.NOT_FOUND, "Project not found");
  }

  return await prisma.projects.delete({
    where: {
      id: projectId,
    },
  });
};

// Soft Delete a project
const softDeleteProject = async (projectId: string, user: JwtPayload) => {
  await checkUserRole(user.email, ["OWNER"]);

  const exists = await prisma.projects.findFirst({
    where: {
      id: projectId,
    },
  });

  if (!exists) {
    throw new AppError(status.NOT_FOUND, "Project not found");
  }

  return await prisma.projects.update({
    where: {
      id: projectId,
    },
    data: {
      isDeleted: true,
    },
  });
};

// restore a project
const restoreProject = async (projectId: string, user: JwtPayload) => {
  await checkUserRole(user.email, ["OWNER"]);

  const exists = await prisma.projects.findFirst({
    where: {
      id: projectId,
    },
  });

  if (!exists) {
    throw new AppError(status.NOT_FOUND, "Project not found");
  }

  return await prisma.projects.update({
    where: {
      id: projectId,
    },
    data: {
      isDeleted: false,
    },
  });
};

export const ProjectServices = {
  createProject,
  getAllProjects,
  getSingleProject,
  updateProject,
  hardDeleteProject,
  softDeleteProject,
  getDeletedProjects,
  restoreProject,
};

import { AboutMe } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { checkUserRole } from "../../utils/checkUserRole";
import prisma from "../../shared/prismaClient";
import AppError from "../../middlewares/AppError";
import status from "http-status";

const createAbout = async (payload: AboutMe, user: JwtPayload) => {
  if (!payload) {
    throw new AppError(status.BAD_REQUEST, "Payload is required");
  }
  await checkUserRole(user.email, ["OWNER"]);

  const count = await prisma.aboutMe.count();

  if (count >= 3) {
    throw new AppError(
      status.BAD_REQUEST,
      "Maximum 3 AboutMe records allowed. Please update or delete existing ones."
    );
  }
  return await prisma.aboutMe.create({ data: payload });
};

const updateAbout = async (
  payload: AboutMe,
  user: JwtPayload,
  aboutId: string
) => {
  if (!aboutId) {
    throw new AppError(status.BAD_REQUEST, "AboutMe ID is required");
  }


  await checkUserRole(user.email, ["OWNER"]);

  const existing = await prisma.aboutMe.findUnique({
    where: { id: aboutId },
  });

  if (!existing) {
    throw new AppError(status.NOT_FOUND, "AboutMe not found");
  }

  return await prisma.aboutMe.update({
    where: { id: aboutId },
    data: payload,
  });
};

const deleteAbout = async (user: JwtPayload, aboutId: string) => {
  if (!aboutId) {
    throw new AppError(status.BAD_REQUEST, "AboutMe ID is required");
  }
  await checkUserRole(user.email, ["OWNER"]);

  const existing = await prisma.aboutMe.findUnique({ where: { id: aboutId } });
  if (!existing) {
    throw new AppError(status.NOT_FOUND, "AboutMe not found");
  }

  return await prisma.aboutMe.delete({ where: { id: aboutId } });
};

const getAbout = async () => {
  const existing = await prisma.aboutMe.findMany({
    orderBy: { createdAt: "desc" },
  });
  if (existing) {
    return existing;
  } else {
    return null;
  }
};

export const AboutServices = {
  createAbout,
  getAbout,
  updateAbout,
  deleteAbout,
};

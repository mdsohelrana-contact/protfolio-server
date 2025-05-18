import { differenceInYears } from "date-fns";
import { Experience } from "@prisma/client";
import prisma from "../../shared/prismaClient";
import { JwtPayload } from "jsonwebtoken";
import { checkUserRole } from "../../utils/checkUserRole";
import AppError from "../../middlewares/AppError";
import status from "http-status";

const createExperience = async (payload: Experience, user: JwtPayload) => {
  await checkUserRole(user.email, ["OWNER"]);

  const start = new Date(payload.startDate);
  const end = payload.isCurrent
    ? new Date()
    : new Date(payload.endDate || new Date());

  const yearDifference = differenceInYears(end, start);

  return await prisma.experience.create({
    data: {
      ...payload,
      endDate: payload.isCurrent ? null : payload.endDate,
      year: yearDifference,
    },
  });
};

const getAllExperiences = async () => {
  return await prisma.experience.findMany({ orderBy: { startDate: "desc" } });
};

const updateExperience = async (
  experienceId: string,
  payload: Experience,
  user: JwtPayload
) => {
  await checkUserRole(user.email, ["OWNER"]);

  const existing = await prisma.experience.findUnique({
    where: { id: experienceId },
  });
  if (!existing) {
    throw new AppError(status.NOT_FOUND, "Experience not found");
  }

  return await prisma.experience.update({
    where: { id: experienceId },
    data: payload,
  });
};

const deleteExperience = async (experienceId: string, user: JwtPayload) => {
  await checkUserRole(user.email, ["OWNER"]);

  const existing = await prisma.experience.findUnique({
    where: { id: experienceId },
  });
  if (!existing) {
    throw new AppError(status.NOT_FOUND, "Experience not found");
  }

  return await prisma.experience.delete({ where: { id: experienceId } });
};

export const experienceService = {
  createExperience,
  getAllExperiences,
  updateExperience,
  deleteExperience,
};

import { Skill, SkillCategory } from "@prisma/client";
import prisma from "../../shared/prismaClient";
import { JwtPayload } from "jsonwebtoken";
import { checkUserRole } from "../../utils/checkUserRole";
import AppError from "../../middlewares/AppError";
import status from "http-status";

const createSkillCategory = async (
  payload: SkillCategory,
  user: JwtPayload
) => {
  await checkUserRole(user.email, ["OWNER"]);

  const exists = await prisma.skillCategory.findFirst({
    where: {
      label: payload.label,
    },
  });

  if (exists) {
    throw new AppError(
      status.CONFLICT,
      "A skill category with the same label already exists."
    );
  }

  return await prisma.skillCategory.create({ data: payload });
};

const createSkill = async (payload: Skill, user: JwtPayload) => {
  await checkUserRole(user.email, ["OWNER"]);

  const categoryExists = await prisma.skillCategory.findFirst({
    where: {
      id: payload.skillCategoryId,
    },
  });

  if (!categoryExists) {
    throw new AppError(status.NOT_FOUND, "Skill category not found.");
  }

  const exists = await prisma.skill.findFirst({
    where: {
      name: payload.name,
      skillCategoryId: payload.skillCategoryId,
    },
  });

  if (exists) {
    throw new AppError(
      status.CONFLICT,
      "A skill with the same name already exists."
    );
  }

  return await prisma.skill.create({ data: payload });
};

const getAllSkills = async () => {
  return await prisma.skill.findMany({
    include: {
      skillCategory: true,
    },
  });
};

const getAllSkillCategories = async () => {
  return await prisma.skillCategory.findMany({
    include: {
      skills: true,
    },
  });
};

const updateSkillCategory = async (
  categoryId: string,
  payload: SkillCategory,
  user: JwtPayload
) => {
  await checkUserRole(user.email, ["OWNER"]);

  const exists = await prisma.skillCategory.findFirst({
    where: {
      id: categoryId,
    },
  });

  if (!exists) {
    throw new AppError(status.NOT_FOUND, "Skill category not found.");
  }

  const result = await prisma.skillCategory.update({
    where: {
      id: categoryId,
    },
    data: payload,
  });

  return result;
};

const updateSkill = async (
  skillId: string,
  payload: Skill,
  user: JwtPayload
) => {
  await checkUserRole(user.email, ["OWNER"]);

  const exists = await prisma.skill.findFirst({
    where: {
      id: skillId,
    },
  });

  if (!exists) {
    throw new AppError(status.NOT_FOUND, "Skill not found.");
  }

  const result = await prisma.skill.update({
    where: {
      id: skillId,
    },
    data: payload,
  });

  return result;
};

const deleteSkill = async (skillId: string, user: JwtPayload) => {
  await checkUserRole(user.email, ["OWNER"]);

  const exists = await prisma.skill.findFirst({
    where: {
      id: skillId,
    },
  });

  if (!exists) {
    throw new AppError(status.NOT_FOUND, "Skill not found.");
  }

  return await prisma.skill.delete({
    where: {
      id: skillId,
    },
  });
};

const deleteSkillCategory = async (categoryId: string, user: JwtPayload) => {
  await checkUserRole(user.email, ["OWNER"]);

  const exists = await prisma.skillCategory.findFirst({
    where: {
      id: categoryId,
    },
  });

  if (!exists) {
    throw new AppError(status.NOT_FOUND, "Skill category not found.");
  }

  return await prisma.skillCategory.delete({
    where: {
      id: categoryId,
    },
  });
};

export const SkillsServices = {
  createSkillCategory,
  updateSkillCategory,
  createSkill,
  getAllSkills,
  getAllSkillCategories,
  updateSkill,
  deleteSkill,
  deleteSkillCategory
};

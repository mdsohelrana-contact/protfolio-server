import { AboutMe, SectionType } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { checkUserRole } from "../../utils/checkUserRole";
import prisma from "../../shared/prismaClient";
import AppError from "../../middlewares/AppError";
import status from "http-status";

const updateAbout = async (payload: AboutMe, user: JwtPayload) => {
  await checkUserRole(user.email, ["OWNER"]);

  const existing = await prisma.aboutMe.findFirst({
    where: { section: payload.section },
  });

  if (!existing) {
    return await prisma.aboutMe.create({
      data: {
        ...payload,
        section: payload.section as SectionType,
      },
    });
  }

  return await prisma.aboutMe.update({
    where: { id: existing.id },
    data: payload,
  });
};

const getAbout = async (section: SectionType) => {
  const about = await prisma.aboutMe.findFirst({
    where: { section },
  });

  if (!about) throw new AppError(status.NOT_FOUND, "AboutMe not found");

  return about;
};

export const AboutServices = {
  getAbout,
  updateAbout,
};

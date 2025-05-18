import { AboutMe } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { checkUserRole } from "../../utils/checkUserRole";
import prisma from "../../shared/prismaClient";

const createOrUpdate = async (payload: AboutMe, user: JwtPayload) => {
  await checkUserRole(user.email, ["OWNER"]);

  const existing = await prisma.aboutMe.findFirst({
    where: { id: payload.id },
  });
  if (existing) {
    return await prisma.aboutMe.update({
      where: { id: payload.id },
      data: payload,
    });
  } else {
    return await prisma.aboutMe.create({ data: payload });
  }
};

const getAboutMe = async () => {
  const existing = await prisma.aboutMe.findFirst({
    orderBy: { createdAt: "desc" },
  });
  if (existing) {
    return existing;
  } else {
    return null;
  }
};

export const AboutServices = {
  createOrUpdate,
  getAboutMe,
};

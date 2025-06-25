import { JwtPayload } from "jsonwebtoken";
import prisma from "../../shared/prismaClient";
import { checkUserRole } from "../../utils/checkUserRole";
import { ContactInfo } from "@prisma/client";
import status from "http-status";
import AppError from "../../middlewares/AppError";

const createContactInfo = async (payload: ContactInfo, user: JwtPayload) => {
  await checkUserRole(user.email, ["OWNER"]);

  console.log(payload)

  if (payload.id) {
    await prisma.contactInfo.update({
      where: { id: payload.id },
      data: payload,
    });
  }
  return await prisma.contactInfo.create({ data: payload });
};

const getContactInfo = async () => {
  return await prisma.contactInfo.findFirst({
    orderBy: { createdAt: "desc" },
  });
};

const updateContactInfo = async (
  contactInfoId: string,
  payload: ContactInfo,
  user: JwtPayload
) => {
  await checkUserRole(user.email, ["OWNER"]);

  const existing = await prisma.contactInfo.findUnique({
    where: { id: contactInfoId },
  });

  if (!existing) {
    throw new AppError(status.NOT_FOUND, "Contact info not found.");
  }

  return await prisma.contactInfo.update({
    where: { id: existing.id },
    data: payload,
  });
};

export const contactInfoService = {
  getContactInfo,
  createContactInfo,
  updateContactInfo,
};

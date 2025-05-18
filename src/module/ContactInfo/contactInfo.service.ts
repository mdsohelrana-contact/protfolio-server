import { JwtPayload } from "jsonwebtoken";
import prisma from "../../shared/prismaClient";
import { checkUserRole } from "../../utils/checkUserRole";
import { ContactInfo } from "@prisma/client";
import status from "http-status";
import AppError from "../../middlewares/AppError";



const createContactInfo = async (payload: ContactInfo, user: JwtPayload) => {
  await checkUserRole(user.email, ["OWNER"]);

  const existing = await prisma.contactInfo.findFirst();
  if (existing) {
    throw new AppError(status.BAD_REQUEST, "Contact info already exists.");
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

const deleteContactInfo = async (contactInfoId: string, user: JwtPayload) => {
  await checkUserRole(user.email, ["OWNER"]);

  const existing = await prisma.contactInfo.findUnique({
    where: { id: contactInfoId },
  });

  if (!existing) {
    throw new AppError(status.NOT_FOUND, "Contact info not found.");
  }

  return await prisma.contactInfo.delete({ where: { id: existing.id } });
};

export const contactInfoService = {
  getContactInfo,
  createContactInfo,
  updateContactInfo,
  deleteContactInfo,
};

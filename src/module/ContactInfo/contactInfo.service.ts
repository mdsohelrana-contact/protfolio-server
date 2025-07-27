import { JwtPayload } from "jsonwebtoken";
import prisma from "../../shared/prismaClient";
import { checkUserRole } from "../../utils/checkUserRole";
import status from "http-status";
import AppError from "../../middlewares/AppError";
import { ContactInfo } from "@prisma/client";

const createContactInfo = async (
  payload: ContactInfo & { SocialLink?: any[] },
  user: JwtPayload
) => {
  await checkUserRole(user.email, ["OWNER"]);

  const { SocialLink, ...rest } = payload;

  if (payload.id) {
    await prisma.contactInfo.update({
      where: { id: payload.id },
      data: {
        ...rest,
        SocialLink: SocialLink
          ? {
              deleteMany: {},
              create: SocialLink.map((link: any) => ({
                type: link.type,
                url: link.url,
              })),
            }
          : undefined,
      },
    });
    return { message: "Contact info updated successfully" };
  }

  return await prisma.contactInfo.create({
    data: {
      ...rest,
      SocialLink: SocialLink
        ? {
            create: SocialLink.map((link: any) => ({
              type: link.type,
              url: link.url,
            })),
          }
        : undefined,
    },
    include: {
      SocialLink: true,
    },
  });
};

const getContactInfo = async () => {
  return await prisma.contactInfo.findFirst({
    orderBy: { createdAt: "desc" },
    include: {
      SocialLink: true,
    },
  });
};

const updateContactInfo = async (
  contactInfoId: string,
  payload: ContactInfo & { SocialLink?: any[] },
  user: JwtPayload
) => {
  await checkUserRole(user.email, ["OWNER"]);

  const existing = await prisma.contactInfo.findUnique({
    where: { id: contactInfoId },
    include: { SocialLink: true },
  });

  if (!existing) {
    throw new AppError(status.NOT_FOUND, "Contact info not found.");
  }
  const { SocialLink, ...restPayload } = payload;

  await prisma.socialLink.deleteMany({
    where: { contactId: contactInfoId },
  });

  const newLinks =
    SocialLink?.map((link) => ({
      ...link,
      contactId: contactInfoId,
    })) ?? [];

  await prisma.socialLink.createMany({
    data: newLinks,
  });

  return await prisma.contactInfo.update({
    where: { id: contactInfoId },
    data: restPayload,
    include: { SocialLink: true },
  });
};

export const contactInfoService = {
  getContactInfo,
  createContactInfo,
  updateContactInfo,
};

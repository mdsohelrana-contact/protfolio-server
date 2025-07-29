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

  const firstSocialLink =
    SocialLink && SocialLink.length > 0 ? SocialLink[0] : null;

  const existing = await prisma.contactInfo.findFirst();

  if (existing) {
    await prisma.contactInfo.update({
      where: { id: existing.id },
      data: {
        ...rest,
        SocialLink: firstSocialLink
          ? {
              deleteMany: {},
              create: {
                type: firstSocialLink.type,
                url: firstSocialLink.url,
              },
            }
          : undefined,
      },
    });
    return { message: "Contact info updated successfully" };
  } else {
    return await prisma.contactInfo.create({
      data: {
        ...rest,
        SocialLink: firstSocialLink
          ? {
              create: {
                type: firstSocialLink.type,
                url: firstSocialLink.url,
              },
            }
          : undefined,
      },
      include: {
        SocialLink: true,
      },
    });
  }
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

  // Update main contact info
  if (Object.keys(restPayload).length > 0) {
    await prisma.contactInfo.update({
      where: { id: contactInfoId },
      data: restPayload,
    });
  }

  //  Update or add social links
  if (SocialLink && SocialLink.length > 0) {
    for (const link of SocialLink) {
      const existingLink = await prisma.socialLink.findFirst({
        where: {
          contactId: contactInfoId,
          type: link.type,
        },
      });

      if (existingLink) {
        await prisma.socialLink.update({
          where: { id: existingLink.id },
          data: {
            url: link.url,
          },
        });
      } else {
        await prisma.socialLink.create({
          data: {
            ...link,
            contactId: contactInfoId,
          },
        });
      }
    }
  }

  // Return updated contact info
  return await prisma.contactInfo.findUnique({
    where: { id: contactInfoId },
    include: {
      SocialLink: true,
    },
  });
};

const deleteSocialLinkById = async (socialLinkId: string, user: JwtPayload) => {
  await checkUserRole(user.email, ["OWNER"]);

  const existing = await prisma.socialLink.findUnique({
    where: { id: socialLinkId },
  });

  if (!existing) {
    throw new AppError(status.NOT_FOUND, "Social link not found.");
  }

  await prisma.socialLink.delete({
    where: { id: socialLinkId },
  });
  return { message: "Social link deleted successfully" };
};

export const contactInfoService = {
  getContactInfo,
  createContactInfo,
  updateContactInfo,
  deleteSocialLinkById,
};

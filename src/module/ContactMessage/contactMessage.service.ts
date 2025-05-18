import { JwtPayload } from "jsonwebtoken";
import prisma from "../../shared/prismaClient";
import { checkUserRole } from "../../utils/checkUserRole";

const createMessage = async (payload: {
  name: string;
  email: string;
  message: string;
}) => {
  return await prisma.contactMessage.create({ data: payload });
};

const getMessages = async (user: JwtPayload) => {
  await checkUserRole(user.email, ["OWNER"]);

  return await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
};

const deleteMessage = async (id: string, user: JwtPayload) => {
  await checkUserRole(user.email, ["OWNER"]);

  const exists = await prisma.contactMessage.findUnique({ where: { id } });
  if (!exists) {
    throw new Error("Message not found");
  }

  return await prisma.contactMessage.delete({ where: { id } });
};

export const ContactMessageService = {
  createMessage,
  getMessages,
  deleteMessage,
};

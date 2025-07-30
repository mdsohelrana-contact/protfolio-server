import { JwtPayload } from "jsonwebtoken";
import prisma from "../../shared/prismaClient";
import { checkUserRole } from "../../utils/checkUserRole";
import config from "../../config";
import mailSender from "../../Email/mailer";
import path from "path";
import fs from "fs";
import mailOptions from "../../Email/mailOptions";

const createMessage = async (payload: {
  name: string;
  email: string;
  message: string;
}) => {
  // Save message to DB
  const savedMessage = await prisma.contactMessage.create({
    data: payload,
  });

  // Send email (you must have mailSender implemented)
  const mailToOwner = mailOptions(payload);

  const replyTemplatePath = path.join(
    process.cwd(),
    "src",
    "Email",
    "email-reply.html"
  );
  const replyTemplate = fs.readFileSync(replyTemplatePath, "utf-8");

  const replyHtml = replyTemplate
    .replace(/{{name}}/g, payload.name)
    .replace(/{{email}}/g, payload.email)
    .replace(/{{message}}/g, payload.message.replace(/\n/g, "<br>"));

  const mailToSender = {
    from: `"Sohel Rana" <${config.email.user}>`,
    to: payload.email,
    subject: `We Received Your Message!`,
    html: replyHtml,
  };

  await Promise.all([mailSender(mailToOwner), mailSender(mailToSender)]);

  return savedMessage;
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

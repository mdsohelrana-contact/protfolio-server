import status from "http-status";
import AppError from "../middlewares/AppError";
import prisma from "../shared/prismaClient";

export async function checkUserRole(userEmail: string | undefined, allowedRoles: string[]) {
  if (!userEmail) {
    throw new AppError(status.UNAUTHORIZED, "User email is required");
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  if (!allowedRoles.includes(user.role)) {
    throw new AppError(status.UNAUTHORIZED, "Unauthorized");
  }

  return user;
}
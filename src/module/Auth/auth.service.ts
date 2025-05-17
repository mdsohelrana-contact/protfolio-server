import bcrypt from "bcrypt";
import prisma from "../../shared/prismaClient";
import { User, UserRole } from "@prisma/client";
import { generateToken } from "../../utils/jwt";
import AppError from "../../middlewares/AppError";
import { HttpStatus } from "http-status-ts";

export const registerUser = async ({ name, email, password, role }: User) => {
  const existingOwner = await prisma.user.findFirst({
    where: {
      role: UserRole.OWNER,
    },
  });

  if (existingOwner) throw new Error("Owner already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      // role: UserRole.USER,
      role: role,
    },
  });

  return user;
};

export const loginUser = async ({ email, password }: any) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new AppError(HttpStatus.BAD_REQUEST, "Invalid credentials");
  }

  const accessToken = generateToken(user);

  return { accessToken };
};

export const AuthServices = {
  registerUser,
  loginUser,
};

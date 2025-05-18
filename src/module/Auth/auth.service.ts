import bcrypt from "bcrypt";
import prisma from "../../shared/prismaClient";
import { User, UserRole } from "@prisma/client";
import { generateToken, verifyToken } from "../../utils/jwtUtils";
import AppError from "../../middlewares/AppError";
import status from "http-status";
import config from "../../config";
import { JwtPayload } from "jsonwebtoken";
import { checkUserRole } from "../../utils/checkUserRole";

const registerUser = async ({ name, email, password }: User) => {
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
      role: UserRole.USER,
    },
  });

  return user;
};
const loginUser = async ({ email, password }: any) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new AppError(status.BAD_REQUEST, "Invalid credentials");
  }

  const accessToken = generateToken(user, config.accessToken.secret as string);

  const refreshToken = generateToken(
    user,
    config.refreshToken.secret as string
  );

  return { accessToken, refreshToken };
};

const refreshToken = async (token: string) => {
  let decodedData: JwtPayload;
  try {
    decodedData = verifyToken(
      token,
      config.refreshToken.secret as string
    ) as JwtPayload;
  } catch (error) {
    throw new AppError(status.FORBIDDEN, "You are not authorized!");
  }
  //  user exists or not
  const user = await checkUserRole(decodedData.email, ["OWNER"]);

  const accessToken = generateToken(user, config.accessToken.secret as string);
  const refreshToken = generateToken(
    user,
    config.refreshToken.secret as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  user: JwtPayload
) => {
  const existingUser = await checkUserRole(user.email, ["OWNER"]);

  const isCorrectPassword: boolean = await bcrypt.compare(
    oldPassword,
    existingUser.password
  );

  if (!isCorrectPassword) {
    throw new AppError(status.BAD_REQUEST, "Password incorrect!");
  }

  const hashedPassword: string = await bcrypt.hash(
    newPassword,
    Number(config.saltRound)
  );

  await prisma.user.update({
    where: {
      email: existingUser.email,
    },
    data: {
      password: hashedPassword,
    },
  });

  return {
    message: "Password changed successfully",
  };
};

// const forgotPassword = async (payload: { email: string }) => {
//   const userData = await prisma.user.findUnique({
//     where: {
//       email: payload.email,
//     },
//   });

//   if (!userData) {
//     throw new AppError(status.NOT_FOUND, "User not found");
//   }

//   const resetPassToken = jwt.sign(
//     { id: userData.id, role: userData.role, email: userData.email },
//     config.resetPassword.secret as string,
//     {
//       expiresIn: "10m",
//     }
//   );

//   const resetPassLink =
//     config.resetPassword.resetPassLink + `?userId=${userData.id}&token=${resetPassToken}`;

//   const htmlContent = `
//     <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; background-color: #1f1b2e; border-radius: 12px; border: 1px solid #3d2f59; color: #e0e0f0;">
//       <h2 style="color: #d6b1ff; text-align: center;">🔐 Password Reset Request</h2>
//       <p style="font-size: 16px; margin-bottom: 20px;">Hello <strong>${
//         userData.name || "User"
//       }</strong>,</p>
//       <p style="font-size: 15px; line-height: 1.6;">
//         We received a request to reset your password. To proceed, please click the button below:
//       </p>

//       <div style="text-align: center; margin: 30px 0;">
//         <a href="${resetPassLink}" style="text-decoration: none;">
//           <button style="background-color: #8a4fff; color: #ffffff; padding: 14px 28px; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer;">
//             Reset Password
//           </button>
//         </a>
//       </div>

//       <p style="font-size: 14px; color: #c2b8e3;">
//         If you didn’t request this, you can safely ignore this email.
//       </p>

//       <hr style="border: none; border-top: 1px solid #3d2f59; margin: 30px 0;" />

//       <p style="font-size: 14px; text-align: center;">
//         Need help? Contact us at <a href="${
//           config.CLIENT_URL
//         }/contact" style="color: #a472f4; text-decoration: underline;">support</a><br/>
//         <strong>— The Eventlyze Team</strong>
//       </p>
//     </div>
// `;

//   await emailSender(
//     userData.email,
//     "Password Reset Request",
//     "Click the link to reset your password",
//     htmlContent
//   );

//   // console.log(resetPassLink);
// };

export const AuthServices = {
  registerUser,
  loginUser,
  refreshToken,
  changePassword,
};

import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { AuthServices } from "./auth.service";
import responseHandler from "../../shared/responseHandler";
import config from "../../config";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.registerUser(req.body);

  responseHandler(res, true, "User registered successfully", result);
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);

  res.cookie("refreshToken", result.refreshToken, {
    secure: config.nodeEnv === "production",
    httpOnly: true,
    sameSite: "strict",
  });

  responseHandler(res, true, "User logged in successfully", {
    accessToken: result.accessToken,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.refreshToken(req.cookies.refreshToken);

  res.cookie("refreshToken", result.refreshToken, {
    secure: config.nodeEnv === "production",
    httpOnly: true,
    sameSite: "strict",
  });

  responseHandler(res, true, "Access token refreshed successfully", {
    accessToken: result.accessToken,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  await AuthServices.changePassword(oldPassword, newPassword, req.user!);
  responseHandler(res, true, "Password changed successfully");
});

export const AuthControllers = {
  registerUser,
  loginUser,
  refreshToken,
  changePassword,
};

import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { AuthServices } from "./auth.service";
import responseHandler from "../../shared/responseHandler";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.registerUser(req.body);

  responseHandler(res, true, "User registered successfully", result);
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);

  responseHandler(res, true, "User logged in successfully", result);
});

export const AuthControllers = { registerUser, loginUser };
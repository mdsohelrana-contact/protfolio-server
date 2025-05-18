import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { AboutServices } from "./about.service";
import responseHandler from "../../shared/responseHandler";

const createOrUpdate = catchAsync(async (req: Request, res: Response) => {
  const result = await AboutServices.createOrUpdate(req.body, req.user!);

  responseHandler(res, true, "About me updated successfully", result);
});

const getAboutMe = catchAsync(async (req: Request, res: Response) => {
  const result = await AboutServices.getAboutMe();

  responseHandler(res, true, "About me fetched successfully", result);
});

export const AboutControllers = { createOrUpdate, getAboutMe };

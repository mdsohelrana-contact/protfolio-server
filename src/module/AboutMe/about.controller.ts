import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { AboutServices } from "./about.service";
import responseHandler from "../../shared/responseHandler";

const createAbout = catchAsync(async (req: Request, res: Response) => {
  const result = await AboutServices.createAbout(req.body, req.user!);

  responseHandler(res, true, "About me created successfully", result);
});

const updateAbout = catchAsync(async (req: Request, res: Response) => {
  const result = await AboutServices.updateAbout(
    req.body,
    req.user!,
    req.params.aboutId
  );

  responseHandler(res, true, "About me updated successfully", result);
});

const deleteAbout = catchAsync(async (req: Request, res: Response) => {
  const result = await AboutServices.deleteAbout(req.user!, req.params.aboutId);

  responseHandler(res, true, "About me deleted successfully",);
});

const getAbout = catchAsync(async (req: Request, res: Response) => {
  const result = await AboutServices.getAbout();

  responseHandler(res, true, "About me fetched successfully", result);
});

export const AboutControllers = {
  createAbout,
  updateAbout,
  deleteAbout,
  getAbout,
};

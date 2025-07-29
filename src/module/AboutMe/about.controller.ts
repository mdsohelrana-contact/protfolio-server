import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { AboutServices } from "./about.service";
import responseHandler from "../../shared/responseHandler";
import { SectionType } from "@prisma/client";

const updateAbout = catchAsync(async (req: Request, res: Response) => {
  const section = req.query.section as string;

  if (!section) {
    return responseHandler(res, false, "Section not found", null);
  }

  const payload = {
    ...req.body,
    section,
  };

  const result = await AboutServices.updateAbout(payload, req.user!);

  responseHandler(res, true, "About me updated successfully", result);
});

const getAbout = catchAsync(async (req: Request, res: Response) => {
  const section = req.query.section as SectionType;

  if (!section) {
    return responseHandler(res, false, "Section not found", null);
  }

  const result = await AboutServices.getAbout(section);

  responseHandler(res, true, "About me fetched successfully", result);
});

export const AboutControllers = {
  updateAbout,
  getAbout,
};

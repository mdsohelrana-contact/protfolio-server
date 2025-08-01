import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { contactInfoService } from "./contactInfo.service";
import responseHandler from "../../shared/responseHandler";
import status from "http-status";

const createContactInfo = catchAsync(async (req: Request, res: Response) => {
  const result = await contactInfoService.createContactInfo(
    req.body,
    req.user!
  );

  responseHandler(res, true, "Contact info created successfully", result);
});

const getContactInfo = catchAsync(async (req: Request, res: Response) => {
  const result = await contactInfoService.getContactInfo();

  responseHandler(res, true, "Contact info fetched successfully", result);
});

const updateContactInfo = catchAsync(async (req: Request, res: Response) => {


  const result = await contactInfoService.updateContactInfo(
    req.params.id,
    req.body,
    req.user!
  );

  responseHandler(res, true, "Contact info updated successfully", result);
});

const deleteSocialLinkById = catchAsync(async (req: Request, res: Response) => {


  const result = await contactInfoService.deleteSocialLinkById(
    req.params.id,
    req.user!
  );
  

  responseHandler(res, true, "Social link deleted successfully", result,status.OK);
});

export const ContactInfoControllers = {
  createContactInfo,
  getContactInfo,
  updateContactInfo,
  deleteSocialLinkById,
};

import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { ContactMessageService } from "./contactMessage.service";
import responseHandler from "../../shared/responseHandler";

const createMessage = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactMessageService.createMessage(req.body);

  responseHandler(res, true, "Message send successfully", result);
});

const getMessages = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactMessageService.getMessages(req.user!);

  responseHandler(res, true, "Contact messages fetched successfully", result);
});

const deleteMessage = catchAsync(async (req: Request, res: Response) => {
  await ContactMessageService.deleteMessage(req.params.id, req.user!);

  responseHandler(res, true, "Contact message deleted successfully");
});

export const ContactMessageControllers = {
  createMessage,
  getMessages,
  deleteMessage,
};

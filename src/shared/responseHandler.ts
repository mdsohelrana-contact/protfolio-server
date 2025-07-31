import { Response } from "express";

const responseHandler = <T>(
  res: Response,
  success: boolean,
  message: string,
  data?: T | null,
  statusCode = 200
) => {
  res.status(statusCode).json({
    success,
    message,
    data,
  });
};

export default responseHandler;

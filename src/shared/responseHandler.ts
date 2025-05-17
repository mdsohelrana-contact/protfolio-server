import { Response } from "express";

const responseHandler = <T>(
  res: Response,
  success: boolean,
  message: string,
  data?: T | null
) => {
  res.json({
    success,
    message,
    data,
  });
};

export default responseHandler;

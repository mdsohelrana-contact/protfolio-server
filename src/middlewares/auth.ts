import { NextFunction, Request, Response } from "express";
import AppError from "./AppError";
import status from "http-status";
import { verifyToken } from "../utils/jwtUtils";
import { JwtPayload } from "jsonwebtoken";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError(status.UNAUTHORIZED, "Your are unauthorized");
      }
      const verifiedUser = (await verifyToken(token)) as JwtPayload;

      console.log(verifiedUser);

      req.user = verifiedUser;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new AppError(status.FORBIDDEN, "Access denied. Forbidden.");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;

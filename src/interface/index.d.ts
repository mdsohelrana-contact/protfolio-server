import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        id: string;
        role: string;
        email: string;
        iat?: number;
        exp?: number;
      };
    }
  }
}

export {};

import jwt from "jsonwebtoken";
import config from "../config";

const secret = config.jwt.accessTokenSecret as string;

export const generateToken = (user: any) => {
  return jwt.sign({ id: user.id, role: user.role, email: user.email }, secret, {
    expiresIn: "1d",
  });
};

import jwt, { Secret } from "jsonwebtoken";


export const generateToken = (user: any,secret:Secret) => {
  return jwt.sign({ id: user.id, role: user.role, email: user.email }, secret, {
    expiresIn: "1d",
  });
};


export const verifyToken = (token: string,secret:Secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
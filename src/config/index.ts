import dotenv from "dotenv";

import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });

export default {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  saltRound: process.env.SALT_ROUND,
  clientUrl:process.env.CLIENT_URL,
  accessToken: {
    secret: process.env.ACCESS_TOKEN_SECRET,
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  },
  refreshToken: {
    secret: process.env.REFRESH_TOKEN_SECRET,
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  },
  resetPassword: {
    secret: process.env.RESET_PASSWORD_SECRET,
    expiresIn: process.env.RESET_PASSWORD_EXPIRES_IN,
    resetPassLink: process.env.RESET_PASSWORD_LINK,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  ipInfo: {
    url: process.env.IPINFO_URL,
    token: process.env.IPINFO_TOKEN,
  },
};

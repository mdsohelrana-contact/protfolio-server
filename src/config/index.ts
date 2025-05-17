import dotenv from "dotenv";

import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });

export default {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  saltRound: process.env.SALT_ROUND,
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  },
};

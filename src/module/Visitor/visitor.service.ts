import config from "../../config";

import axios from "axios";
import AppError from "../../middlewares/AppError";

const IPINFO_TOKEN = String(config.ipInfo.token);

const getVisitorInfo = async (ip: string) => {
  try {
    const response = await axios.get(
      `https://ipinfo.io/${ip}/json?token=${IPINFO_TOKEN}`
    );
    if (response.status !== 200) {
      throw new AppError(500, `Failed to fetch visitor info for IP: ${ip}`);
    }
    const data = response.data;
    console.log("🚀 ~ data:", data);

    return {
      ipAddress: data.ip,
      city: data.city,
      country: data.country,
      region: data.region,
      org: data.org,
      timezone: data.timezone,
      loc: data.loc, // lat,long string
    };
  } catch (error) {
    console.error("Error fetching visitor info:", error);
    return null;
  }
};

const createVisitor = async (data: any) => {
  console.log("Creating visitor with data:", data);
  return {
    name: data.name,
    email: data.email,
    phone: data.phone,
    visitedAt: new Date(),
  };
};


export const visitorService = {
  createVisitor,
    getVisitorInfo,
};

// import { UAParser } from "ua-parser-js";
// import geoip from "geoip-lite";
// import { Request } from "express";

// export const getVisitorData = async (req: Request) => {
//   const ip =
//     req.headers["x-forwarded-for"]?.toString().split(",")[0].trim() ||
//     req.socket.remoteAddress ||
//     "";

//   // Geo Location
//   const geo = geoip.lookup(ip === "::1" ? "8.8.8.8" : ip);

//   // Device Info
//   const parser = new UAParser();
//   const ua = req.headers["user-agent"] || "";
//   const result = parser.setUA(ua).getResult();

//   const visitorData = {
//     ipAddress: ip,
//     country: geo?.country || "Unknown",
//     city: geo?.city || "Unknown",
//     browser: `${result.browser.name} ${result.browser.version}`,
//     os: `${result.os.name} ${result.os.version}`,
//     deviceType: result.device.type || "Desktop",
//     time: new Date().toISOString(),
//   };

//   console.log("Visitor Info:", visitorData);
//   return visitorData;
// };


// utils/getVisitorData.ts
import axios from "axios";
import useragent from "useragent";
import { Request } from "express";
import config from "../config";

export const getVisitorData = async (req: Request) => {
  let ip =
    req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
    req.socket.remoteAddress ||
    "";
  if (ip === "::1" || ip === "127.0.0.1") {
    ip = "8.8.8.8"; // fallback for localhost
  }

  // User agent parse
  const agent = useragent.parse(req.headers["user-agent"]);

  // Get location from IP using ipinfo.io
  let country = "Unknown";
  let city = "Unknown";

  try {
    const token = config.ipInfo.token;
    const res = await axios.get(`https://ipinfo.io/${ip}?token=${token}`);
    country = res.data.country || "Unknown";
    city = res.data.city || "Unknown";
  } catch (err:any) {
    console.error("Location fetch error:", err.message);
  }

  return {
    ipAddress: ip,
    country,
    city,
    deviceType: agent.device.toString().toLowerCase().includes("mobile")
      ? "Mobile"
      : "Desktop",
    browser: `${agent.family} ${agent.major}.${agent.minor}.${agent.patch}`,
    os: `${agent.os.family} ${agent.os.major}.${agent.os.minor}.${agent.os.patch}`,
  };
};

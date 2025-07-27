import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";

export function extractVisitorData(req: any) {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    "Unknown";

  const geo: geoip.Lookup | null = geoip.lookup(ip);

  const parser = new UAParser(req.headers["user-agent"]);
  const ua = parser.getResult();

  return {
    ipAddress: ip,
    country: geo?.country || "",
    city: geo?.city || "",
    browser: ua?.browser?.name + " " + ua?.browser?.version,
    os: ua?.os?.name + " " + ua?.os?.version,
    deviceType: ua?.device?.type || "Desktop",
  };
}

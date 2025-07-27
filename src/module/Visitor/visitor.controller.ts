import express from "express";
import { UAParser } from "ua-parser-js";
import geoip from "geoip-lite";

const app = express();
app.use(express.json());

app.post("/api/track", (req, res) => {
  const ip =
    req.headers["x-forwarded-for"]?.toString().split(",")[0].trim() ||
    req.socket.remoteAddress ||
    "";

  // Geo Location
  const geo = geoip.lookup(ip === "::1" ? "8.8.8.8" : ip); // fallback to Google Public DNS

  // Device Info
  const parser = new UAParser();
  const ua = req.headers["user-agent"] || "";
  const result = parser.setUA(ua).getResult();

  const visitorData = {
    ipAddress: ip,
    country: geo?.country || "Unknown",
    city: geo?.city || "Unknown",
    browser: `${result.browser.name} ${result.browser.version}`,
    os: `${result.os.name} ${result.os.version}`,
    deviceType: result.device.type || "Desktop",
    isMobile: result.device.type === "mobile",
    isTablet: result.device.type === "tablet",
    isDesktop: !result.device.type,
    time: new Date().toISOString(),
  };

  console.log("Visitor Info:", visitorData);

  res.status(200).json({ message: "Visitor data tracked.", data: visitorData });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import nodemailer from "nodemailer";
import config from "../config";
import AppError from "../middlewares/AppError";
import status from "http-status";



// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

const mailSender = async (mailOptions: any) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error: any) {
    throw new AppError(status.BAD_REQUEST, error.message);
  }
};

export default mailSender;

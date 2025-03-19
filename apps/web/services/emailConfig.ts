import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nitishraigkp007@gmail.com",  // Your email
    pass: "bxagrgsfjpauoquk",  // Your email password or app password
  },
});

export default transporter;

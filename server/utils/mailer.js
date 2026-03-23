import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
  path: path.resolve(__dirname, "../.env")
});

const transporter = nodemailer.createTransport({

  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }

});
export const sendMail = async (options) => {

  try {

    console.log("📧 Preparing email...");

    const info = await transporter.sendMail({

      from: process.env.EMAIL_USER,
      ...options

    });

    console.log("📧 Email sent:", info.messageId);

    return info;

  } catch (error) {

    console.error("❌ Email sending failed:", error);

    throw error;

  }

};
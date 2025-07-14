import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendApprovalEmail(to: string) {
  if (!process.env.SMTP_FROM) return;
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "Ad Approved",
    text:
      "Your exjobb ad has been approved. Please register a company account to manage it.",
  });
}

export async function sendRejectionEmail(to: string) {
  if (!process.env.SMTP_FROM) return;
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "Ad Rejected",
    text: "Unfortunately your exjobb ad was rejected. You are welcome to submit another advertisement.",
  });
}
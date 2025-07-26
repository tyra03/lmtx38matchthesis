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
  tls: { rejectUnauthorized: false },
});

export async function sendApprovalEmail(to: string, password: string) {
  const host = process.env.SMTP_HOST;
  if (!process.env.SMTP_FROM || !host || host === "your_smtp_host") {
    console.warn("SMTP settings missing, skipping approval email");
    return;
  }
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: "Ad Approved",
      text:
        `Your exjobb ad at MatchThesis has been approved!\n` +
        `An account has been created for you. You can now log in to your account using the email address used when creating the exjobb ad and the temporary password below.\n` +
        `Temporary password: ${password}`,
    });
  } catch (err) {
    console.error("Failed to send approval email", err);
  }
}

export async function sendRejectionEmail(to: string) {
  const host = process.env.SMTP_HOST;
  if (!process.env.SMTP_FROM || !host || host === "your_smtp_host") {
    console.warn("SMTP settings missing, skipping rejection email");
    return;
  }
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: "Ad Rejected",
      text: "Unfortunately your exjobb ad was rejected. You are welcome to submit another advertisement.",
    });
}
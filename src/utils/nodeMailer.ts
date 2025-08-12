import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  pool: true,
  maxConnections: 1,
  maxMessages: 3,
  socketTimeout: 30000,
  tls: { rejectUnauthorized: false },
  auth: {
    user: process.env.NEXT_PUBLIC_NODEMAILER_USER,
    pass: process.env.NEXT_PUBLIC_NODEMAILER_PASS,
  },
});

export default async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: `TreeWorld - Nature's Pure Quality <${process.env.NEXT_PUBLIC_NODEMAILER_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Message sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("❌ Email send error:", error.response || error);
    return { success: false, error: error.message || "Email sending failed" };
  }
}

import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.NEXT_PUBLIC_NODEMAILER_USER,
    pass: process.env.NEXT_PUBLIC_NODEMAILER_PASS,
  },
});

// async..await is not allowed in global scope, must use a wrapper
export default async function sendEmail({to, subject, html }:{to: string, subject: string, html: string} ) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `TreeWorld - Nature's Pure Quality <${process.env.NEXT_PUBLIC_NODEMAILER_USER}>`,
    to,
    subject,
    html,
  });

  console.log("Message sent: %s", info.messageId);

}

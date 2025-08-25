import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NEXT_PUBLIC_NODEMAILER_USER,
    pass: process.env.NEXT_PUBLIC_NODEMAILER_PASS,
  },
});

export default async function sendEmail({
  to,
  subject,
  htmlContent,
}: {
  to: string;
  subject: string;
  htmlContent: string;
}) {
 
  // 1️⃣ Send with Brevo first
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "api-key": process.env.NEXT_PUBLIC_BREVO_API_KEY as string,
      },
      body: JSON.stringify({
        name:"treeworldply",
        sender: {
          name: "TreeWorld",
          email: "gajanandtradershyderabad@gmail.com",
        },
        to: [{ email: to }],
        subject,
        htmlContent:htmlContent
      }),
    });


    if (!response.ok) {
      const errData = await response.json();
      console.error("❌ Brevo send error:", errData);
    }
    else {
      console.log(subject,"✅ Custom email sent (Brevo)",);
    }
  } catch (error: unknown) {
    if(error instanceof Error)
    console.error("❌ Brevo send error:", error.message || error);
  }

  // 2️⃣ Send fixed response with Nodemailer
  try {
    const info = await transporter.sendMail({
      from: `TreeWorld - Nature's Pure Quality <${process.env.NEXT_PUBLIC_NODEMAILER_USER}>`,
      to,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #ffffff;
              margin: 0;
              padding: 20px;
              color: #222;
            }
            h1 { color: #2f855a; font-size: 22px; }
            p { font-size: 15px; line-height: 1.6; }
            .contact { margin-top: 15px; font-size: 14px; }
            .footer { margin-top: 25px; font-size: 12px; color: #666; border-top: 1px solid #e2e8f0; padding-top: 10px; }
          </style>
        </head>
        <body>
          <h1>🌿 TreeWorldPly Appreciates You</h1>
          <p>Dear Friend,</p>
          <p>TreeWorldPly sincerely appreciates your support.<br/>
          Thanks for being with us — you are a <b>valuable part of our team</b>.</p>
          <p>Together, we continue to build a greener, sustainable future 🌎✨.</p>
          <div class="contact">
            📞 Contact us at:<br/>
            +91 92461 56208 | +91 97037 86208
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} TreeWorldPly. All rights reserved.
          </div>
        </body>
        </html>
      `,
    });

    console.log("✅thank-you email sent (Nodemailer):", info.messageId);
  } catch (error: unknown) {
    if(error instanceof Error)
    console.error("❌ Nodemailer send error:", error.message || error);
  }

}

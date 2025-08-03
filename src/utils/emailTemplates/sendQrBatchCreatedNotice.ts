import sendEmail from "@/utils/nodeMailer";

export async function sendQrBatchCreatedNotice(
  accessToken: string,
  batchNo: string,
  noOfQrCodes: number
) {
  const businessName = "Gajanand Traders"; // Change to your actual business/shop name

  if (
    accessToken &&
    accessToken.length > 10 &&
    batchNo &&
    noOfQrCodes > 0
  ) {
    const html = `
      <div style="
        font-family: 'Georgia', serif;
        max-width: 600px;
        margin: 40px auto;
        border: 1px solid #8B6D5C;
        border-radius: 14px;
        background-color: #f9f5f0;
        color: #4b3b2b;
        box-shadow: 0 6px 16px rgba(139, 109, 92, 0.35);
      ">
        <!-- Header -->
        <div style="
          background: linear-gradient(135deg, #7b5e44 0%, #a1866f 100%);
          color: white;
          padding: 28px 24px;
          text-align: center;
          border-top-left-radius: 14px;
          border-top-right-radius: 14px;
          box-shadow: inset 0 -3px 6px rgba(0,0,0,0.25);
        ">
          <h1 style="
            margin: 0;
            font-size: 28px;
            font-weight: 800;
            letter-spacing: 0.07em;
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          ">
            ${businessName} - QR Code Batch Created
          </h1>
        </div>

        <!-- Content -->
        <div style="padding: 36px 40px; text-align: center; line-height: 1.6;">
          <p style="
            font-size: 18px;
            margin: 0 0 28px 0;
            font-weight: 600;
            color: #5a4129;
          ">
            Dear Valued Partner,
          </p>

          <p style="
            font-size: 22px;
            font-weight: 700;
            margin: 0 0 28px 0;
            display: inline-block;
            background-color: #d4c9b1;
            color: #5a422d;
            border-radius: 32px;
            padding: 10px 26px;
            box-shadow: 0 3px 10px rgba(90, 66, 45, 0.15);
          ">
            Batch No: ${batchNo}
          </p>

          <p style="
            font-size: 16px;
            margin-bottom: 24px;
            color: #5a422d;
          ">
            Your batch of <strong>${noOfQrCodes}</strong> QR codes has been successfully generated.
          </p>

          <p style="
            font-size: 16px;
            margin-bottom: 24px;
            color: #5a422d;
          ">
            You can now start receiving payment requests securely using these QR codes.<br />
            We recommend printing or securely storing your QR codes for easy access.
          </p>

          <p style="
            font-size: 15px;
            margin-bottom: 0;
            font-weight: 600;
            color: #7a6650;
          ">
            <em>Reminder:</em> Please revoke any previously unused QR code batches to prevent unauthorized use.
          </p>

          <div style="margin-top: 36px; text-align: left; max-width: 80%; margin-left: auto; margin-right: auto;">
            <small style="
              display: block;
              background-color: #e7dfd6;
              color: #a38a6d;
              font-family: 'Courier New', Courier, monospace;
              padding: 10px 14px;
              border-radius: 8px;
              font-size: 11px;
              word-break: break-word;
              user-select: all;
            ">
              <strong>Access Token Used for this Batch:</strong><br />
              ${accessToken}
            </small>
          </div>
        </div>

        <!-- Footer -->
        <div style="
          background-color: #e7dfd6;
          padding: 20px 40px;
          font-size: 12px;
          color: #7a6753;
          text-align: center;
          font-style: italic;
          border-bottom-left-radius: 14px;
          border-bottom-right-radius: 14px;
        ">
          &copy; ${new Date().getFullYear()} ${businessName}. All rights reserved.
        </div>
      </div>
    `;

    await sendEmail({
      to: process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@example.com",
      subject: `🎉 ${businessName} - Your QR Code Batch is Ready`,
      html,
    });
  } else {
    console.warn(`Notice not sent - invalid or missing data. accessToken=${accessToken}, batchNo=${batchNo}, noOfQrCodes=${noOfQrCodes}`);
  }
}

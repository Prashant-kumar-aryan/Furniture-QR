import sendEmail from "@/utils/nodeMailer";

export async function sendQrBatchCreatedNotice(
  accessToken: string,
  batchNo: string,
  noOfQrCodes: number
) {
  const businessName = "Treeworld  Natures pure quality Ply|Board";

  if (
    accessToken &&
    accessToken.length > 10 &&
    batchNo &&
    noOfQrCodes > 0
  ) {
    const html = `
    <div style="
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 600px;
      margin: 40px auto;
      border: 1px solid #cce6cc;
      border-radius: 14px;
      background-color: #f6fff6;
      color: #2e5939;
      box-shadow: 0 6px 16px rgba(0, 128, 0, 0.2);
    ">
      <!-- Header -->
      <div style="
        background: linear-gradient(135deg, #1e7c4a 0%, #4caf50 100%);
        color: white;
        padding: 20px 24px;
        text-align: center;
        border-top-left-radius: 14px;
        border-top-right-radius: 14px;
        box-shadow: inset 0 -2px 6px rgba(0,0,0,0.2);
      ">
        <!-- Logo -->
        <div style="
          background-color: white;
          display: inline-block;
          border-radius: 50%;
          padding: 8px;
          margin-bottom: 10px;
        ">
          <img src="https://res.cloudinary.com/dtsf7jbkq/image/upload/v1754586646/Add_a_subheading_20250409_123137_0000_pq4ohe.png"
            alt="Logo"
            width="160"
            height="160"
            style="display: block;" />
        </div>
        <h1 style="
          margin: 6px 0 0 0;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        ">
          ${businessName} - QR Code Batch Created
        </h1>
      </div>

      <!-- Content -->
      <div style="padding: 30px 36px; text-align: center; line-height: 1.6;">
        <p style="font-size: 18px; margin: 0 0 24px; font-weight: 600;">
          Dear Valued Partner,
        </p>

        <p style="
          font-size: 20px;
          font-weight: 700;
          background-color: #d6f5d6;
          color: #256d3d;
          display: inline-block;
          padding: 10px 24px;
          border-radius: 30px;
          box-shadow: 0 3px 8px rgba(0, 128, 0, 0.1);
          margin-bottom: 24px;
        ">
          Batch No: ${batchNo}
        </p>

        <p style="font-size: 16px; margin-bottom: 20px;">
          Your batch of <strong>${noOfQrCodes}</strong> QR codes has been successfully generated.
        </p>

        <p style="font-size: 16px; margin-bottom: 20px;">
          You can now start receiving payment requests securely using these QR codes.<br/>
          We recommend printing or securely storing your QR codes for easy access.
        </p>

        <p style="
          font-size: 15px;
          font-style: italic;
          margin-bottom: 0;
          color: #3b5e3b;
        ">
          <strong>Note:</strong> Please revoke any previously unused QR code batches to prevent unauthorized use.
        </p>

        <div style="
          margin-top: 30px;
          text-align: left;
          background-color: #ecf9ec;
          padding: 14px;
          border-radius: 8px;
          font-size: 12px;
          word-break: break-word;
          font-family: 'Courier New', monospace;
        ">
          <strong>Access Token Used for this Batch:</strong><br/>
          ${accessToken}
        </div>
      </div>

      <!-- Footer -->
      <div style="
        background-color: #e6ffe6;
        padding: 16px 30px;
        font-size: 12px;
        color: #3d5941;
        text-align: center;
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
      htmlContent:html,
    });
  } else {
    console.warn(
      `Notice not sent - invalid or missing data. accessToken=${accessToken}, batchNo=${batchNo}, noOfQrCodes=${noOfQrCodes}`
    );
  }
}

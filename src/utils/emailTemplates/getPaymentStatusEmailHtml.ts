import sendEmail from "@/utils/nodeMailer";

export default async function sendPaymentStatusEmail(
  status: "COMPLETED" | "FAILED" | "PENDING" | string,
  email: string
) {
  const shopName = "TreeWorld";
  const shopTagline = "Nature's Pure Quality";
  const shopSubtitle = "PLY | BOARDS";
  const logoUrl =
    "https://res.cloudinary.com/dtsf7jbkq/image/upload/v1754586646/Add_a_subheading_20250409_123137_0000_pq4ohe.png";

  if (
    (status === "COMPLETED" || status === "FAILED" || status === "PENDING") &&
    email &&
    email.length > 4
  ) {
    const messages = {
      COMPLETED: {
        fg: "#1b5e20",
        bg: "#e8f5e9",
        label: "COMPLETED",
        english: `🎉 Congratulations! Your cashback has been successfully credited to your account.<br/>Thank you for your patience and trust. Keep shopping with us!`,
        hindi: `🎉 बधाई हो! आपका कैशबैक सफलतापूर्वक आपके खाते में जमा कर दिया गया है।<br/>आपके विश्वास के लिए धन्यवाद। कृपया हमारे साथ खरीदारी करते रहें!`,
      },
      FAILED: {
        fg: "#b71c1c",
        bg: "#ffebee",
        label: "FAILED",
        english: `❌ The UPI ID you provided appears to be incorrect.<br/>Please contact the shop to resolve the issue.`,
        hindi: `❌ आपने जो UPI ID दी है वह गलत प्रतीत हो रही है।<br/>कृपया समस्या के समाधान के लिए दुकान से संपर्क करें।`,
      },
      PENDING: {
        fg: "#f9a825",
        bg: "#fffde7",
        label: "PENDING",
        english: `💥 Ding ding! Your payment is awaiting confirmation.<br/>Thanks for filling out the cashback form! We’ve received your details and your cashback is being processed.<br/>Please allow up to <strong>48 working hours</strong> for completion.<br/>This may take up to <strong>7 working days</strong> depending on processing time.<br/><br/>🔒 Your data is private and secure with us.`,
        hindi: `💥 डिंग डिंग! भुगतान की पुष्टि लंबित है।<br/>कैशबैक फॉर्म भरने के लिए धन्यवाद! हमें आपकी जानकारी मिल गई है और आपका कैशबैक प्रोसेस में है।<br/>कृपया इसे पूरा होने के लिए <strong>48 कार्य घंटों</strong> तक का समय दें।<br/>प्रोसेसिंग समय के आधार पर इसमें <strong>7 कार्य दिवस</strong> तक भी लग सकते हैं।<br/><br/>🔒 आपकी जानकारी हमारे पास पूरी तरह सुरक्षित और गोपनीय है।`,
      },
    };

    const message = messages[status as keyof typeof messages] || messages.PENDING;

    const html = `
      <div style="
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        border: 1px solid #c8e6c9;
        color: #333;
      ">
        <!-- Header -->
        <div style="
          background: #2e7d32;
          padding: 32px 24px 24px;
          color: white;
          text-align: center;
        ">
          <!-- Logo -->
          <div style="
            background: white;
            display: inline-block;
            padding: 4px;
            border-radius: 50%;
            box-shadow: 0 0 8px rgba(0,0,0,0.1);
          ">
            <img src="${logoUrl}" alt="TreeWorld Logo"
              style="width: 150px; height: auto; display: block;" />
          </div>

          <!-- Shop Info -->
          <h2 style="margin: 10px 0 0; font-size: 24px; font-weight: bold;">
            ${shopName}
          </h2>
          <div style="font-size: 14px; margin-top: 4px;">${shopTagline}</div>
          <div style="font-size: 13px;">${shopSubtitle}</div>
          <div style="margin-top: 14px; font-size: 16px;">
            Payment Status: <strong>${message.label}</strong>
          </div>
        </div>

        <!-- Body -->
        <div style="padding: 32px; text-align: center;">
          <div style="
            background-color: ${message.bg};
            color: ${message.fg};
            font-weight: 600;
            display: inline-block;
            padding: 10px 24px;
            font-size: 18px;
            border-radius: 30px;
            margin: 16px 0;
          ">
            ${message.label}
          </div>

          <div style="margin-top: 30px; font-size: 16px; line-height: 1.7; text-align: justify;">
            <p>${message.english}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />
            <p>${message.hindi}</p>
          </div>
        </div>

        <!-- Footer -->
        <div style="
          background: #e8f5e9;
          text-align: center;
          padding: 16px;
          font-size: 12px;
          color: #2e7d32;
          font-style: italic;
        ">
          &copy; ${new Date().getFullYear()} ${shopName}. All rights reserved.
        </div>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: `📩 ${shopName} – Your payment status: ${status}`,
      html,
    });
  } else {
    console.warn(
      `Email not sent - invalid status or email: status=${status}, email=${email}`
    );
  }
}

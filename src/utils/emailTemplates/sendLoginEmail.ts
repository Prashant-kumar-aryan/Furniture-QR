import sendEmail from "../nodeMailer";

const sendLoginEmail = (email: string) => {
  const shopName = "Treeworld – Nature’s Pure Quality Ply | Board";
  const subject = `🔐 ${shopName} - Login Alert: Successful Sign-In`;

  const html = `
    <div style="
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 600px;
      margin: auto;
      border: 1px solid #c8e6c9;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 20px rgba(76, 175, 80, 0.2);
      background-color: #ffffff;
    ">
      <!-- Header -->
      <div style="
        background: linear-gradient(135deg, #2e7d32 0%, #66bb6a 50%, #a5d6a7 100%);
        padding: 28px 20px;
        color: white;
        text-align: center;
        position: relative;
      ">
        <!-- Centered Logo with Circle -->
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

        <!-- Shop Name -->
        <h1 style="
          margin: 0;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: 1px;
          text-shadow: 1px 1px 3px rgba(0,0,0,0.2);
        ">
          ${shopName}
        </h1>
        <p style="
          margin: 8px 0 0 0;
          font-size: 14px;
          opacity: 0.95;
          font-weight: 500;
        ">
          Business Account
        </p>

        <h2 style="
          margin: 16px 0 0;
          font-size: 20px;
          font-weight: 600;
          color: #e8f5e9;
        ">
          ✅ Login Successful
        </h2>
      </div>

      <!-- Main Content -->
      <div style="
        padding: 32px 24px;
        text-align: center;
        line-height: 1.7;
        background: linear-gradient(to bottom, #ffffff 0%, #f1f8e9 100%);
      ">
        <p style="
          font-size: 18px;
          margin-bottom: 24px;
          color: #2e7d32;
          font-weight: 500;
        ">
          Dear Business Owner,
        </p>

        <div style="
          background: #f9fbe7;
          border: 2px solid #c5e1a5;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(76, 175, 80, 0.1);
        ">
          <p style="
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 16px;
            color: #1b5e20;
          ">
            Your ${shopName} account was accessed successfully
          </p>
          <p style="
            font-size: 14px;
            color: #4e944f;
            margin: 0;
            background: #e8f5e9;
            padding: 8px 16px;
            border-radius: 20px;
            display: inline-block;
          ">
           Login Time: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
          </p>
        </div>

        <p style="
          font-size: 16px;
          color: #33691e;
          margin-bottom: 8px;
          font-weight: 500;
        ">
          If this was you, no action is needed.
        </p>
        <p style="
          font-size: 14px;
          color: #558b2f;
          margin-bottom: 0;
        ">
          If you didn't login, please contact support immediately or secure your account.
        </p>
      </div>

      <!-- Footer -->
      <div style="
        background: #1b5e20;
        padding: 24px 32px;
        text-align: center;
      ">
        <p style="
          margin: 0 0 8px 0;
          font-size: 16px;
          color: #a5d6a7;
          font-weight: 600;
        ">
          ${shopName}
        </p>
        <p style="
          margin: 0;
          font-size: 12px;
          color: #c8e6c9;
        ">
          &copy; ${new Date().getFullYear()} ${shopName}. All rights reserved.
        </p>
      </div>
    </div>
  `;

  sendEmail({
    to: email,
    subject,
    htmlContent:html,
  });
};

export default sendLoginEmail;

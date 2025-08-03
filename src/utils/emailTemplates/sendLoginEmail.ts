import sendEmail from "../nodeMailer";

const sendLoginEmail = (email: string) => {
  const shopName = "Gajanand Traders";
  const subject = `🔐 ${shopName} - Login Alert: Successful Sign-In`;

  const html = `
    <div style="
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      max-width: 600px; 
      margin: auto; 
      border: 1px solid #d4a574; 
      border-radius: 16px; 
      overflow: hidden; 
      box-shadow: 0 8px 20px rgba(139, 109, 92, 0.2);
      background-color: #fefcfa;
    ">
      <!-- Header with shop name -->
      <div style="
        background: linear-gradient(135deg, #8B4513 0%, #CD853F 50%, #D2691E 100%);
        padding: 32px 24px;
        color: white; 
        text-align: center;
        position: relative;
      ">
        <div style="
          background: rgba(255,255,255,0.1);
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 16px;
        ">
          <h1 style="
            margin: 0; 
            font-size: 24px; 
            font-weight: 800;
            letter-spacing: 1px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          ">
            ${shopName}
          </h1>
          <p style="
            margin: 8px 0 0 0;
            font-size: 14px;
            opacity: 0.9;
            font-weight: 500;
          ">
            Business Account
          </p>
        </div>
        <h2 style="
          margin: 0; 
          font-size: 22px; 
          font-weight: 600;
          color: #fff3e6;
        ">
          ✅ Login Successful
        </h2>
      </div>
      
      <!-- Main content -->
      <div style="
        padding: 40px 32px; 
        text-align: center; 
        line-height: 1.7;
        background: linear-gradient(to bottom, #fefcfa 0%, #f9f6f1 100%);
      ">
        <p style="
          font-size: 18px; 
          margin-bottom: 24px;
          color: #5d4037;
          font-weight: 500;
        ">
          Dear Business Owner,
        </p>
        
        <div style="
          background: #fff;
          border: 2px solid #e8d5b7;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(139, 109, 92, 0.1);
        ">
          <p style="
            font-size: 20px; 
            font-weight: 700; 
            margin-bottom: 16px;
            color: #8B4513;
          ">
            Your ${shopName} account was accessed successfully
          </p>
          <p style="
            font-size: 14px;
            color: #666;
            margin: 0;
            background: #f5f5f5;
            padding: 8px 16px;
            border-radius: 20px;
            display: inline-block;
          ">
            Login Time: ${new Date().toLocaleString()}
          </p>
        </div>
        
        <p style="
          font-size: 16px; 
          color: #6d4c41; 
          margin-bottom: 8px;
          font-weight: 500;
        ">
          If this was you, no action is needed.
        </p>
        <p style="
          font-size: 14px; 
          color: #8d6e63; 
          margin-bottom: 0;
        ">
          If you didn't login, please contact support immediately or secure your account.
        </p>
      </div>
      
      <!-- Footer -->
      <div style="
        background: #3e2723;
        padding: 24px 32px; 
        text-align: center;
      ">
        <p style="
          margin: 0 0 8px 0;
          font-size: 16px;
          color: #D2691E;
          font-weight: 600;
        ">
          ${shopName}
        </p>
        <p style="
          margin: 0;
          font-size: 12px; 
          color: #bcaaa4;
        ">
          &copy; ${new Date().getFullYear()} ${shopName}. All rights reserved.
        </p>
      </div>
    </div>
  `;

  sendEmail({
    to: email,
    subject,
    html,
  });
};

export default sendLoginEmail;

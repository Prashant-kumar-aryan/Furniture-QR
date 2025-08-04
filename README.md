Certainly! Below is a fully stitched, comprehensive **README.md** for your **Furniture-QR Cashback Platform** project. It includes project overview, features, tech stack, folder structure, setup instructions, and detailed API documentation you provided.

# Furniture-QR Cashback Platform

This is a **Next.js (React 19)** full-stack platform for managing cashback offers at a furniture shop. It features QR code generation, payment/cashback tracking, admin and user dashboards, and bilingual email notifications for payment status updates.

## ✨ Features

- **Cashback Form:** Customers submit purchase details and UPI ID to claim cashback.
- **QR Code Generation:** Admins generate and print custom QR code batches for in-store use.
- **Payment Tracking:** Track cashback requests by status — PENDING, COMPLETED, FAILED, REJECTED.
- **Admin Dashboard:** Manage all cashback requests and QR code batches.
- **User Dashboard:** Customers check their payment or cashback status.
- **Email Notifications:** Stylish payment status emails in English and Hindi.
- **API Endpoints:** Comprehensive RESTful APIs for QR codes, payments, and admin/user operations.
- **CORS Middleware:** Securely manage cross-origin API requests.
- **Responsive UI:** Mobile-friendly interface using Tailwind CSS.
- **PDF/QR Printing:** Generate printable PDFs of QR codes with jsPDF + qrcode.
- **Authentication:** Secure JWT login/logout for admins and customers.
- **Type Safety:** Full TypeScript integration.

## 🛠 Tech Stack

- **Frontend:** React 19, Next.js 15 (App Router)
- **Backend:** Next.js API routes (app/api)
- **Database:** MongoDB (via Mongoose)
- **Styling:** Tailwind CSS
- **PDF & QR:** jsPDF, qrcode
- **Email:** Nodemailer (with Google OAuth support)
- **Auth:** JWT-based authentication
- **Other Tools:** TypeScript, Postman (for API testing)

## 📁 Folder Structure

```
.
├── app/                                  # Next.js App Router source code
│   ├── api/                              # API routes
│   ├── components/                       # Reusable UI components
│   ├── hooks/                            # Custom React hooks
│   ├── utils/                            # Utility functions (e.g., printing, emails)
│   ├── styles/                           # TailwindCSS and global styles
│   ├── Types/                           # TypeScript types
├── public/                               # Static assets (images, fonts)
├── README.md
├── package.json
├── tailwind.config.js
└── ...
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Prashant-kumar-aryan/Furniture-QR.git
cd furniture-qr/my-app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn
```

### 3. Setup Environment Variables

Create a `.env.local` file in your project root and add:

```env
# Database
NEXT_PUBLIC_MONGODB_URI=mongodb://localhost:27017/furniture-store

# Authentication
NEXT_PUBLIC_JWT_SECRET=

# Nodemailer (Google OAuth/ App password)
NEXT_PUBLIC_NODEMAILER_USER=YOUR_GMAIL_ADDRESS
NEXT_PUBLIC_NODEMAILER_PASS=YOUR_APP_PASSWORD

# Admin Notifications Email
NEXT_PUBLIC_ADMIN_EMAIL=YOUR_ADMIN_EMAIL

# CORS Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_CLIENT_USER_URL=
NEXT_PUBLIC_CLIENT_ADMIN_URL=

# QR Code Payment URL (Static HTML or deploy location)
NEXT_PUBLIC_CLIENT_API_URL=http://127.0.0.1:5500/furniture.html
```

> Update these values based on your deployment and credentials.

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📡 API Endpoints

### 1. **POST** `/api/qr-code/generate`

Generate a batch of QR codes.

- **Headers:**  
  `Authorization: Bearer `  
  `Content-Type: application/json`

- **Request Body:**

  ```json
  {
    "numberOfCodes": "number (required, > 0)"
  }
  ```

- **Responses:**
  - `200 OK`
    ```json
    {
      "success": true,
      "codes": ["..."]
    }
    ```
  - `400 Bad Request`
    ```json
    {
      "success": false,
      "message": "Invalid or missing JSON body"
    }
    ```
  - `401 Unauthorized`
    ```json
    {
      "success": false,
      "message": "Unauthorized"
    }
    ```

### 2. **GET** `/api/qr-code`

Get all QR codes.

- **Headers:**  
  `Authorization: Bearer `

- **Responses:**
  - `200 OK`
    ```json
    {
      "success": true,
      "codes": ["..."]
    }
    ```
  - `401 Unauthorized`
    ```json
    {
      "success": false,
      "message": "Unauthorized"
    }
    ```

### 3. **POST** `/api/requestPayment`

Submit a cashback/payment request.

- **Headers:**  
  `Content-Type: application/json`

- **Request Body:**

  ```json
  {
    "name": "string (required)",
    "phoneNumber": "string (required)",
    "email": "string (optional)",
    "upiId": "string (required)",
    "refId": "string (required)"
  }
  ```

- **Responses:**
  - `200 OK`
    ```json
    {
      "success": true,
      "message": "Request received"
    }
    ```
  - `400 Bad Request`
    ```json
    {
      "success": false,
      "message": "Missing required fields"
    }
    ```

### 4. **GET** `/api/dashboard`

Get all payment/cashback requests (admin access).

- **Headers:**  
  `Authorization: Bearer `

- **Responses:**
  - `200 OK`
    ```json
    {
      "data": [
        {
          "id": "string",
          "name": "string",
          "phoneNumber": "string",
          "email": "string",
          "upiId": "string",
          "refId": "string",
          "status": "PENDING | COMPLETED | FAILED | REJECTED",
          "createdAt": "date"
        }
      ]
    }
    ```
  - `401 Unauthorized`
    ```json
    {
      "error": "Unauthorized"
    }
    ```

### 5. **PUT** `/api/dashboard`

Update payment status (admin only).

- **Headers:**  
  `Authorization: Bearer `  
  `Content-Type: application/json`

- **Request Body:**

  ```json
  {
    "id": "string (required)",
    "status": "COMPLETED | FAILED | PENDING | REJECTED"
  }
  ```

- **Responses:**
  - `200 OK`
    ```json
    {
      "success": true,
      "message": "Status updated"
    }
    ```
  - `400 Bad Request`
    ```json
    {
      "success": false,
      "message": "Invalid request"
    }
    ```
  - `401 Unauthorized`
    ```json
    {
      "error": "Unauthorized"
    }
    ```

### 6. **GET** `/api/health`

Health check endpoint.

- **Responses:**
  - `200 OK`
    ```json
    {
      "status": "ok"
    }
    ```

### 7. **POST** `/api/login`

Authenticate user and issue JWT token. Sends login email notification.

- **Headers:**  
  `Content-Type: application/json`

- **Request Body:**

  ```json
  {
    "email": "string (required)",
    "password": "string (required)"
  }
  ```

- **Responses:**
  - `201 Created`
    ```json
    {
      "data": {
        "token": "JWT token string"
      },
      "message": "Login successful"
    }
    ```
  - `400 Bad Request`
    ```json
    {
      "message": "Email and password are required"
    }
    ```
  - `401 Unauthorized`
    ```json
    {
      "message": "Invalid email or password"
    }
    ```
  - `500 Internal Server Error`
    ```json
    {
      "message": "Internal Server Error"
    }
    ```

## 📬 Email Notifications

- Payment status emails are sent out automatically upon payment request updates.
- Emails are styled professionally and support English and Hindi.
- Login alerts are sent on each successful user login.
- QR batch creation notice emails include batch details and secure access token information.

## 🤝 Contribution

Feel free to fork and contribute to this project via pull requests.  
Report issues or suggest features through the repository’s issue tracker.

## 📄 License

This project is licensed under the MIT License — see the LICENSE file for details.

## Contact

For support or queries, contact the admin at the email set in [`NEXT_PUBLIC_ADMIN_EMAIL`](#) in your environment variables.

Happy cashback management with **Furniture-QR Cashback Platform**! 🎉

If you want me to help generate this as a markdown file, or add badges, screenshots, or deployment instructions, just ask!

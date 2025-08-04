import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import ConnectDB from "@/lib/connectDB";
import User from "@/models/User";
import sendLoginEmail from "@/utils/emailTemplates/sendLoginEmail";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    await ConnectDB();

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const secret = process.env.NEXT_PUBLIC_JWT_SECRET;
    if (!secret) {
      throw new Error("JWT secret is not defined");
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      secret,
      { expiresIn: "1d" }
    );

    sendLoginEmail(email);

    return NextResponse.json(
      {
        data: { token },
        message: "Login successful",
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Login error:", err.message);
    } else {
      console.error("Unknown login error:", err);
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

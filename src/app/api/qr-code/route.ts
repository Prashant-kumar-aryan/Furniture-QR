import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/connectDB";
import QrCode from "@/models/QrCode";
import crypto from "crypto";
import { refNo, QrBatch } from "@/Types";
import { verifyTokenFromHeader } from "@/utils/verifyToken";
import { sendQrBatchCreatedNotice } from "@/utils/emailTemplates/sendQrBatchCreatedNotice";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }
    verifyTokenFromHeader(authHeader);

    let numberOfCodes: number;
    try {
      const body = await request.json();
      numberOfCodes = body.numberOfCodes;
    } catch {
      return NextResponse.json(
        { message: "Invalid or missing JSON body", success: false },
        { status: 400 }
      );
    }

    if (typeof numberOfCodes !== "number" || numberOfCodes <= 0) {
      return NextResponse.json(
        {
          message: "No of codes should be more than 0 and should be a number",
          success: false,
        },
        { status: 400 }
      );
    }

    await connectDB();

    const batchNo = crypto.randomBytes(4).toString("hex");
    const qrCodes: refNo[] = [];

    for (let i = 0; i < numberOfCodes; i++) {
      const refId = crypto.randomBytes(4).toString("hex");
      const qrCode = `${refId}-${batchNo}-${i + 1}`;
      qrCodes.push({ value: qrCode, status: "ACTIVE" });
    }

    const newQrCode = new QrCode({
      refNo: qrCodes,
      batchNo,
      status: "ACTIVE",
      createdAt: new Date(),
    });
    await newQrCode.save();

    sendQrBatchCreatedNotice(authHeader, batchNo, numberOfCodes);

    return NextResponse.json(
      {
        data: {
          qrCodes,
          batchNo,
          status: "ACTIVE",
          createdAt: new Date().toISOString(),
        } as QrBatch,
        message: "QR Codes generated successfully",
        success: true,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message.toLowerCase() : "";
    const isAuthError =
      message.includes("token") || message.includes("unauthorized");

    console.error("Error in POST /api/qr-code:", error);

    return NextResponse.json(
      {
        message: isAuthError
          ? "Unauthorized"
          : "Internal Server Error while generating QR Codes",
        success: false,
      },
      { status: isAuthError ? 401 : 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }
    verifyTokenFromHeader(authHeader);

    await connectDB();
    const qrCodes = await QrCode.find();

    return NextResponse.json(
      {
        data: qrCodes,
        message: "QR Codes fetched successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message.toLowerCase() : "";
    const isAuthError =
      message.includes("token") || message.includes("unauthorized");

    console.error("Error in GET /api/qr-code:", error);

    return NextResponse.json(
      {
        message: isAuthError
          ? "Unauthorized"
          : "Internal Server Error while fetching QR Codes",
        success: false,
      },
      { status: isAuthError ? 401 : 500 }
    );
  }
}

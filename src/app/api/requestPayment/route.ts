"use server";

import { NextRequest, NextResponse } from "next/server";
import QrCode from "@/models/QrCode";
import connectDB from "@/lib/connectDB";
import Payment from "@/models/Payment";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Or replace * with your frontend origin for more security
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(request: NextRequest) {
  // Handle preflight OPTIONS request separately
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { name, phoneNumber, email, upiId, refId } = await request.json();

    if (!name || !phoneNumber || !upiId || !refId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400, headers: corsHeaders }
      );
    }
    await connectDB();

    // Validate the QR code reference ID
    const QrResult = await QrCode.aggregate([
      { $unwind: "$refNo" }, // Expand refNo array
      { $match: { "refNo.value": refId } },
      { $replaceRoot: { newRoot: "$refNo" } },
    ]);

    const matchedQr = QrResult[0];

    if (!matchedQr || matchedQr.status !== "ACTIVE") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or used QR code",
        },
        { status: 403, headers: corsHeaders }
      );
    }

    // Update the QR code status to USED
    await QrCode.updateOne(
      { "refNo.value": refId },
      { $set: { "refNo.$.status": "USED" } }
    );

    const payment = new Payment({
      name,
      phoneNumber,
      email: email || "",
      upiId,
      refId,
      status: "PENDING",
    });

    await payment.save();

    return NextResponse.json(
      { message: "Payment request processed successfully" },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error processing payment request:", error);
    return NextResponse.json(
      { error: "Failed to process payment request" },
      { status: 500, headers: corsHeaders }
    );
  }
}

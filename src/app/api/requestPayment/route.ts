"use server";

import { NextRequest, NextResponse } from "next/server";
import QrCode from "@/models/QrCode";
import connectDB from "@/lib/connectDB";
import Payment from "@/models/Payment";

export async function POST(request: NextRequest) {
  try {
    const { name, phoneNumber, email, upiId, refId } = await request.json();
    if (!name || !phoneNumber || !upiId || !refId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }
    await connectDB();


    const QrResult = await QrCode.aggregate([
      { $unwind: "$refNo" }, // Expand refNo array
      {
        $match: {
          "refNo.value": refId,
        },
      },
      {
        $replaceRoot: { newRoot: "$refNo" },
      },
    ]);

    const matchedQr = QrResult[0];
    if(!matchedQr || matchedQr.status !== "ACTIVE") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or used QR code",
        },
        { status: 403 }
      );
    }

    const payment = new Payment({
      name,
      phoneNumber,
      email: email || '',
      upiId,
      refId,
      status: "PENDING",
    });

    await payment.save();

    return NextResponse.json({ message: "Payment request processed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error processing payment request:", error);
    return NextResponse.json({ error: "Failed to process payment request" }, { status: 500 });
  }
}
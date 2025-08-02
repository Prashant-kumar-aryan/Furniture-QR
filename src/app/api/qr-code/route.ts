import { NextResponse , NextRequest } from "next/server";
import connectDB from "@/lib/connectDB";
import QrCode from "@/models/QrCode";
import crypto from "crypto";
import { refNo , QrBatch } from "@/Types";

export async function POST(request: NextRequest) {
  try {
    let numberOfCodes: number;

    try {
      const body = await request.json();
      numberOfCodes = body.numberOfCodes;
    } catch (err) {
        return NextResponse.json(
        { message: "Invalid or missing JSON body", success: false },
        { status: 400 }
      );
    }

    if (typeof numberOfCodes !== "number" || numberOfCodes <= 0) {
      return NextResponse.json(
        { message: "No of codes should be more than 0 and should be a number", success: false },
        { status: 400 }
      );
    }

    await connectDB();

    const batchNo = crypto.randomBytes(4).toString("hex");
    const qrCodes: refNo[] = [];

    for (let i = 0; i < numberOfCodes; i++) {
      const refNo = crypto.randomBytes(4).toString("hex");
      const qrCode = `${refNo}-${batchNo}-${i + 1}`;
      qrCodes.push({value:qrCode, status:'ACTIVE'});
    }

    // Save the QR code batch to the database
    const newQrCode = new QrCode({
      refNo: qrCodes,
      batchNo,
      status:'ACTIVE',
      createdAt: new Date(),
    });
    await newQrCode.save();
    
    return NextResponse.json(
      {
        data: {
          qrCodes,
          batchNo,
          status:'ACTIVE',
          createdAt: new Date().toISOString(),
        } as QrBatch,
        message: "QR Codes generated successfully",
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error generating QR Codes:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error while generating QR Codes",
        success: false,
      },
      { status: 500 }
    );
  }
}


export async function GET(request: NextRequest) {
  try {
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
  } catch (error) {
    console.error("Error fetching QR Codes:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error while fetching QR Codes",
        success: false,
      },
      { status: 500 }
    );
  }
}
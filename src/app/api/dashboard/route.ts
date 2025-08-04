import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Payment from "@/models/Payment";
import { verifyTokenFromHeader } from "@/utils/verifyToken";
import getPaymentStatusEmailHtml from "@/utils/emailTemplates/getPaymentStatusEmailHtml";


interface IPaymentUpdate {
  id: string;
  status: "PENDING" | "COMPLETED" | "REJECTED" | "FAILED";
  amount?: number;
  transactionId?: string;
  paymentMethod?: string;
  paymentDate?: Date;
}

export async function GET(request: NextRequest) {
  try {
    // ✅ Verify token
    const authHeader = request.headers.get("authorization");
    console.log("GET request auth header:", authHeader);
    if (!authHeader) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }
    verifyTokenFromHeader(authHeader);

    await connectDB();
    const payments = await Payment.find();

    return NextResponse.json({ data: payments }, { status: 200 });
  } catch (error: unknown) {
  if (error instanceof Error) {
    console.error("Error:", error.message);
    const isAuthError =
      error.message.toLowerCase().includes("unauthorized") ||
      error.message.toLowerCase().includes("token");

    return NextResponse.json(
      { error: isAuthError ? "Unauthorized" : "Internal Server Error" },
      { status: isAuthError ? 401 : 500 }
    );
  }

  return NextResponse.json(
    { error: "Internal Server Error" },
    { status: 500 }
  );
}

}

export async function PUT(request: NextRequest) {
  try {
    // ✅ Verify token
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }
    verifyTokenFromHeader(authHeader);

    await connectDB();
    const { id, status, amount, transactionId, paymentMethod, refId ,email } = await request.json();

    if (!id && !refId) {
      return NextResponse.json(
        { error: "ID is missing" },
        { status: 400 }
      );
    }

    const updatedData: IPaymentUpdate = {
      id,
      status,
    };

    if (status === "COMPLETED") {
      updatedData.paymentDate = new Date();
      updatedData.amount = amount;
      updatedData.transactionId = transactionId || "";
      updatedData.paymentMethod = paymentMethod || "";
    }

    const payment = await Payment.findByIdAndUpdate(
      id || refId,
      { ...updatedData, updatedAt: new Date() },
      { new: true }
    );

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

 
    getPaymentStatusEmailHtml(status, email);
      

    return NextResponse.json(payment, { status: 200 });

  } catch (error: unknown) {
  if (error instanceof Error) {
    console.error("Error:", error.message);
    const isAuthError =
      error.message.toLowerCase().includes("unauthorized") ||
      error.message.toLowerCase().includes("token");

    return NextResponse.json(
      { error: isAuthError ? "Unauthorized" : "Internal Server Error" },
      { status: isAuthError ? 401 : 500 }
    );
  }

  return NextResponse.json(
    { error: "Internal Server Error" },
    { status: 500 }
  );
}

}

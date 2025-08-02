import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Payment from "@/models/Payment";

interface IPaymentUpdate {
  id: string;
  status: "PENDING" | "COMPLETED" | "REJECTED" | "FAILED";
  amount?: number;
  transactionId?: string;
  paymentMethod?: string;
  paymentDate?: Date;
}

export async function GET() {
  try {
    await connectDB();
    const payments = await Payment.find();
    return NextResponse.json({data: payments }, { status: 200 });
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {

    await connectDB();
    const { id , status , amount , transactionId , paymentMethod , refId } = await request.json();
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
    if(status ==='COMPLETED' ) {
      updatedData.paymentDate = new Date();  
      updatedData.amount = amount;
      updatedData.transactionId = transactionId || '';
      updatedData.paymentMethod = paymentMethod || '';
    }


    const payment = await Payment.findByIdAndUpdate(
      id || refId,
      { ...updatedData, updatedAt: new Date() },
      { new: true }
    );

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json(payment,{ status: 200 });

  } catch (error) {
    console.error("Error in PUT request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

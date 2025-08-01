import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("Received data:", data);
    // Process the payment request here
    // For example, you might call a payment API with the data

    return NextResponse.json({ message: "Payment request processed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error processing payment request:", error);
    return NextResponse.json({ error: "Failed to process payment request" }, { status: 500 });
  }
}
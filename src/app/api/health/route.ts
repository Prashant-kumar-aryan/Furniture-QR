import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Simulate a health check response
    return NextResponse.json({ status: "OK", timestamp: new Date().toISOString() }, { status: 200 });
  } catch (error) {
    console.error("Error processing health check:", error);
    return NextResponse.json({ error: "Failed to process health check" }, { status: 500 });
  }
}
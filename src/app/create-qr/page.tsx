"use client";
import { useState } from "react";
import BASE_URL from "@/components/BASE_URL";
import useAuth from "@/hooks/useAuth";
import handlePrintQrCode from "@/utils/handlePrintQrCode";

type QrCodeStatus = "notRequested" | "loading" | "processed" | "error";

type refNo = string;

type QrBatch = {
  qrCodes: refNo[];
  batchNo: string;
  createdAt: string;
};

export default function GenerateQrCodes() {
  const { token } = useAuth();

  const [status, setStatus] = useState<QrCodeStatus>("notRequested");
  const [qrBatch, setQrBatch] = useState<QrBatch | null>(null);

  const fetchQrBatch = async (): Promise<QrBatch> => {
    try {
      const response = await fetch(`${BASE_URL}/qr-code/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ numberOfCodes: 5 }),
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to generate QR Codes: ${response.status}`);
      }

      const data = await response.json();
      return data.data as QrBatch;
    } catch (error) {
      console.error("Error fetching QR Codes:", error);
      throw error;
    }
  };

  const handleGenerateQrCodes = async () => {
    setStatus("loading");
    try {
      const batch = await fetchQrBatch();
      setQrBatch(batch);
      setStatus("processed");
    } catch {
      setStatus("error");
    }
  };

  const isLoading = status === "loading";
  const buttonText = isLoading ? "Generating..." : "Generate QR Codes";
  const buttonClass = `
    mt-4 px-6 py-3 rounded-md font-semibold transition-colors duration-300
    focus:outline-none focus:ring-2 text-yellow-50 shadow-lg w-52
    ${isLoading ? "cursor-not-allowed opacity-70" : "hover:opacity-90"}
  `;
  const buttonBackground = isLoading
    ? "linear-gradient(90deg, #4a270d 0%, #70523a 100%)"
    : "linear-gradient(90deg, #4a270d 0%, #996633 100%)";

  return (
    <section className="flex flex-col items-start justify-center min-h-screen bg-yellow-50 p-6 font-sans text-brown-900 w-full">
      <h1 className="text-3xl font-extrabold mb-6 text-brown-800 drop-shadow-md">
        Create QR Codes
      </h1>
      <p className="text-lg mb-6 text-brown-700">
        Generate up to 30 QR Codes at once.
      </p>

      <button
        onClick={handleGenerateQrCodes}
        disabled={isLoading}
        className={buttonClass}
        style={{ background: buttonBackground }}
      >
        {buttonText}
      </button>

      {status === "error" && (
        <p className="mt-4 text-red-600 font-medium">
          Failed to generate QR codes. Please try again.
        </p>
      )}

      <p className="mt-4 text-brown-600 max-w-md text-left">
        To generate more, please wait for the previous ones to be processed.
      </p>

      {status === "processed" && qrBatch && (
        <div className="mt-8 bg-brown-100 rounded-lg shadow-lg p-6 w-full max-w-xl">
          <h2 className="text-xl font-semibold mb-4 text-brown-800">
            Generated QR Codes
          </h2>
          <p className="mb-2 text-brown-700">
            <strong>Batch No:</strong> {qrBatch.batchNo}
          </p>
          <p className="mb-4 text-brown-700">
            <strong>Created At:</strong>{" "}
            {new Date(qrBatch.createdAt).toLocaleString()}
          </p>
          <ul className="list-disc list-inside space-y-2">
            {qrBatch.qrCodes.map((code, idx) => (
              <li key={idx} className="text-brown-700 break-all">
                {code}
              </li>
            ))}
          </ul>
          <button
            className="mt-4 bg-amber-900 px-3 py-2 rounded-md font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 text-yellow-50 shadow-lg w-32 hover:opacity-90"
            title="Print QR Codes in PDF format"
            onClick={() => handlePrintQrCode(qrBatch)}
          >
            Print
          </button>
        </div>
      )}
    </section>
  );
}

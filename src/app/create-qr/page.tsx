"use client";

import { useState } from "react";
import BASE_URL from "@/components/BASE_URL";
import useAuth from "@/hooks/useAuth";
import handlePrintQrCode from "@/utils/handlePrintQrCode";
import { QrCodeStatus, QrBatch } from "@/Types";
import { useRouter } from "next/navigation";
export default function GenerateQrCodes() {
  const { token } = useAuth();
  const route = useRouter();
  const [status, setStatus] = useState<QrCodeStatus>("notRequested");
  const [qrBatch, setQrBatch] = useState<QrBatch | null>(null);
  // State for selected number of codes
  const [numberOfCodes, setNumberOfCodes] = useState(20);

  const fetchQrBatch = async (): Promise<QrBatch> => {
    try {
      const response = await fetch(`${BASE_URL}/qr-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ numberOfCodes }),
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
    if (status === "processed") {
      const userConfirmed = confirm(
        "Make sure you have printed the QR Codes before generating new ones, else you might lose them. Do you want to proceed?"
      );
      if (!userConfirmed) return;
    }
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
  const buttonText = isLoading
    ? "Generating..."
    : status === "processed"
    ? "Regenerate QR Codes"
    : "Generate QR Codes";

  const buttonClass = `
    mt-4 px-6 py-3 rounded-md font-semibold transition-colors duration-300
    focus:outline-none focus:ring-2 text-yellow-50 shadow-lg w-52
    ${isLoading ? "cursor-not-allowed opacity-70" : "hover:opacity-90"}
  `;

  const buttonBackground = isLoading
    ? "linear-gradient(90deg, #4a270d 0%, #70523a 100%)"
    : "linear-gradient(90deg, #4a270d 0%, #996633 100%)";

  return (
    <section className="md:pl-20 pl-5 flex flex-col items-start justify-center min-h-screen bg-yellow-50 p-6 font-sans text-brown-900 w-full">
      <button
        onClick={() => {
          route.push("/qrcodes");
        }}
        className="absolute md:top-4 right-4 top-20   px-4 py-2 bg-amber-800 text-white rounded-md shadow-md hover:bg-brown-300 transition-colors duration-300"
      >
        All Batches
      </button>

      <h1 className="text-3xl font-extrabold mb-6 text-brown-800 drop-shadow-md">
        Create QR Codes
      </h1>
      <p className="text-lg mb-4 text-brown-700">
        Generate up to 60 QR Codes at once.
      </p>

      {/* Select number of QR codes */}
      <label className="mb-4 font-medium text-brown-700">
        Select count (each page: 20 codes):
        <select
          className="ml-2 p-2 rounded-md border text-brown-900 bg-slate-400"
          value={numberOfCodes}
          onChange={(e) => setNumberOfCodes(Number(e.target.value))}
          disabled={isLoading}
        >
          <option value={20}>20 (1 page)</option>
          <option value={40}>40 (2 pages)</option>
          <option value={60}>60 (3 pages)</option>
        </select>
      </label>

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
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold mb-4 text-brown-800">
              Generated QR Codes
            </h2>
            <button
              className="bg-amber-900 px-3 py-2 rounded-md font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 text-yellow-50 shadow-lg w-32 hover:opacity-90"
              title="Print QR Codes in PDF format"
              onClick={() => handlePrintQrCode(qrBatch)}
            >
              Print
            </button>
          </div>

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
                {code.value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import handlePrintQrCode from "@/utils/handlePreviousCode";
// import { QrBatch } from "@/Types";
import BASE_URL from "@/components/BASE_URL";
import useAuth from "@/hooks/useAuth";

// type QrBatch

export type QrBatch1 = {
  refNo: {
    value: string;
    status: string;
  }[];
  batchNo: string;
  createdAt: string;
  status: "REVOKED" | "ACTIVE";
};

type ApiResponse = {
  data: QrBatch1[];
  message: string;
  success: boolean;
};

export default function QrBatchListPage() {
  const { token, loading: authLoading } = useAuth();
  const [qrBatches, setQrBatches] = useState<QrBatch1[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (authLoading) return; // 🛑 Don't fetch if auth is loading
    async function fetchQrBatches() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${BASE_URL}/qr-code`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(`Error: ${res.status}`);

        const json: ApiResponse = await res.json();

        if (json.success && Array.isArray(json.data)) {
          // Convert refNo -> qrCodes with fallback
          const convertedData = json.data;

          // Sort descending by createdAt
          const sorted = convertedData.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          setQrBatches(sorted);
        } else {
          throw new Error(json.message || "Failed to fetch QR batches");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch QR batches");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchQrBatches();
  }, [token, authLoading]);

  if (loading) {
    return (
      <main className="flex justify-center items-center min-h-screen text-brown-700 font-semibold">
        Loading QR batches...
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex justify-center items-center min-h-screen text-red-600 font-semibold">
        {error}
      </main>
    );
  }

  if (qrBatches.length === 0) {
    return (
      <main className="flex justify-center items-center min-h-screen text-brown-700 font-semibold">
        No QR batches found.
      </main>
    );
  }
  console.log(qrBatches);
  return (
    <main className="p-6 min-h-screen bg-yellow-50 text-brown-900 font-sans">
      <h1 className="text-3xl font-extrabold mb-6 drop-shadow-md">
        QR Code Batches
      </h1>
      <div className="space-y-6 max-w-4xl mx-auto">
        {qrBatches.map((batch) => (
          <section
            key={batch.batchNo}
            className="bg-brown-100 rounded-lg shadow-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between"
          >
            <div className="mb-4 sm:mb-0">
              <p>
                <strong>Batch No:</strong> {batch.batchNo}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(batch.createdAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
              <p>
                <strong>No of QR Codes:</strong> {batch.refNo.length}
              </p>
              <p>
                <strong>Status:</strong> {batch.status}
              </p>
            </div>
            <button
              onClick={() => {
                handlePrintQrCode(batch);
              }}
              className="px-4 py-2 bg-amber-900 text-yellow-50 rounded-md font-semibold shadow-lg transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-yellow-300 w-full sm:w-auto"
              title={`Print QR Codes for batch ${batch.batchNo}`}
            >
              Print PDF
            </button>
          </section>
        ))}
      </div>
    </main>
  );
}

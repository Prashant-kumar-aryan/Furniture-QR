"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useTransactions from "@/hooks/useTransactions";
import { Transaction } from "@/Types";
import BASE_URL from "@/components/BASE_URL";

type TransactionStatus = "PENDING" | "COMPLETED" | "REJECTED" | "FAILED";

const PAYMENT_METHODS = ["UPI", "Bank Transfer", "Card", "Cash"];

export default function TransactionDetailsPage() {
  const router = useRouter();
  const params = useParams() as { refId?: string };
  const refId = params.refId;
  const { transactions, loading, error } = useTransactions();

  const [transaction, setTransaction] = useState<Transaction | null>(null);

  // Editable fields state
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [status, setStatus] = useState<TransactionStatus | "">("");

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!loading && transactions.length > 0 && refId) {
      const found = transactions.find((t) => t.refId === refId) || null;
      setTransaction(found);
      if (found) {
        setPaymentMethod(found.paymentMethod ?? "");
        setTransactionId(found.transactionId ?? "");
        setAmount(found.amount ?? "");
        setStatus(found.status as TransactionStatus);
      }
    }
  }, [loading, transactions, refId]);

  if (!refId) {
    return (
      <main className="p-8 text-center w-full">
        <h1 className="text-2xl font-bold mb-2">Invalid Transaction ID</h1>
        <p>The transaction reference ID is missing.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          type="button"
        >
          Go Back
        </button>
      </main>
    );
  }

  if (loading)
    return (
      <p className="p-8 text-center w-full">Loading transaction details...</p>
    );

  if (error)
    return (
      <p className="p-8 text-center text-red-600 w-full">
        Error fetching transactions: {error}
      </p>
    );

  if (!transaction)
    return (
      <main className="p-8 text-center w-full">
        <h1 className="text-2xl font-bold mb-2">Transaction Not Found</h1>
        <p>No transaction matches the id: {refId}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          type="button"
        >
          Go Back
        </button>
      </main>
    );

  async function handleUpdate() {
    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(null);

    try {
      const response = await fetch(`${BASE_URL}/dashboard`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: transaction!._id,
          refId: transaction!.refId,
          status,
          amount,
          transactionId,
          paymentMethod,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update: ${response.statusText}`);
      }

      const updatedData = await response.json();

      setTransaction((prev) => (prev ? { ...prev, ...updatedData } : null));
      setUpdateSuccess("Transaction updated successfully.");
    } catch (err: any) {
      setUpdateError(err.message || "Unknown error occurred.");
    } finally {
      setIsUpdating(false);
    }
  }

  // Format ISO 8601 date string into a readable format
  function formatDate(dateStr: string | undefined | null) {
    if (!dateStr) return "-";

    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(date);
    } catch {
      return dateStr; // fallback to original string
    }
  }

  const statusColors = {
    COMPLETED: "bg-green-600 text-white border-green-700",
    PENDING: "bg-yellow-400 text-yellow-900 border-yellow-500",
    REJECTED: "bg-gray-600 text-white border-gray-700",
    FAILED: "bg-red-600 text-white border-red-700",
  };

  const statusOutlineColors = {
    COMPLETED: "border-green-600 text-green-600 hover:bg-green-100",
    PENDING: "border-yellow-400 text-yellow-400 hover:bg-yellow-100",
    REJECTED: "border-gray-400 text-gray-400 hover:bg-gray-100",
    FAILED: "border-red-600 text-red-600 hover:bg-red-100",
  };

  return (
    <main className="w-full p-6 bg-white rounded shadow my-8 max-w-7xl mx-auto">
      <nav className="mb-6">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          &larr; Back to Dashboard
        </button>
      </nav>

      <h1 className="text-3xl font-bold mb-8">Transaction Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left column: non-editable fields */}
        <section className="space-y-6">
          <div>
            <span className="font-semibold text-gray-700">Name:</span>
            <p>{transaction.name}</p>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Phone Number:</span>
            <p>{transaction.phoneNumber}</p>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Email:</span>
            <p>{transaction.email?.trim() || "NA"}</p>
          </div>

          <div>
            <span className="font-semibold text-indigo-700">UPI ID:</span>
            <p className="bg-indigo-50 border border-indigo-300 rounded px-2 py-1 font-semibold inline-block">
              {transaction.upiId}
            </p>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Reference ID:</span>
            <p>{transaction.refId}</p>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Created At:</span>
            <p>
              {formatDate(
                typeof transaction.createdAt === "string"
                  ? transaction.createdAt
                  : transaction.createdAt?.$date
              )}
            </p>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Payment Date:</span>
            <p>
              {formatDate(
                typeof transaction.paymentDate === "string"
                  ? transaction.paymentDate
                  : transaction.paymentDate?.$date
              )}
            </p>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Last Updated:</span>
            <p>
              {formatDate(
                typeof transaction.updatedAt === "string"
                  ? transaction.updatedAt
                  : transaction.updatedAt?.$date
              )}
            </p>
          </div>
        </section>

        {/* Right column: editable fields */}
        <section className="space-y-6 max-w-lg">
          <div>
            <label
              htmlFor="amount"
              className="font-semibold text-gray-700 block mb-1"
            >
              Amount:
            </label>
            <input
              id="amount"
              type="number"
              min="0"
              value={amount}
              required
              placeholder="Enter amount"
              onChange={(e) => {
                const val = e.target.value;
                setAmount(val === "" ? "" : Number(val));
              }}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label
              htmlFor="transactionId"
              className="font-semibold text-gray-700 block mb-1"
            >
              Transaction ID:
            </label>
            <input
              id="transactionId"
              type="text"
              value={transactionId}
              required
              placeholder="Enter transaction ID"
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label
              htmlFor="paymentMethod"
              className="font-semibold text-gray-700 block mb-1"
            >
              Payment Method:
            </label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              required
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded bg-white"
            >
              <option value="" disabled>
                Select a payment method
              </option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Card">Card</option>
              <option value="Cash">Cash</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-2">
              Status:
            </label>
            <div className="flex flex-wrap gap-3">
              {(
                [
                  "PENDING",
                  "COMPLETED",
                  "REJECTED",
                  "FAILED",
                ] as TransactionStatus[]
              ).map((stat) => {
                const isSelected = status === stat;
                return (
                  <button
                    key={stat}
                    type="button"
                    onClick={() => setStatus(stat)}
                    className={`px-5 py-2 rounded border font-semibold transition-colors duration-200 select-none ${
                      isSelected
                        ? statusColors[stat]
                        : statusOutlineColors[stat]
                    }`}
                    aria-pressed={isSelected}
                  >
                    {stat}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleUpdate}
            disabled={isUpdating}
            className={`w-full py-2 rounded text-white font-semibold transition-colors duration-200 ${
              isUpdating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
            aria-live="polite"
          >
            {isUpdating ? "Updating..." : "Update"}
          </button>

          {updateError && (
            <p className="mt-2 text-red-600" role="alert">
              {updateError}
            </p>
          )}
          {updateSuccess && (
            <p className="mt-2 text-green-600" role="status">
              {updateSuccess}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

// Status colors - keep these here too
const statusColors = {
  COMPLETED: "bg-green-600 text-white border-green-700",
  PENDING: "bg-yellow-400 text-yellow-900 border-yellow-500",
  REJECTED: "bg-gray-600 text-white border-gray-700",
  FAILED: "bg-red-600 text-white border-red-700",
};

const statusOutlineColors = {
  COMPLETED: "border-green-600 text-green-600 hover:bg-green-100",
  PENDING: "border-yellow-400 text-yellow-400 hover:bg-yellow-100",
  REJECTED: "border-gray-400 text-gray-400 hover:bg-gray-100",
  FAILED: "border-red-600 text-red-600 hover:bg-red-100",
};

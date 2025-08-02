"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TransactionStatus, Transaction } from "@/Types";

const STATUS_ORDER: TransactionStatus[] = [
  "PENDING",
  "COMPLETED",
  "FAILED",
  "REJECTED",
];
const STATUS_LABELS: Record<TransactionStatus, string> = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  FAILED: "Failed",
  REJECTED: "Rejected",
};

type Props = {
  transactions: Transaction[];
};

export default function TransactionCards({ transactions }: Props) {
  const [filter, setFilter] = useState<"ALL" | TransactionStatus>("ALL");
  const router = useRouter();

  // Memoized sorted transactions by createdAt descending
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [transactions]);

  // Group by status using sorted transactions
  const grouped = useMemo(() => {
    const statusMap: Record<TransactionStatus, Transaction[]> = {
      PENDING: [],
      COMPLETED: [],
      FAILED: [],
      REJECTED: [],
    };
    sortedTransactions.forEach((txn) => {
      if (statusMap[txn.status]) statusMap[txn.status].push(txn);
    });
    return statusMap;
  }, [sortedTransactions]);

  const filteredTxns = useMemo(() => {
    if (filter === "ALL") {
      return STATUS_ORDER.flatMap((status) => grouped[status]);
    } else {
      return grouped[filter] || [];
    }
  }, [filter, grouped]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-0">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-5 py-2 rounded font-semibold border shadow-sm shadow-gray-300 ${
            filter === "ALL"
              ? "bg-amber-700 text-white border-amber-800"
              : "bg-white text-gray-800 border-gray-300 hover:bg-amber-100"
          }`}
        >
          All
        </button>
        {STATUS_ORDER.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-5 py-2 rounded font-semibold border shadow-sm shadow-gray-300 capitalize ${
              filter === status
                ? status === "PENDING"
                  ? "bg-yellow-400 text-black border-yellow-500"
                  : status === "COMPLETED"
                  ? "bg-green-500 text-white border-green-600"
                  : status === "FAILED"
                  ? "bg-red-500 text-white border-red-600"
                  : "bg-gray-400 text-white border-gray-600"
                : "bg-white text-gray-800 border-gray-300 hover:bg-amber-100"
            }`}
          >
            {STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      {/* Cards list */}
      <div className="space-y-6">
        {filteredTxns.length === 0 && (
          <div className="text-center text-gray-500 py-20">
            No transactions found.
          </div>
        )}

        {filteredTxns.map((txn) => (
          <div
            key={txn.refId}
            onClick={() => router.push(`/dashboard/${txn.refId}`)}
            className={`cursor-pointer transition-transform hover:scale-[1.02] border-2 rounded-xl shadow-lg bg-white
              flex flex-col md:flex-row flex-wrap md:items-center justify-between 
              px-6 py-6
              ${
                txn.status === "COMPLETED"
                  ? "border-green-400"
                  : txn.status === "PENDING"
                  ? "border-yellow-400"
                  : txn.status === "FAILED"
                  ? "border-red-400"
                  : "border-gray-300"
              }
            `}
          >
            <div className="flex flex-col flex-grow mb-4 md:mb-0 min-w-0">
              <span className="font-semibold text-lg text-gray-800 truncate">
                {txn.name}
              </span>
              <span className="text-[13px] text-gray-500 font-mono truncate">
                {txn.refId}
              </span>
              <span className="text-xs text-gray-400 mt-1">
                Created At:{" "}
                {new Date(txn.createdAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>

            <div className="flex flex-col min-w-[120px] mb-4 md:mb-0 break-words">
              <span className="font-medium text-sm text-gray-700">Phone:</span>
              <span className="text-sm">{txn.phoneNumber}</span>
            </div>
            <div className="flex flex-col min-w-[120px] mb-4 md:mb-0">
              <span className="font-medium text-sm text-gray-700">UPI:</span>
              <span className="mt-1 px-3 py-1.5 rounded-md bg-indigo-50 text-indigo-700 font-medium border border-indigo-200 text-sm shadow-sm break-all">
                {txn.upiId}
              </span>
            </div>

            <div className="flex flex-col min-w-[95px]">
              <span className="font-medium text-sm text-gray-700">Status:</span>
              <span
                className={`font-bold text-sm ${
                  txn.status === "COMPLETED"
                    ? "text-green-600"
                    : txn.status === "PENDING"
                    ? "text-yellow-700"
                    : txn.status === "FAILED"
                    ? "text-red-600"
                    : txn.status === "REJECTED"
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                {txn.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

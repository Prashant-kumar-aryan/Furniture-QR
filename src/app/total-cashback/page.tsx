"use client";

import useTransactions from "@/hooks/useTransactions";
import { Transaction } from "@/Types";
import { useEffect, useState, useMemo } from "react";

export default function TotalCashback() {
  const { loading, transactions, error } = useTransactions();
  const [allTransaction, setAllTransaction] = useState<Transaction[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!loading) {
      setAllTransaction(transactions);
    }
  }, [loading, transactions, error]);

  // Find user with max cashback (COMPLETED only)
  const maxCashbackUser = useMemo(() => {
    const cashbackMap: Record<
      string,
      {
        name: string;
        email?: string;
        phoneNumber: string;
        upiId: string;
        total: number;
      }
    > = {};
    allTransaction.forEach((t) => {
      if (t.status === "COMPLETED" && t.amount) {
        const key = t.phoneNumber || t.email || t.upiId || t.name;
        if (!cashbackMap[key]) {
          cashbackMap[key] = {
            name: t.name,
            email: t.email,
            phoneNumber: t.phoneNumber,
            upiId: t.upiId,
            total: 0,
          };
        }
        cashbackMap[key].total += t.amount;
      }
    });
    const arr = Object.values(cashbackMap);
    if (arr.length === 0) return null;
    return arr.reduce(
      (max, curr) => (curr.total > max.total ? curr : max),
      arr[0]
    );
  }, [allTransaction]);

  // Filter transactions by name, upiId, phoneNumber, or email
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allTransaction.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.upiId.toLowerCase().includes(q) ||
        t.phoneNumber.toLowerCase().includes(q) ||
        (t.email && t.email.toLowerCase().includes(q))
    );
  }, [query, allTransaction]);

  // Calculate total cashback for filtered transactions
  const totalCashback = filtered.reduce(
    (sum, t) => sum + (t.amount && t.status === "COMPLETED" ? t.amount : 0),
    0
  );

  return (
    <main className="p-6 w-full min-h-screen bg-white text-black">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <input
            type="search"
            className="border border-black rounded px-4 py-2 w-full shadow focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
            placeholder="Enter name, UPI ID, phone, or email to search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {filtered.length > 0 && (
            <div className="text-lg font-semibold text-black">
              Total Cashback:{" "}
              <span className="text-black">₹{totalCashback}</span>
            </div>
          )}
        </div>
        <div className="overflow-x-auto rounded shadow bg-white">
          <table className="min-w-full">
            <thead>
              <tr className="bg-black text-white">
                <th className="py-2 px-4 font-semibold">Name</th>
                <th className="py-2 px-4 font-semibold">Phone</th>
                <th className="py-2 px-4 font-semibold">Email</th>
                <th className="py-2 px-4 font-semibold">UPI ID</th>
                <th className="py-2 px-4 font-semibold">Status</th>
                <th className="py-2 px-4 font-semibold">Amount</th>
                <th className="py-2 px-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {query.trim() === "" ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center text-gray-600 py-12 text-xl"
                  >
                    {maxCashbackUser ? (
                      <div>
                        <div className="mb-2 font-semibold text-black">
                          Enter a name, UPI ID, phone, or email to see
                          transactions.
                        </div>
                        <div className="mt-4">
                          <span className="text-lg font-bold text-black">
                            🏆 Max Cashback Winner: {maxCashbackUser.name}
                          </span>
                          <div className="text-black mt-1">
                            {maxCashbackUser.email && (
                              <span className="mr-4">
                                Email: {maxCashbackUser.email}
                              </span>
                            )}
                            <span className="mr-4">
                              Phone: {maxCashbackUser.phoneNumber}
                            </span>
                            <span>UPI: {maxCashbackUser.upiId}</span>
                          </div>
                          <div className="mt-2 font-semibold">
                            Total Cashback:{" "}
                            <span className="text-black">
                              ₹{maxCashbackUser.total}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      "Enter a name, UPI ID, phone, or email to see transactions."
                    )}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-600 py-8">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr
                    key={t._id}
                    className="border-b border-black hover:bg-gray-100 transition"
                  >
                    <td className="py-2 px-4">{t.name}</td>
                    <td className="py-2 px-4">{t.phoneNumber}</td>
                    <td className="py-2 px-4">{t.email || "-"}</td>
                    <td className="py-2 px-4">{t.upiId}</td>
                    <td className="py-2 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                          t.status === "COMPLETED"
                            ? "bg-white text-black border-black"
                            : t.status === "FAILED"
                            ? "bg-white text-black border-black"
                            : t.status === "REJECTED"
                            ? "bg-white text-black border-black"
                            : "bg-white text-black border-black"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      {t.amount && t.status === "COMPLETED"
                        ? `₹${t.amount}`
                        : "-"}
                    </td>
                    <td className="py-2 px-4">
                      {t.createdAt
                        ? new Date(t.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

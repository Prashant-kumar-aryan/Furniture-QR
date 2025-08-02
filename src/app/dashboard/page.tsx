"use client";
import TransactionCards from "./TransactionCards";
import useTransactions from "@/hooks/useTransactions";

export default function DashboardPage() {
  const { transactions, loading, error } = useTransactions();
  // Fetch transactions when the component mounts
  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        Failed to fetch transactions.
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen  bg-yellow-50 px-4 py-8 w-full">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Transaction History
      </h1>
      <TransactionCards transactions={transactions} />
    </div>
  );
}

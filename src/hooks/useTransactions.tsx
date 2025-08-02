"use client";

import { useState, useEffect } from "react";
import BASE_URL from "@/components/BASE_URL";
import { Transaction } from "@/Types";

export default function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/dashboard`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await response.json();
      setTransactions(data.data || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 👇 Fetch only once when component mounts
  useEffect(() => {
    fetchTransactions();
  }, []);

  return { transactions, loading, error };
}

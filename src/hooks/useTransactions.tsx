"use client";

import { useState, useEffect } from "react";
import BASE_URL from "@/components/BASE_URL";
import { Transaction } from "@/Types";
import useAuth from "./useAuth";

export default function useTransactions() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    if (!token) return; // 🛑 Don't fetch if token is missing

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/dashboard`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();
      setTransactions(data.data || []);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchTransactions(); // ✅ Call only when token is ready
  }, [token]);

  return { transactions, loading, error };
}

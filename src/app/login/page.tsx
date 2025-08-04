"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BASE_URL from "@/components/BASE_URL";
import useAuth from "@/hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { isLoggedIn, loading } = useAuth();

  // ✅ Wait for loading to finish before redirecting
  useEffect(() => {
    if (!loading && isLoggedIn) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, loading, router]);

  // ✅ Show loading screen while checking auth
  if (loading || isLoggedIn) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-16 bg-yellow-50 p-8 rounded-xl shadow-lg font-sans">
      <h2 className="mb-6 text-2xl font-bold text-blue-600">Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 p-3 border border-gray-300 rounded-md text-base outline-none"
        />

        <input
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-4 p-3 border border-gray-300 rounded-md text-base outline-none"
        />

        <div className="mb-4 text-left">
          <label className="text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="mr-2"
            />
            Show Password
          </label>
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-blue-600 text-white rounded-md font-semibold text-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
      {message && <p className="mt-4 text-red-600">{message}</p>}
    </div>
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok && data.data?.token) {
        localStorage.setItem("myfurnituretoken", data.data.token);
        setMessage("Login successful!");
        window.location.reload(); // Refresh the page to clear state
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("Login failed");
      }
    }
  }
}

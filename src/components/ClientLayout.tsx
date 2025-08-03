"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import Sidebar from "./Sidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isLoggedIn, loading } = useAuth(); // ✅ Use loading from the hook

  useEffect(() => {
    if (!loading && isLoggedIn === false) {
      router.push("/login");
    }
  }, [isLoggedIn, loading, router]);

  // ✅ Show loading screen while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Checking authentication...
      </div>
    );
  }

  if (!isLoggedIn) {
    return <main>{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <main className="flex-grow md:ml-54 mt-10 md:mt-0">{children}</main>
    </div>
  );
}

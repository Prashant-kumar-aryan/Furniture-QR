"use client";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const linkClass = (path: string) =>
    `block px-4 py-3 rounded transition focus:outline-none ${
      pathname === path
        ? "bg-slate-700 text-white font-semibold"
        : "text-slate-300 hover:bg-slate-700"
    }`;

  const handleLogout = useCallback(() => {
    logout();
    router.push("/login");
  }, [logout, router]);

  return (
    <aside
      className="
        fixed bg-slate-800 text-white flex flex-row md:flex-col
        w-full md:w-60
        h-14 md:h-screen
        px-4 md:px-6 py-2 md:py-6
        items-center md:items-start
        gap-4 md:gap-6
        z-50
      "
      aria-label="Sidebar Navigation"
    >
      {/* App name show only on desktop */}
      <div className="hidden md:block text-2xl font-bold text-white mb-8 tracking-tight select-none">
        My Dashboard
      </div>

      {/* Navigation links */}
      <nav className="flex flex-row md:flex-col items-center md:items-stretch flex-grow md:flex-grow-0 gap-3 w-full">
        <Link
          href="/dashboard"
          className={linkClass("/dashboard")}
          tabIndex={0}
        >
          Dashboard
        </Link>
        <Link
          href="/create-qr"
          className={linkClass("/create-qr")}
          tabIndex={0}
        >
          Create QR
        </Link>
        <Link
          href="/total-cashback"
          className={linkClass("/total-cashback")}
          tabIndex={0}
        >
          Total Cashback
        </Link>
      </nav>

      {/* Logout button at bottom on desktop */}
      <div className="hidden md:block mt-auto w-full">
        <button
          onClick={handleLogout}
          className="
            w-full bg-red-600 hover:bg-red-700 text-white
            font-semibold py-3 rounded-lg shadow-md transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-red-400
          "
          aria-label="Logout"
          tabIndex={0}
        >
          Logout
        </button>
      </div>

      {/* For mobile: show logout inline with nav */}
      <div className="md:hidden flex-grow flex items-center justify-end">
        <button
          onClick={handleLogout}
          className="
            bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-red-400
          "
          aria-label="Logout"
          tabIndex={0}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

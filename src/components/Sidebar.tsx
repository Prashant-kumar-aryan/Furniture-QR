// components/Sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `block px-4 py-2 rounded hover:bg-slate-700 transition ${
      pathname === path ? "bg-slate-700 text-white" : "text-slate-300"
    }`;

  return (
    <aside className="fixed h-dvh w-54 bg-slate-800 text-white flex flex-col p-4 space-y-4">
      <div className="text-2xl font-semibold mb-6 text-white">My Dashboard</div>
      <nav className="flex flex-col gap-2">
        <Link href="/dashboard" className={linkClass("/dashboard")}>
          Dashboard
        </Link>
        <Link href="/create-qr" className={linkClass("/create-qr")}>
          Create QR
        </Link>
      </nav>
    </aside>
  );
}

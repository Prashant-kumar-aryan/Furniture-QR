"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `block md:pr-20 px-2 py-2 rounded hover:bg-slate-700 transition ${
      pathname === path ? "bg-slate-700 text-white" : "text-slate-300"
    }`;

  return (
    <aside
      className="
        fixed bg-slate-800 text-white flex flex-row md:flex-col 
        w-full md:w-54 
        h-14 md:h-dvh 
        px-4 py-2 md:p-4 
        items-center md:items-start 
        space-x-4 md:space-x-0 md:space-y-4
        z-50
      "
    >
      <div className="text-lg md:text-2xl font-semibold text-white whitespace-nowrap">
        My Dashboard
      </div>
      <nav className="flex flex-row md:flex-col gap-2 flex-grow md:flex-grow-0">
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

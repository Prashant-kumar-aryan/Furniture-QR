import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Dashboard for managing your app data",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex h-full">
        <Sidebar />
        <main className="grow md:ml-54 md:mt-0 mt-10">{children}</main>
      </body>
    </html>
  );
}

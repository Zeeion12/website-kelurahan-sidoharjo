import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Layanan Surat Online - Kalurahan Sidoharjo",
  description:
    "Ajukan pembuatan surat keterangan secara online untuk warga Kalurahan Sidoharjo, Kapanewon Tepus, Kabupaten Gunungkidul.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={cn("h-full", "antialiased", "font-sans", inter.variable)}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

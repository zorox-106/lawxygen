import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lawxygen AI Co-Counsel — Next-Gen Legal AI Platform",
  description: "AI co-counsel platform for Indian lawyers: Legal Drafting (NDA & Legal Notice), Statutory RAG Search, and Citation Grounded Research.",
  keywords: ["Lawxygen", "Legal Tech", "AI Legal Assistant", "NDA Drafter", "Indian Kanoon", "Legal RAG Search"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0b0f19] text-slate-100 min-h-screen selection:bg-emerald-500/30 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}

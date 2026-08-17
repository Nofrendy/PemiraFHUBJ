import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Pemira FH UBHARA 2026",
  description: "Pemilihan Raya BEM Fakultas Hukum Universitas Bhayangkara Jakarta 2026",
  icons: {
    icon: '/img/Logo Pemira.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-gradient-to-b from-slate-50 to-white text-gray-900 min-h-screen flex flex-col relative`}>
        {/* Global Ambient Background */}
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
          <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-red-200/30 rounded-full mix-blend-multiply filter blur-[120px] opacity-60"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-orange-100/40 rounded-full mix-blend-multiply filter blur-[120px] opacity-60"></div>
        </div>

        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

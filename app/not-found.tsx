import React from 'react';
import Link from 'next/link';
import { Compass, ArrowLeft, Home } from 'lucide-react';

/**
 * Custom 404 — Next.js App Router not-found.tsx
 * Otomatis menggunakan layout global (Navbar + Footer via root layout).
 */
export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-4 py-20 overflow-hidden bg-white">

      {/* ── Background dot pattern ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-50" />

      {/* ── Ambient gradient orbs ── */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-merah-formal/5 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full bg-slate-300/10 blur-3xl" />

      {/* ── Main Content ── */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-xl w-full">

        {/* Ikon Kompas elegan */}
        <div className="relative mb-8">
          {/* Glow di belakang ikon */}
          <div aria-hidden="true" className="absolute inset-0 rounded-full bg-merah-formal/15 blur-2xl scale-150" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-red-50 border border-red-100 flex items-center justify-center shadow-lg rotate-6 hover:rotate-0 transition-transform duration-500">
            <Compass
              className="w-12 h-12 sm:w-14 sm:h-14 text-merah-formal/70"
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Hero: angka 404 — font serif, gradasi merah → abu gelap */}
        <h1
          className="font-serif font-black leading-none tracking-tighter select-none mb-4"
          style={{
            fontSize: 'clamp(6rem, 20vw, 10rem)',
            background: 'linear-gradient(135deg, #991b1b 0%, #b91c1c 30%, #475569 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </h1>

        {/* Judul halaman */}
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 mb-3 tracking-tight">
          Halaman Tidak Ditemukan
        </h2>

        {/* Sub-teks */}
        <p className="text-base sm:text-lg text-slate-500 leading-relaxed mb-10 max-w-sm">
          Sepertinya Anda tersesat dari jalur pemilihan. Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>

        {/* Tombol aksi */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Primary: Kembali ke Beranda */}
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-merah-formal text-white font-bold rounded-xl text-base shadow-[0_4px_20px_-4px_rgba(139,0,0,0.5)] hover:bg-red-900 hover:shadow-[0_6px_25px_-4px_rgba(139,0,0,0.6)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <Home size={18} />
            Kembali ke Beranda
          </Link>

          {/* Secondary: Kembali (browser back) */}
          <Link
            href="/bantuan"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-white text-slate-700 font-bold rounded-xl text-base border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-300"
          >
            <ArrowLeft size={18} />
            Hubungi Panitia
          </Link>
        </div>

        {/* Divider tipis + label */}
        <div className="mt-12 flex items-center gap-3 w-full max-w-xs">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-xs text-slate-400 font-medium tracking-widest uppercase">Pemira FH UBJ 2026</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

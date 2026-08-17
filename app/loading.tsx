import React from 'react';
import { CandidateCardSkeleton, Skeleton } from '@/components/ui/Skeleton';

/**
 * Global Loading UI — ditampilkan Next.js secara otomatis selama
 * route segment sedang di-load (React Suspense boundary).
 *
 * Desain: menyerupai kerangka halaman Surat Suara / halaman Kandidat
 * (2 card paslon berdampingan) agar transisi terasa mulus dan premium.
 */
export default function GlobalLoading() {
  return (
    <div
      aria-label="Memuat halaman..."
      className="min-h-[calc(100vh-160px)] bg-white relative overflow-hidden"
    >
      {/* Dot pattern background tipis agar tidak terasa kosong */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-40"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 relative z-10">

        {/* ── Page header skeleton ── */}
        <div className="flex flex-col items-center gap-4 mb-14">
          {/* Breadcrumb / badge kecil */}
          <Skeleton className="h-7 w-36 rounded-full" />
          {/* Heading utama */}
          <Skeleton className="h-10 w-64 sm:w-96" />
          {/* Sub-heading */}
          <Skeleton className="h-5 w-48 sm:w-72" />
          {/* Deskripsi */}
          <div className="flex flex-col items-center gap-2 w-full max-w-lg">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>

        {/* ── Dua Card Paslon skeleton berdampingan ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="relative"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Efek glow tipis di belakang card */}
              <div
                aria-hidden="true"
                className="absolute -inset-2 rounded-[2rem] bg-slate-200/60 blur-2xl"
              />
              <div className="relative">
                <CandidateCardSkeleton />
              </div>
            </div>
          ))}
        </div>

        {/* ── Shimmer progress bar di bagian bawah ── */}
        <div className="mt-16 flex flex-col items-center gap-3">
          <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-slate-300 rounded-full animate-[shimmer_1.5s_ease-in-out_infinite]" />
          </div>
          <p className="text-xs text-slate-400 font-medium tracking-widest uppercase animate-pulse">
            Memuat Halaman...
          </p>
        </div>
      </div>

      {/* Inline keyframes shimmer — fallback jika Tailwind belum include */}
      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}

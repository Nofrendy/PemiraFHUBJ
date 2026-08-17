import React from 'react';

// ─── Primitive ──────────────────────────────────────────────────────────────

interface SkeletonProps {
  className?: string;
}

/** Blok skeleton dasar — animate-pulse bg-slate-200 */
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-slate-200 ${className}`}
    />
  );
}

// ─── Card Paslon Skeleton ────────────────────────────────────────────────────

/** Kerangka card paslon (foto + nama + tombol) */
export function CandidateCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
      {/* Foto area */}
      <Skeleton className="w-full h-72 rounded-none rounded-t-3xl" />

      {/* Body */}
      <div className="p-8 space-y-4">
        {/* Badge paslon */}
        <Skeleton className="h-5 w-20 rounded-full" />

        {/* Nama ketua */}
        <Skeleton className="h-7 w-3/4" />
        {/* Nama wakil */}
        <Skeleton className="h-5 w-1/2" />

        {/* Divider */}
        <div className="pt-2 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>

        {/* Tombol-tombol */}
        <div className="pt-4 space-y-3">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Tabel Row Skeleton ──────────────────────────────────────────────────────

/** Satu baris skeleton untuk tabel data pemilih */
export function TableRowSkeleton({ cols = 6 }: { cols?: number }) {
  const widths = ['w-8', 'w-32', 'w-28', 'w-40', 'w-20', 'w-16'];
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-3.5">
          <Skeleton className={`h-4 ${widths[i] ?? 'w-24'}`} />
        </td>
      ))}
    </tr>
  );
}

/** Skeleton untuk seluruh tabel data pemilih (N baris) */
export function TableSkeleton({ rows = 8, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} cols={cols} />
      ))}
    </>
  );
}

// ─── Metric Card Skeleton ────────────────────────────────────────────────────

/** Kerangka card metrik overview dashboard */
export function MetricCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm flex items-center justify-between">
      <div className="space-y-3">
        <Skeleton className="h-3 w-24 rounded-full" />
        <Skeleton className="h-9 w-16" />
      </div>
      <Skeleton className="w-14 h-14 rounded-2xl flex-shrink-0" />
    </div>
  );
}

// ─── Page Header Skeleton ────────────────────────────────────────────────────

/** Kerangka heading section dengan subtitle */
export function PageHeaderSkeleton() {
  return (
    <div className="flex flex-col items-center gap-3">
      <Skeleton className="h-8 w-64 md:w-96" />
      <Skeleton className="h-5 w-48 md:w-72" />
    </div>
  );
}

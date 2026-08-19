"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { getActiveCandidates, CandidateRecord } from '@/lib/supabase/candidates';
import { ChevronRight, User, Loader2 } from 'lucide-react';

export default function FeaturedCandidates() {
  const [candidates, setCandidates] = useState<CandidateRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await getActiveCandidates();
        setCandidates(data);
      } catch (err) {
        console.error('Failed to load active candidates:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle dot pattern */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-serif mb-4 tracking-tight">Kandidat Ketua &amp; Wakil Ketua BEM</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">Kenali lebih dekat calon pemimpin Fakultas Hukum Universitas Bhayangkara Jakarta untuk periode 2026.</p>
        </div>
        
        {loading ? (
          <div className="py-16 text-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-merah-formal" />
            <p className="font-semibold text-sm">Memuat Data Paslon...</p>
          </div>
        ) : candidates.length === 0 ? (
          <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-3xl border border-slate-200 max-w-md mx-auto p-8">
            <User size={48} className="text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-slate-800">Belum Ada Pasangan Calon Terdaftar</p>
            <p className="text-xs text-slate-500 mt-1">Daftar calon ketua dan wakil ketua akan ditampilkan setelah penetapan resmi Panitia KPU.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="relative group">
                <div
                  aria-hidden="true"
                  className="absolute -inset-2 rounded-[2rem] bg-merah-formal/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                />
                <div className="relative bg-slate-50 rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                  <div className="h-64 bg-red-900/5 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/20 to-transparent z-10"></div>
                    
                    {candidate.photo_url ? (
                      <img src={candidate.photo_url} alt={`Paslon ${candidate.number}`} className="w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center z-0 transition-transform duration-700 group-hover:scale-105">
                        <div className="w-40 h-40 rounded-full border-4 border-white/40 flex items-center justify-center bg-red-900/10 shadow-inner backdrop-blur-md">
                          <User size={80} className="text-red-900/40" strokeWidth={1.5} />
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute bottom-5 left-6 z-20">
                      <span className="inline-flex items-center justify-center w-12 h-12 bg-merah-formal text-white font-serif font-bold text-xl rounded-full shadow-lg border-2 border-white">
                        {candidate.number}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-slate-800 text-amber-400 text-[10px] font-bold tracking-widest rounded mb-3">PASLON {candidate.number}</span>
                      <h3 className="text-2xl font-black text-slate-900 font-serif group-hover:text-merah-formal transition-colors leading-snug">
                        {candidate.chairman} &amp; <br/> {candidate.vice_chairman}
                      </h3>
                    </div>
                    
                    <p className="text-slate-600 line-clamp-3 mb-8 leading-relaxed">
                      &ldquo;{candidate.visi}&rdquo;
                    </p>
                    
                    <Link href="/kandidat" className="inline-flex items-center text-merah-formal font-bold hover:text-red-900 transition-colors">
                      Lihat Profil Lengkap <ChevronRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link href="/kandidat">
            <Button variant="outline" className="px-8 py-3 rounded-full border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold shadow-sm">
              Lihat Detail Visi & Misi Semua Kandidat
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

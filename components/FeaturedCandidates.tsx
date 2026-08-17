import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { DUMMY_CANDIDATES } from '@/data/dummy';
import { ChevronRight, User } from 'lucide-react';

export default function FeaturedCandidates() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle dot pattern */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-serif mb-4 tracking-tight">Kandidat Ketua &amp; Wakil Ketua BEM</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">Kenali lebih dekat calon pemimpin Fakultas Hukum Universitas Bhayangkara Jakarta untuk periode 2026.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {DUMMY_CANDIDATES.map((candidate) => (
            // Wrapper dengan glow effect merah di belakang card
            <div key={candidate.id} className="relative group">
              {/* Glow orb merah — sangat halus, blur-3xl */}
              <div
                aria-hidden="true"
                className="absolute -inset-2 rounded-[2rem] bg-merah-formal/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              />
              {/* Card */}
              <div className="relative bg-slate-50 rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                {/* Photo Area placeholder */}
                <div className="h-64 bg-red-900/5 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/20 to-transparent z-10"></div>
                  
                  {/* Elegant Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center z-0 transition-transform duration-700 group-hover:scale-105">
                     <div className="w-40 h-40 rounded-full border-4 border-white/40 flex items-center justify-center bg-red-900/10 shadow-inner backdrop-blur-md">
                       <User size={80} className="text-red-900/40" strokeWidth={1.5} />
                     </div>
                  </div>
                  
                  <div className="absolute bottom-5 left-6 z-20">
                    <span className="inline-flex items-center justify-center w-12 h-12 bg-merah-formal text-white font-serif font-bold text-xl rounded-full shadow-lg border-2 border-white">
                      {candidate.noUrut}
                    </span>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-slate-800 text-amber-400 text-[10px] font-bold tracking-widest rounded mb-3">PASLON {candidate.noUrut}</span>
                    <h3 className="text-2xl font-black text-slate-900 font-serif group-hover:text-merah-formal transition-colors leading-snug">
                      {candidate.presiden} &amp; <br/> {candidate.wapres}
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

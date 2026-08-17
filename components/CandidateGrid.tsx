"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';
import { User } from 'lucide-react';

// Mock Data JSON statis
const candidates = [
  {
    id: 1,
    noUrut: "01",
    presiden: "Budi Santoso",
    wapres: "Siti Aminah",
    tagline: "Sinergi Hukum Berkualitas",
    image: "https://ui-avatars.com/api/?name=Budi+Siti&background=8b0000&color=fff&size=512&font-size=0.33",
    visi: "Mewujudkan BEM FH UBHARA sebagai katalisator pergerakan mahasiswa yang inklusif, responsif, dan menjunjung tinggi nilai-nilai keadilan.",
    misi: [
      "Mengoptimalkan program advokasi dan pelayanan mahasiswa yang tanggap.",
      "Meningkatkan budaya literasi dan diskusi kritis di lingkungan Fakultas Hukum.",
      "Membangun relasi yang harmonis dengan pihak dekanat dan ormawa lain.",
      "Menyelenggarakan kegiatan pengembangan minat bakat yang komprehensif."
    ]
  },
  {
    id: 2,
    noUrut: "02",
    presiden: "Ahmad Fauzan",
    wapres: "Rina Maharani",
    tagline: "Progresif & Berintegritas",
    image: "https://ui-avatars.com/api/?name=Ahmad+Rina&background=000&color=fff&size=512&font-size=0.33",
    visi: "Menjadikan BEM FH UBHARA yang proaktif dan solutif dalam menjawab tantangan era digital dengan berlandaskan Tri Dharma Perguruan Tinggi.",
    misi: [
      "Digitalisasi sistem administrasi dan informasi BEM agar lebih transparan.",
      "Memperkuat kaderisasi dan pembinaan karakter mahasiswa yang berintegritas.",
      "Mengadakan kajian isu hukum kontemporer secara rutin dan terbuka.",
      "Mendorong partisipasi aktif mahasiswa dalam pengabdian kepada masyarakat."
    ]
  }
];

export default function CandidateGrid() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif mb-6">Profil Pasangan Calon</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Kenali lebih dekat calon Presiden dan Wakil Presiden BEM FH UBHARA 2026. Klik pada kartu kandidat untuk melihat detail Visi dan Misi mereka.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
        {candidates.map((paslon, index) => (
          <motion.div 
            key={paslon.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_-4px_rgba(139,0,0,0.1)] border border-gray-100 overflow-hidden cursor-pointer flex flex-col h-full transition-shadow duration-300 relative"
            onClick={() => setSelectedId(selectedId === paslon.id ? null : paslon.id)}
          >
            {/* Tag Nomor Urut */}
            <div className="absolute top-6 right-6 bg-slate-900 backdrop-blur-md px-4 py-1.5 rounded-md shadow-lg z-20 border border-slate-700">
              <span className="font-bold text-amber-400 tracking-widest text-xs">PASLON {paslon.noUrut}</span>
            </div>

            <div className="relative h-72 bg-red-900/5 overflow-hidden group flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent z-10 pointer-events-none"></div>
              
              {/* Elegant Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center z-0 transition-transform duration-700 group-hover:scale-105">
                 <div className="w-40 h-40 rounded-full border-4 border-white/40 flex items-center justify-center bg-red-900/10 shadow-inner backdrop-blur-md">
                   <User size={80} className="text-red-900/40" strokeWidth={1.5} />
                 </div>
              </div>
              
              <div className="absolute bottom-6 left-8 text-white z-20 pr-8">
                <h2 className="text-3xl font-black font-serif mb-1 drop-shadow-lg leading-snug">
                  {paslon.presiden} <br/><span className="text-gray-300 text-2xl font-normal">&amp;</span> {paslon.wapres}
                </h2>
                <p className="text-white/90 font-medium tracking-wide mt-2">
                  "{paslon.tagline}"
                </p>
              </div>
            </div>
            
            <div className="p-8 flex-grow bg-white">
              <AnimatePresence>
                {selectedId === paslon.id ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6">
                      <div className="mb-6 bg-red-50/50 p-5 rounded-xl border border-red-100/50">
                        <h3 className="font-bold text-merah-formal mb-3 uppercase tracking-wider text-sm flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                          Visi
                        </h3>
                        <p className="text-gray-700 text-base leading-relaxed italic font-serif">
                          "{paslon.visi}"
                        </p>
                      </div>
                      
                      <div className="p-5">
                        <h3 className="font-bold text-merah-formal mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                          Misi
                        </h3>
                        <ul className="space-y-3">
                          {paslon.misi.map((m, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-merah-formal mt-2 mr-3"></span>
                              <span className="text-gray-600 leading-relaxed">{m}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <span className="text-gray-500 font-medium">Klik untuk melihat Visi & Misi selengkapnya</span>
                  </div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="p-6 bg-gray-50/80 border-t border-gray-100 mt-auto">
              <Button 
                variant={selectedId === paslon.id ? "primary" : "outline"} 
                className="w-full py-3.5"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId(selectedId === paslon.id ? null : paslon.id);
                }}
              >
                {selectedId === paslon.id ? 'Tutup Detail' : 'Lihat Visi & Misi'}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

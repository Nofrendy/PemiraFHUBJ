"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { getActiveCandidates, CandidateRecord } from '@/lib/supabase/candidates';
import { getElectionStatus, ElectionRecord } from '@/lib/supabase/elections';
import { getCurrentUserVoterRecord, VoterRecord } from '@/lib/supabase/voters';
import { submitVote } from '@/lib/supabase/voting';
import { X, CheckCircle, Info, Loader2, Lock, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function SuratSuaraPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<CandidateRecord[]>([]);
  const [election, setElection] = useState<ElectionRecord | null>(null);
  const [voterRecord, setVoterRecord] = useState<VoterRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [flippedId, setFlippedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [cData, eData, vData] = await Promise.all([
          getActiveCandidates(),
          getElectionStatus(),
          getCurrentUserVoterRecord()
        ]);
        setCandidates(cData);
        setElection(eData);
        setVoterRecord(vData);
      } catch (err) {
        console.error('Failed to load ballot data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleVoteClick = (candidate: CandidateRecord) => {
    if (voterRecord?.has_voted || voterRecord?.voting_status === 'Sudah Memilih') {
      setErrorToast('Anda sudah menggunakan hak pilih sebelumnya.');
      return;
    }
    setSelectedCandidate(candidate);
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      setSelectedCandidate(null);
    }
  };

  const handleConfirmVote = async () => {
    if (!selectedCandidate) return;
    setIsSubmitting(true);
    setErrorToast(null);

    const res = await submitVote(selectedCandidate.id);
    setIsSubmitting(false);

    if (res.success) {
      setSelectedCandidate(null);
      setShowSuccessToast(true);
      if (voterRecord) {
        setVoterRecord({ ...voterRecord, has_voted: true, voting_status: 'Sudah Memilih' });
      }
      setTimeout(() => {
        router.push('/live-count');
      }, 2500);
    } else {
      setErrorToast(res.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-merah-formal" />
          <p className="font-semibold text-sm">Menyiapkan Surat Suara Elektronik...</p>
        </div>
      </div>
    );
  }

  if (voterRecord && (voterRecord.has_voted || voterRecord.voting_status === 'Sudah Memilih')) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-slate-900 mb-2">Anda Sudah Memilih</h2>
          <p className="text-slate-600 text-xs leading-relaxed mb-6">
            Terima kasih! Hak suara Anda dengan NPM <strong>{voterRecord.npm}</strong> telah tercatat secara rahasia di database.
          </p>
          <Button variant="primary" className="w-full py-3" onClick={() => router.push('/live-count')}>
            Lihat Hasil Live Count
          </Button>
        </div>
      </div>
    );
  }

  if (election && election.status !== 'OPEN') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-100">
            <Lock className="w-7 h-7 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-slate-900 mb-2">Bilik Suara Ditutup</h2>
          <p className="text-slate-600 text-xs leading-relaxed mb-6">
            Pemungutan suara saat ini sedang dalam status <strong>{election.status}</strong>. Bilik suara elektronik hanya dapat diakses saat fase OPEN.
          </p>
          <Button variant="primary" className="w-full py-3" onClick={() => router.push('/')}>
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/80 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-50" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-merah-formal/5 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-slate-400/8 blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-2xl mb-6 shadow-sm border border-red-100 rotate-3 transition-transform hover:rotate-0 duration-300">
            <svg className="w-8 h-8 text-merah-formal" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-slate-900 mb-4 tracking-tight">Surat Suara Elektronik</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Klik <strong className="text-slate-900">Lihat Visi &amp; Misi</strong> untuk membalik kartu dan membaca program kerja kandidat. Setelah yakin, tekan <strong className="text-merah-formal">Coblos Paslon</strong>.
          </p>
        </div>

        {errorToast && (
          <div className="max-w-md mx-auto mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorToast}</span>
            </div>
            <button onClick={() => setErrorToast(null)} className="p-1 hover:opacity-75">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {candidates.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto shadow-sm">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-lg">Belum Ada Paslon Aktif</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">Tidak ada pasangan calon berstatus aktif di database untuk dicoblos saat ini.</p>
            <Button variant="outline" onClick={() => router.push('/')}>Kembali ke Beranda</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 perspective-[2000px]">
            {candidates.map((paslon, index) => (
              <div key={paslon.id} className="relative group">
                <div
                  aria-hidden="true"
                  className="absolute -inset-3 rounded-[2rem] bg-merah-formal/10 blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                />
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="relative w-full h-[580px] sm:h-[650px] [perspective:1500px]"
                >
                <motion.div
                  className="w-full h-full relative [transform-style:preserve-3d]"
                  animate={{ rotateY: flippedId === paslon.id ? 180 : 0 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 80, damping: 20 }}
                >
                  {/* --- FRONT FACE --- */}
                  <div className="absolute inset-0 [backface-visibility:hidden] bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col group border border-gray-100">
                    <div className="relative h-3/5 bg-gray-200 overflow-hidden">
                      <img src={paslon.photo_url} alt={`Paslon ${paslon.number}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                      
                      <div className="absolute top-6 right-6 bg-merah-formal/90 backdrop-blur-md px-5 py-1.5 rounded-full shadow-lg border border-red-400/30">
                        <span className="font-bold text-white tracking-widest text-sm">PASLON {paslon.number}</span>
                      </div>

                      <div className="absolute bottom-6 left-8 right-8 text-white">
                        <p className="text-[10px] font-bold text-red-300 uppercase tracking-widest mb-1 opacity-90">Calon Ketua BEM</p>
                        <h2 className="text-3xl font-serif font-bold leading-tight shadow-sm">{paslon.chairman}</h2>
                        
                        <div className="flex items-center gap-3 my-2 opacity-60">
                          <div className="h-px w-10 bg-white/50"></div>
                          <span className="italic text-sm font-serif">&amp;</span>
                          <div className="h-px w-10 bg-white/50"></div>
                        </div>
                        
                        <p className="text-[10px] font-bold text-red-300 uppercase tracking-widest mb-1 mt-3 opacity-90">Calon Wakil Ketua BEM</p>
                        <h2 className="text-2xl font-serif font-bold leading-tight shadow-sm">{paslon.vice_chairman}</h2>
                      </div>
                    </div>
                    
                    <div className="flex-grow p-8 flex flex-col justify-center gap-4 bg-white relative">
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rotate-45"></div>
                      
                      <button 
                        onClick={() => setFlippedId(paslon.id)}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-merah-formal bg-red-50 hover:bg-red-100 font-bold tracking-wide transition-colors border border-red-100 shadow-sm"
                      >
                        <Info size={18} />
                        Baca Visi &amp; Misi
                      </button>
                      <Button 
                        variant="primary" 
                        className="w-full py-4 text-lg font-bold tracking-widest shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                        onClick={() => handleVoteClick(paslon)}
                      >
                        COBLOS PASLON {paslon.number}
                      </Button>
                    </div>
                  </div>

                  {/* --- BACK FACE --- */}
                  <div 
                    className="absolute inset-0 [backface-visibility:hidden] bg-white text-gray-900 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col border border-gray-100" 
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100 bg-white/90 backdrop-blur-md">
                      <h3 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-3">
                        <span className="w-10 h-10 rounded-full bg-merah-formal flex items-center justify-center text-white text-lg">{paslon.number}</span>
                        Visi &amp; Misi
                      </h3>
                      <button 
                        onClick={() => setFlippedId(null)} 
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-merah-formal hover:bg-red-50 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    
                    <div className="flex-grow overflow-y-auto overflow-x-hidden p-8 relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-3xl -mr-10 -mt-10"></div>

                      <div className="relative z-10">
                        <div className="inline-block px-3 py-1 rounded-md bg-red-50 border border-red-100 text-merah-formal font-bold uppercase tracking-widest text-[10px] mb-3">
                          Visi Utama
                        </div>
                        <p className="text-gray-800 italic leading-relaxed mb-8 text-lg font-serif">"{paslon.visi}"</p>
                        
                        <div className="inline-block px-3 py-1 rounded-md bg-blue-50 border border-blue-100 text-blue-700 font-bold uppercase tracking-widest text-[10px] mb-4">
                          Misi Strategis
                        </div>
                        <ul className="space-y-4">
                          {paslon.misi.map((m, idx) => (
                            <li key={idx} className="flex gap-4 text-gray-700 leading-relaxed text-sm">
                              <span className="w-6 h-6 flex-shrink-0 bg-gray-100 border border-gray-200 text-gray-500 rounded-full flex items-center justify-center font-bold text-xs mt-0.5 shadow-sm">
                                {idx + 1}
                              </span>
                              {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="p-6 border-t border-gray-100 bg-white">
                      <button 
                        onClick={() => handleVoteClick(paslon)} 
                        className="w-full py-4 text-lg font-bold tracking-widest bg-merah-formal text-white rounded-xl shadow-[0_4px_15px_-3px_rgba(139,0,0,0.4)] hover:shadow-[0_6px_20px_-3px_rgba(139,0,0,0.6)] hover:-translate-y-1 transition-all duration-300"
                      >
                        SAYA YAKIN, COBLOS PASLON {paslon.number}
                      </button>
                    </div>
                  </div>
                </motion.div>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Dialog Konfirmasi */}
      <AnimatePresence>
        {selectedCandidate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-gray-100"
            >
              <div className="bg-merah-formal p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                <h3 className="text-2xl font-bold font-serif text-white tracking-wide relative z-10">Konfirmasi Final</h3>
              </div>
              
              <div className="p-8 text-center relative">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border-4 border-white -mt-16 relative z-20">
                  <span className="text-4xl font-bold text-merah-formal">{selectedCandidate.number}</span>
                </div>
                
                <p className="text-lg text-gray-700 mb-2 leading-relaxed">
                  Apakah Anda yakin memberikan suara untuk <br/> <strong className="text-2xl text-gray-900 font-serif block mt-2">Paslon Nomor {selectedCandidate.number}?</strong>
                </p>
                
                <div className="bg-red-50/80 border border-red-100 py-3.5 px-5 rounded-2xl mt-6 mb-8 flex items-start text-left gap-4 shadow-sm">
                  <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  <p className="text-sm text-red-800 font-medium leading-relaxed">
                    Pilihan yang sudah disubmit akan dienkripsi ke database dan <strong>tidak dapat diubah atau dibatalkan</strong> kembali.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-1/2 py-4 rounded-xl font-bold" 
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Kembali
                  </Button>
                  <Button 
                    variant="primary" 
                    className="w-full sm:w-1/2 py-4 rounded-xl font-bold relative overflow-hidden group" 
                    onClick={handleConfirmVote}
                    disabled={isSubmitting}
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2 relative z-10">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Menyandikan...
                      </span>
                    ) : (
                      <span className="relative z-10">Ya, Kumpulkan</span>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal Popup */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100 text-center"
            >
              <div className="bg-green-600 p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                <h3 className="text-xl font-bold font-serif text-white tracking-wide relative z-10">Suara Berhasil Terkirim</h3>
              </div>
              <div className="p-8">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-green-100">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <p className="text-lg text-gray-700 leading-relaxed font-medium">
                  Terima kasih telah berpartisipasi! <br/> <span className="text-sm text-gray-500 mt-2 block animate-pulse">Anda dialihkan ke Live Count...</span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

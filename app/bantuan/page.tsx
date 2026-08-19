"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { createHelpReport, getVoterHelpReports, HelpReportRecord } from "@/lib/supabase/helpdesk";
import { Loader2, Ticket, CheckCircle2, Copy, AlertCircle, MessageSquare } from "lucide-react";

export default function BantuanPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'my-tickets'>('create');
  
  // Form State
  const [formData, setFormData] = useState({
    nama: '',
    npm: '',
    category: 'Kendala Login' as 'Kendala Login' | 'Sistem Error' | 'Informasi Paslon' | 'Lainnya',
    subject: '',
    message: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Voter Tickets List State
  const [myTickets, setMyTickets] = useState<HelpReportRecord[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  const fetchMyTickets = useCallback(async () => {
    setLoadingTickets(true);
    try {
      const data = await getVoterHelpReports();
      setMyTickets(data);
    } catch (err) {
      console.error('Error fetching my tickets:', err);
    } finally {
      setLoadingTickets(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'my-tickets') {
      fetchMyTickets();
    }
  }, [activeTab, fetchMyTickets]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!formData.nama.trim() || !formData.npm.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setErrorMessage('Semua kolom formulir wajib diisi.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await createHelpReport({
        user_name: formData.nama,
        npm: formData.npm,
        category: formData.category,
        subject: formData.subject,
        message: formData.message
      });

      if (res.success && res.report_code) {
        setCreatedCode(res.report_code);
        setFormData({ nama: '', npm: '', category: 'Kendala Login', subject: '', message: '' });
      } else {
        setErrorMessage(res.message || 'Gagal mengirim tiket pengaduan.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem saat mengirim laporan.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyCodeToClipboard = () => {
    if (createdCode) {
      navigator.clipboard.writeText(createdCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-gray-900 mb-4 sm:mb-5">Pusat Bantuan & Pengaduan</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Hubungi Panitia KPU jika Anda mengalami kendala teknis, masalah hak pilih, atau pertanyaan seputar Pemira BEM FH UBHARA 2026.
          </p>

          {/* Navigation Tabs */}
          <div className="inline-flex p-1.5 bg-slate-200/70 rounded-2xl mt-8 font-serif">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === 'create'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kirim Tiket Baru
            </button>
            <button
              onClick={() => setActiveTab('my-tickets')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'my-tickets'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Ticket className="w-4 h-4 text-merah-formal" /> Tiket Saya
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Kolom Informasi Kontak */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="h-full border-t-4 border-t-gray-800 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)]">
              <CardContent className="p-8 md:p-10 bg-slate-50 rounded-b-xl">
                <h2 className="text-2xl font-bold font-serif text-gray-900 mb-8">Informasi Kontak</h2>

                <div className="space-y-6">
                  {/* WhatsApp */}
                  <div className="flex items-start gap-5 p-5 bg-white rounded-2xl border border-green-100 shadow-sm">
                    <div className="flex-shrink-0 w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center border border-green-100">
                      <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 tracking-wide uppercase mb-1">WhatsApp Panitia</p>
                      <p className="text-gray-700 font-semibold text-sm">+62 895-0611-4213 <span className="font-normal text-gray-500">(Mada)</span></p>
                      <p className="text-gray-700 font-semibold text-sm">+62 852-1522-2557 <span className="font-normal text-gray-500">(Rei)</span></p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-5 p-5 bg-white rounded-2xl border border-red-100 shadow-sm">
                    <div className="flex-shrink-0 w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
                      <svg className="w-7 h-7 text-merah-formal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 tracking-wide uppercase mb-1">Email Resmi</p>
                      <p className="text-gray-700 font-semibold text-sm">pemirafhubj@gmail.com</p>
                    </div>
                  </div>

                  {/* Sekretariat */}
                  <div className="flex items-start gap-5 p-5 bg-white rounded-2xl border border-blue-100 shadow-sm">
                    <div className="flex-shrink-0 w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                      <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 tracking-wide uppercase mb-1">Sekretariat</p>
                      <p className="text-gray-700 font-semibold text-sm leading-relaxed">Ruang BEM FH UBJ, <br/>Gedung Utama Lantai 2.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Kolom Form / Tiket */}
          <div className="lg:col-span-7">
            {activeTab === 'create' && (
              <Card className="border-t-4 border-t-merah-formal shadow-[0_8px_30px_-4px_rgba(139,0,0,0.08)] h-full">
                <CardHeader className="pb-6 pt-8 px-8 md:px-10 border-b border-gray-50">
                  <h2 className="text-2xl font-bold font-serif text-gray-900">Formulir Laporan Kendala</h2>
                  <p className="text-sm text-gray-500 mt-1">Laporan Anda akan masuk secara otomatis ke sistem penanganan tiket Panitia KPU.</p>
                </CardHeader>
                <CardContent className="pt-8 px-8 md:px-10 pb-10">
                  
                  {createdCode ? (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-8 rounded-2xl text-center space-y-4 animate-in fade-in">
                      <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
                      <h3 className="text-2xl font-bold font-serif">Tiket Laporan Berhasil Dibuat!</h3>
                      <p className="text-sm text-emerald-700 max-w-md mx-auto">
                        Simpan kode lacak di bawah untuk mengecek balasan dari Panitia KPU.
                      </p>
                      <div className="inline-flex items-center gap-3 px-5 py-3 bg-white border border-emerald-300 rounded-xl font-mono text-xl font-black text-slate-900 shadow-sm">
                        <span>{createdCode}</span>
                        <button
                          onClick={copyCodeToClipboard}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
                          title="Salin Kode"
                        >
                          <Copy className="w-5 h-5 text-emerald-700" />
                        </button>
                      </div>
                      {copied && <p className="text-xs font-semibold text-emerald-700">Kode berhasil disalin!</p>}
                      <div className="pt-4">
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setCreatedCode(null);
                            setActiveTab('my-tickets');
                          }}
                        >
                          Lihat Status Tiket Saya
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {errorMessage && (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 shrink-0" />
                          <span>{errorMessage}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input 
                          label="Nama Lengkap" 
                          id="nama" 
                          placeholder="Contoh: Budi Santoso"
                          value={formData.nama}
                          onChange={(e) => setFormData({...formData, nama: e.target.value})}
                          required 
                        />
                        <Input 
                          label="NPM Mahasiswa" 
                          id="npm" 
                          placeholder="Contoh: 20230201011"
                          value={formData.npm}
                          onChange={(e) => setFormData({...formData, npm: e.target.value})}
                          required 
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Kategori Kendala</label>
                          <select
                            className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-merah-formal focus:ring-2 focus:ring-merah-formal/20"
                            value={formData.category}
                            onChange={(e: any) => setFormData({...formData, category: e.target.value})}
                          >
                            <option value="Kendala Login">Kendala Login / Akun</option>
                            <option value="Sistem Error">Sistem Error / Bug Portal</option>
                            <option value="Informasi Paslon">Informasi Paslon & DPT</option>
                            <option value="Lainnya">Lainnya</option>
                          </select>
                        </div>

                        <Input 
                          label="Subjek / Judul Laporan" 
                          id="subject" 
                          placeholder="Contoh: Akun Terkunci / Gagal OTP"
                          value={formData.subject}
                          onChange={(e) => setFormData({...formData, subject: e.target.value})}
                          required 
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
                          Deskripsi Lengkap Masalah
                        </label>
                        <textarea
                          id="message"
                          rows={5}
                          className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-merah-formal focus:ring-2 focus:ring-merah-formal/20 placeholder:text-gray-400"
                          placeholder="Jelaskan kronologi kendala teknis atau masalah yang Anda alami secara detail..."
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          required
                        ></textarea>
                      </div>

                      <Button variant="primary" type="submit" className="w-full py-3.5 text-base font-bold" disabled={isLoading}>
                        {isLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" /> Mengirim Laporan...
                          </span>
                        ) : 'Kirim Tiket Pengaduan'}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            )}

            {/* TAB: TIKET SAYA */}
            {activeTab === 'my-tickets' && (
              <Card className="border-t-4 border-t-slate-800 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)] h-full">
                <CardHeader className="pb-6 pt-8 px-8 md:px-10 border-b border-gray-50 flex flex-row items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold font-serif text-gray-900">Daftar Tiket Pengaduan Saya</h2>
                    <p className="text-sm text-gray-500 mt-1">Status penanganan dan balasan resmi Panitia KPU.</p>
                  </div>
                  <Button variant="outline" className="text-xs px-3 py-1.5" onClick={fetchMyTickets}>Refresh</Button>
                </CardHeader>
                <CardContent className="p-8">
                  {loadingTickets ? (
                    <div className="py-16 text-center text-slate-400">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-slate-500" />
                      <span>Memuat riwayat tiket...</span>
                    </div>
                  ) : myTickets.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 space-y-3">
                      <Ticket className="w-12 h-12 mx-auto text-slate-300" />
                      <p className="font-semibold text-slate-700">Belum ada riwayat tiket pengaduan.</p>
                      <p className="text-xs text-slate-400">Kirim tiket baru jika Anda memerlukan bantuan Panitia KPU.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {myTickets.map((t) => (
                        <div key={t.id} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3 font-mono">
                            <span className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                              <Ticket className="w-4 h-4 text-merah-formal" /> {t.report_code}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                t.status === 'OPEN' ? 'bg-amber-100 text-amber-800' :
                                t.status === 'IN PROGRESS' ? 'bg-blue-100 text-blue-800' :
                                t.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                                'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {t.status}
                            </span>
                          </div>

                          <div>
                            <span className="text-xs font-bold text-slate-400 uppercase">{t.category}</span>
                            <h4 className="text-base font-bold text-slate-900 font-serif mt-0.5">{t.subject}</h4>
                            <p className="text-sm text-slate-600 mt-2 bg-white p-3 rounded-xl border border-slate-200/60 leading-relaxed">
                              {t.message}
                            </p>
                          </div>

                          {/* Balasan Admin KPU */}
                          {t.admin_response ? (
                            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-sm">
                              <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                                <MessageSquare className="w-4 h-4 text-emerald-600" /> Balasan Resmi KPU:
                              </span>
                              <p className="text-emerald-950 font-medium leading-relaxed">{t.admin_response}</p>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 italic">Menunggu tanggapan dari Panitia KPU...</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

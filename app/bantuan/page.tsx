"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";

export default function BantuanPage() {
  const [formData, setFormData] = useState({
    nama: '',
    npm: '',
    kendala: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [kendalaError, setKendalaError] = useState('');

  const FORBIDDEN_CHARS = /[<>]/;

  const handleKendalaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (FORBIDDEN_CHARS.test(value)) {
      setKendalaError('Teks mengandung karakter yang tidak diizinkan.');
    } else {
      setKendalaError('');
    }
    setFormData({ ...formData, kendala: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (FORBIDDEN_CHARS.test(formData.kendala)) {
      setKendalaError('Teks mengandung karakter yang tidak diizinkan.');
      return;
    }
    setIsLoading(true);
    // Simulasi pengiriman data
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setFormData({ nama: '', npm: '', kendala: '' });
      setTimeout(() => setIsSubmitted(false), 8000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-gray-900 mb-4 sm:mb-5">Pusat Bantuan</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Jangan ragu untuk menghubungi kami jika Anda mengalami kesulitan dalam mengakses sistem, gagal login, atau memiliki pertanyaan teknis seputar Pemira.
          </p>
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
                    <div className="flex-shrink-0 w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center border border-green-100">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 tracking-wide uppercase mb-2">WhatsApp Panitia</p>
                      <p className="text-gray-700 font-semibold">+62 895-0611-4213 <span className="font-normal text-gray-500">(Mada)</span></p>
                      <p className="text-gray-700 font-semibold">+62 852-1522-2557 <span className="font-normal text-gray-500">(Rei)</span></p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-5 p-5 bg-white rounded-2xl border border-red-100 shadow-sm">
                    <div className="flex-shrink-0 w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
                      <svg className="w-8 h-8 text-merah-formal" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 tracking-wide uppercase mb-2">Email Resmi</p>
                      <p className="text-gray-700 font-semibold">pemirafhubj@gmail.com</p>
                    </div>
                  </div>

                  {/* Sekretariat */}
                  <div className="flex items-start gap-5 p-5 bg-white rounded-2xl border border-blue-100 shadow-sm">
                    <div className="flex-shrink-0 w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 tracking-wide uppercase mb-2">Sekretariat</p>
                      <p className="text-gray-700 font-semibold leading-relaxed">Ruang BEM FH UBJ, <br/>Gedung Utama Lantai 2.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Kolom Form Tiket Bantuan */}
          <div className="lg:col-span-7">
            <Card className="border-t-4 border-t-merah-formal shadow-[0_8px_30px_-4px_rgba(139,0,0,0.08)] h-full">
              <CardHeader className="pb-6 pt-8 px-8 md:px-10 border-b border-gray-50">
                <h2 className="text-2xl font-bold font-serif text-gray-900">Kirim Tiket Kendala</h2>
                <p className="text-base text-gray-500 mt-2">Isi form di bawah ini jika Anda gagal login atau mengalami kendala teknis spesifik pada portal.</p>
              </CardHeader>
              <CardContent className="pt-8 px-8 md:px-10 pb-10">
                {isSubmitted ? (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-12 rounded-xl text-center h-full flex flex-col justify-center animate-in fade-in zoom-in duration-500">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-2 font-serif">Pesan Berhasil Terkirim!</h3>
                    <p className="text-base text-green-700 max-w-md mx-auto">
                      Terima kasih atas laporannya. Panitia teknis akan segera menindaklanjuti keluhan Anda melalui database sistem.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-7">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                      <Input 
                        label="Nama Lengkap" 
                        id="nama" 
                        placeholder="Contoh: Budi Santoso"
                        value={formData.nama}
                        onChange={(e) => setFormData({...formData, nama: e.target.value})}
                        required 
                      />
                      <Input 
                        label="Nomor Pokok Mahasiswa (NPM)" 
                        id="npm" 
                        placeholder="Contoh: 20210201011"
                        value={formData.npm}
                        onChange={(e) => setFormData({...formData, npm: e.target.value})}
                        required 
                      />
                    </div>
                    
                    <div className="w-full">
                      <label htmlFor="kendala" className="block text-sm font-bold text-gray-700 mb-2">
                        Deskripsi Kendala
                      </label>
                      <textarea
                        id="kendala"
                        rows={5}
                        className={`block w-full rounded-md px-4 py-3 text-gray-900 shadow-sm focus:outline-none focus:ring-4 transition-all duration-200 border sm:text-base placeholder:text-gray-400 ${
                          kendalaError
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-300 focus:border-merah-formal focus:ring-merah-formal/20'
                        }`}
                        placeholder="Ceritakan detail kendala login atau masalah lainnya di sini..."
                        value={formData.kendala}
                        onChange={handleKendalaChange}
                        required
                      ></textarea>
                      {kendalaError && (
                        <p className="mt-1.5 text-sm text-red-600 font-medium">{kendalaError}</p>
                      )}
                    </div>
                    
                    <Button variant="primary" type="submit" className="w-full py-4 text-base" disabled={isLoading}>
                      {isLoading ? 'Mengirim Pesan...' : 'Kirim Pesan Kendala'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

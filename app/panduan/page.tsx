"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/Card";
import { CheckCircle, Key, Eye, Pointer, ShieldCheck } from 'lucide-react';

const steps = [
  {
    icon: <Key size={22} className="text-white" />,
    title: "1. Login ke Portal Pemira",
    description: "Masuk menggunakan Nomor Pokok Mahasiswa (NPM) dan Kata Sandi Khusus yang telah dikirimkan ke email kampus Anda."
  },
  {
    icon: <Eye size={22} className="text-white" />,
    title: "2. Pelajari Kandidat",
    description: "Di halaman Surat Suara, Anda dapat membaca dan mempelajari Visi & Misi dari masing-masing Pasangan Calon secara detail dengan menekan tombol 'Lihat Visi & Misi'."
  },
  {
    icon: <Pointer size={22} className="text-white" />,
    title: "3. Tentukan Pilihan",
    description: "Pilih Pasangan Calon yang sesuai dengan hati nurani Anda dengan menekan tombol merah 'PILIH PASLON' di bawah foto kandidat."
  },
  {
    icon: <ShieldCheck size={22} className="text-white" />,
    title: "4. Konfirmasi Suara",
    description: "Sistem akan memunculkan Pop-up untuk meminta konfirmasi final. Pastikan pilihan Anda benar, karena suara yang sudah dikirimkan akan dikunci oleh sistem kriptografi dan tidak bisa diubah."
  },
  {
    icon: <CheckCircle size={22} className="text-white" />,
    title: "5. Selesai & Pantau",
    description: "Setelah berhasil memilih, Anda akan dialihkan. Anda bisa langsung menuju halaman Live Count untuk memantau perolehan suara secara transparan dan real-time."
  }
];

export default function PanduanPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-gray-900 mb-5">Panduan E-Voting</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Pelajari tata cara dan alur pemilihan digital berikut ini untuk berpartisipasi dalam Pemilihan Raya BEM FH UBHARA 2026 dengan aman dan sah.
          </p>
        </div>

        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-merah-formal before:via-red-300 before:to-transparent">
          {steps.map((step, index) => (
            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              {/* Timeline Bullet */}
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-merah-formal shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10 transition-transform duration-300 group-hover:scale-110">
                {step.icon}
              </div>
              
              {/* Timeline Content */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)]">
                <Card className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-t-4 border-t-merah-formal hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-7">
                    <h3 className="font-bold text-xl font-serif text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-8 max-w-2xl mx-auto shadow-sm">
            <h4 className="font-bold font-serif text-merah-formal text-2xl mb-3">Mengalami Kendala Teknis?</h4>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Jika Anda gagal login, tidak menerima email kata sandi, atau mengalami gangguan sistem saat akan memilih, segera laporkan ke Pusat Bantuan.
            </p>
            <Link 
              href="/bantuan" 
              className="inline-block bg-white text-merah-formal font-bold px-8 py-3 rounded-xl border border-merah-formal shadow-sm hover:bg-merah-formal hover:text-white transition-all duration-300"
            >
              Hubungi Pusat Bantuan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

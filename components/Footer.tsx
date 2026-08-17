import React from 'react';
import { Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/10 backdrop-blur-sm">
                <img src="/img/Logo UBJ.png" alt="Logo UBJ" className="h-10 w-auto object-contain drop-shadow-md" />
                <img src="/img/Logo Bem.png" alt="Logo BEM" className="h-10 w-auto object-contain drop-shadow-md" />
                <img src="/img/Logo Pemira.png" alt="Logo Pemira" className="h-10 w-auto object-contain drop-shadow-md" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-serif text-xl font-bold text-white leading-none tracking-wide">
                  PEMIRA
                </span>
                <span className="font-sans text-xs font-semibold text-gray-400 mt-1.5 leading-none tracking-widest uppercase">
                  FH UBHARA 2026
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed pr-4">
              Pemilihan Raya Badan Eksekutif Mahasiswa Fakultas Hukum Universitas Bhayangkara Jakarta. Berkomitmen untuk mewujudkan demokrasi kampus yang bersih, jujur, adil, dan transparan bagi seluruh civitas akademika.
            </p>
          </div>
          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase mb-5 text-gray-200">Navigasi Utama</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="/" className="hover:text-white transition-colors duration-300 inline-flex items-center">Beranda</a></li>
              <li><a href="/kandidat" className="hover:text-white transition-colors duration-300 inline-flex items-center">Profil Kandidat</a></li>
              <li><a href="/live-count" className="hover:text-white transition-colors duration-300 inline-flex items-center">Live Count</a></li>
              <li><a href="/bantuan" className="hover:text-white transition-colors duration-300 inline-flex items-center">Pusat Bantuan</a></li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <h4 className="text-sm font-semibold tracking-wider uppercase mb-5 text-gray-200">Hubungi Kami</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start">
                <span className="mr-3 mt-0.5 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </span>
                kpum.fh@ubhara.ac.id
              </li>
              <li className="flex items-center group">
                <span className="mr-3 text-gray-500 group-hover:text-pink-500 transition-colors">
                  <Instagram size={16} />
                </span>
                <a href="https://instagram.com/pemirafhubj" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  @pemirafhubj
                </a>
              </li>
              <li className="flex items-start">
                <span className="mr-3 mt-0.5 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </span>
                <span className="leading-relaxed">Sekretariat BEM FH<br />Universitas Bhayangkara Jakarta</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} KPU Mahasiswa FH UBHARA Jakarta. Hak Cipta Dilindungi.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
            <span>&middot;</span>
            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

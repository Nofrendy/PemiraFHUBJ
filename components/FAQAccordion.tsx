"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "Siapa saja yang berhak memilih dalam Pemira ini?",
    answer: "Seluruh mahasiswa aktif Fakultas Hukum Universitas Bhayangkara Jakarta yang terdaftar secara resmi pada semester berjalan berhak memberikan suaranya (masuk dalam Daftar Pemilih Tetap)."
  },
  {
    question: "Bagaimana cara mendapatkan Kata Sandi Khusus?",
    answer: "Kata Sandi Khusus beserta link portal E-Voting akan dikirimkan secara otomatis oleh sistem ke email kampus masing-masing mahasiswa (ekstensi @mhs.ubhara.ac.id) H-3 sebelum masa pencoblosan dimulai."
  },
  {
    question: "Apakah kerahasiaan suara saya terjamin?",
    answer: "Sangat terjamin. Sistem E-Voting Pemira FH UBHARA menggunakan enkripsi end-to-end. Data yang masuk ke dalam database hanya berupa 'token suara' tanpa identitas pemilih, sehingga tidak ada yang bisa melacak siapa memilih siapa."
  },
  {
    question: "Apa yang harus saya lakukan jika gagal login?",
    answer: "Pastikan Anda menggunakan NPM yang benar dan koneksi internet stabil. Jika masih gagal atau lupa kata sandi, segera hubungi Pusat Bantuan Panitia melalui menu 'Bantuan' atau langsung ke Sekretariat KPU Mahasiswa."
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {faqs.map((faq, index) => (
        <div 
          key={index} 
          className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'border-red-200 bg-white shadow-md' : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'}`}
        >
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full flex justify-between items-center px-6 py-5 text-left focus:outline-none"
          >
            <span className={`font-semibold text-lg ${openIndex === index ? 'text-merah-formal' : 'text-gray-700'}`}>
              {faq.question}
            </span>
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className={`flex-shrink-0 ml-4 rounded-full p-1 ${openIndex === index ? 'bg-red-50 text-merah-formal' : 'bg-gray-200 text-gray-500'}`}
            >
              <ChevronDown size={20} />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed border-t border-red-50">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

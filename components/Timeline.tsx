"use client";
import React from 'react';
import { motion } from 'framer-motion';

const timelineData = [
  {
    date: "07 Agustus 2026",
    title: "SOSIALISASI pemira oleh KPR hybrid (Offline/Online via zoom & live Instagram)"
  },
  {
    date: "09 - 12 Agustus 2026",
    title: "Pendaftaran Calon & Registrasi Pemilih Tetap (DPT) secara Online"
  },
  {
    date: "10 - 13 Agustus 2026",
    title: "Pendaftaran Calon secara Offline"
  },
  {
    date: "14 Agustus 2026",
    title: "Verifikasi Berkas Pencalonan secara Offline"
  },
  {
    date: "18 - 19 Agustus 2026",
    title: "Asesmen Calon bersama Demisioner BEM & Wakil Dekan, serta Debat Pasangan Calon secara Hybrid (Offline & Online)"
  },
  {
    date: "20 - 25 Agustus 2026",
    title: "Masa Kampanye Pasangan Calon"
  },
  {
    date: "26 Agustus 2026",
    title: "MASA TENANG"
  },
  {
    date: "27 Agustus 2026",
    title: "Pemungutan, Penghitungan Suara, & Rekapitulasi"
  },
  {
    date: "28 Agustus 2026",
    title: "Pengumuman Hasil & Press Release (Video & Berita Acara)"
  }
];

export default function Timeline() {
  return (
    <div className="relative border-l-4 border-merah-formal/20 ml-4 sm:ml-6 lg:ml-12">
      {timelineData.map((item, index) => (
        <motion.div 
          key={index} 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
          className="mb-10 ml-8 md:ml-10 relative group"
        >
          {/* Titik Timeline */}
          <span className="absolute flex items-center justify-center w-5 h-5 bg-[#990000] rounded-full -left-[43px] md:-left-[51px] ring-4 ring-white group-hover:scale-150 group-hover:ring-red-100 transition-all duration-300"></span>
          
          {/* Kotak Konten */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] group-hover:shadow-[0_8px_30px_rgba(153,0,0,0.08)] group-hover:border-red-100 transition-all duration-300 transform group-hover:-translate-y-1">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#990000] text-white text-sm md:text-sm font-bold tracking-widest mb-4 shadow-md uppercase">
              {item.date}
            </div>
            <h3 className="text-lg md:text-xl font-bold text-slate-800 leading-relaxed group-hover:text-[#990000] transition-colors break-words">
              {item.title}
            </h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";

export default function LoginPanitiaPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 4000);
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-160px)] relative flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">

      {/* Background gradient orbs — warna abu/slate untuk panitia */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        {/* Top-left orb: slate */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            left: '-120px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(71,85,105,0.20) 0%, rgba(71,85,105,0.07) 55%, transparent 75%)',
            filter: 'blur(52px)',
          }}
        />
        {/* Bottom-right orb: merah pudar */}
        <div
          style={{
            position: 'absolute',
            bottom: '-120px',
            right: '-120px',
            width: '480px',
            height: '480px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(185,28,28,0.13) 0%, rgba(185,28,28,0.04) 55%, transparent 75%)',
            filter: 'blur(56px)',
          }}
        />
        {/* Top-right orb: abu */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(100,116,139,0.12) 0%, transparent 70%)',
            filter: 'blur(36px)',
          }}
        />
        {/* Bottom-left orb: merah sangat pudar */}
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            left: '-60px',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(220,38,38,0.09) 0%, transparent 70%)',
            filter: 'blur(32px)',
          }}
        />
      </div>

      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-700/10 border border-slate-700/20 mb-5 shadow-sm">
            <svg className="w-8 h-8 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-gray-900">
            Portal <span className="text-slate-700">Panitia</span>
          </h1>
          <p className="mt-3 text-base text-gray-600">
            Akses terbatas khusus untuk anggota panitia PEMIRA
          </p>
          {/* Security badge */}
          <div className="inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 bg-amber-50 border border-amber-200/70 rounded-full">
            <svg className="w-3.5 h-3.5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-semibold text-amber-700 tracking-wide">Akses Terbatas</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-t-4 border-t-slate-700 shadow-[0_8px_40px_-4px_rgba(71,85,105,0.15),0_4px_20px_-4px_rgba(0,0,0,0.08)] backdrop-blur-sm bg-white/95">
            <CardContent className="px-8 pb-8 pt-8">
              <form onSubmit={handleLogin} className="space-y-6">

                <Input
                  label="ID / Email Panitia"
                  id="identifier"
                  type="text"
                  placeholder="Masukkan ID atau email panitia"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />

                <Input
                  label="Password"
                  id="password-panitia"
                  type="password"
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <div className="pt-2">
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-full py-3.5 text-base !bg-slate-700 hover:!bg-slate-800 focus:!ring-slate-500/30"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Memverifikasi...
                      </span>
                    ) : 'Masuk sebagai Panitia'}
                  </Button>
                </div>
              </form>

              <div className="mt-8 text-center text-sm text-gray-500 border-t border-gray-100 pt-6 space-y-3">
                <p>
                  Bukan panitia?{' '}
                  <Link href="/login" className="font-semibold text-merah-formal hover:text-red-900 transition-colors">
                    Login sebagai Pemilih
                  </Link>
                </p>
                <p className="text-xs text-gray-400">
                  Lupa akses?{' '}
                  <Link href="/bantuan" className="font-semibold text-gray-600 hover:text-gray-900 transition-colors underline underline-offset-2">
                    Hubungi Administrator
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Success Modal Popup */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100 text-center"
            >
              <div className="bg-slate-700 p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                <h3 className="text-xl font-bold font-serif text-white tracking-wide relative z-10">Akses Diterima</h3>
              </div>
              <div className="p-8">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-slate-200">
                  <svg className="w-10 h-10 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed font-medium">
                  Selamat datang,<br /> Anda masuk sebagai <strong className="text-slate-700">PANITIA</strong>.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

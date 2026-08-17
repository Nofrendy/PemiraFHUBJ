"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from 'framer-motion';
import { Lock } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";

export default function LoginPemilihPage() {
  const [npm, setNpm] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [npmError, setNpmError] = useState('');

  const handleNpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Hanya izinkan angka
    const value = e.target.value.replace(/\D/g, '');
    setNpm(value);

    if (value.length > 0 && value.length !== 12) {
      setNpmError('NPM harus terdiri dari 12 digit angka.');
    } else {
      setNpmError('');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (npm.length !== 12) {
      setNpmError('NPM harus terdiri dari 12 digit angka.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 4000);
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-160px)] relative flex items-center justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">

      {/* Background gradient orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        {/* Top-left orb: merah */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            left: '-120px',
            width: '480px',
            height: '480px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(185,28,28,0.18) 0%, rgba(185,28,28,0.06) 55%, transparent 75%)',
            filter: 'blur(48px)',
          }}
        />
        {/* Bottom-right orb: abu */}
        <div
          style={{
            position: 'absolute',
            bottom: '-120px',
            right: '-120px',
            width: '520px',
            height: '520px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(156,163,175,0.22) 0%, rgba(156,163,175,0.07) 55%, transparent 75%)',
            filter: 'blur(56px)',
          }}
        />
        {/* Top-right orb: merah sangat pudar */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(220,38,38,0.10) 0%, transparent 70%)',
            filter: 'blur(36px)',
          }}
        />
        {/* Bottom-left orb: abu sangat pudar */}
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            left: '-60px',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(107,114,128,0.13) 0%, transparent 70%)',
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-merah-formal/10 border border-merah-formal/20 mb-5 shadow-sm">
            <svg className="w-8 h-8 text-merah-formal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-gray-900">
            Login <span className="text-merah-formal">Pemilih</span>
          </h1>
          <p className="mt-3 text-base text-gray-600">
            Masukkan NPM dan kata sandi Anda untuk memberikan suara
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-t-4 border-t-merah-formal shadow-[0_8px_40px_-4px_rgba(185,28,28,0.13),0_4px_20px_-4px_rgba(0,0,0,0.08)] backdrop-blur-sm bg-white/95">
            <CardContent className="px-5 sm:px-8 pb-6 sm:pb-8 pt-6 sm:pt-8">
              <form onSubmit={handleLogin} className="space-y-6">

                {/* NPM Field */}
                <div>
                  <Input
                    label="Nomor Pokok Mahasiswa (NPM)"
                    id="npm"
                    inputMode="numeric"
                    placeholder="Masukkan 12 digit NPM Anda"
                    value={npm}
                    onChange={handleNpmChange}
                    maxLength={12}
                    minLength={12}
                    required
                    error={npmError}
                  />
                  {!npmError && npm.length > 0 && (
                    <p className="mt-1.5 text-xs text-gray-400 font-medium">
                      {npm.length}/12 digit
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <Input
                  label="Password Khusus"
                  id="password"
                  type="password"
                  placeholder="Masukkan kata sandi dari email Anda"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <div className="pt-2 space-y-3">
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-full py-3.5 text-base"
                    disabled={isLoading || npm.length !== 12}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Memproses Data...
                      </span>
                    ) : 'Masuk & Berikan Suara'}
                  </Button>

                  {/* Trust Badge */}
                  <div className="flex items-start gap-2 px-1 pt-1">
                    <Lock className="w-4 h-4 text-slate-400 flex-shrink-0 mt-px" />
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Data Anda dilindungi dengan enkripsi <span className="font-semibold">end-to-end</span>. Pilihan Anda bersifat rahasia dan anonim.
                    </p>
                  </div>
                </div>
              </form>

              <div className="mt-8 text-center text-sm text-gray-500 border-t border-gray-100 pt-6">
                <p>
                  Ada kendala login?{' '}
                  <Link href="/bantuan" className="font-semibold text-merah-formal hover:text-red-900 transition-colors">
                    Hubungi Panitia
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
              <div className="bg-green-600 p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                <h3 className="text-xl font-bold font-serif text-white tracking-wide relative z-10">Login Berhasil</h3>
              </div>
              <div className="p-8">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-green-100">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed font-medium">
                  Selamat datang,<br /> Anda masuk sebagai <strong className="text-merah-formal">PEMILIH</strong>.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

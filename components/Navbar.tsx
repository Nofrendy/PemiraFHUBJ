"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Home, Users, BarChart2, BookOpen, HelpCircle, LogIn, LogOut, Vote, UserCheck, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [npmBadge, setNpmBadge] = useState<string>('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Load and listen to Supabase Auth state
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null);
      if (data.user) {
        const email = data.user.email || '';
        const npm = data.user.user_metadata?.npm || email.split('@')[0];
        setNpmBadge(npm);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        const email = currentUser.email || '';
        const npm = currentUser.user_metadata?.npm || email.split('@')[0];
        setNpmBadge(npm);
      } else {
        setNpmBadge('');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Tutup menu saat navigasi berubah
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Kunci scroll body saat menu mobile terbuka
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
      setNpmBadge('');
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navLinks = [
    { name: 'Beranda',    path: '/',          icon: Home },
    { name: 'Kandidat',   path: '/kandidat',   icon: Users },
    { name: 'Live Count', path: '/live-count', icon: BarChart2 },
    { name: 'Panduan',    path: '/panduan',    icon: BookOpen },
    { name: 'Bantuan',    path: '/bantuan',    icon: HelpCircle },
  ];

  if (user) {
    navLinks.push({ name: 'Bilik Suara', path: '/surat-suara', icon: Vote });
  }

  return (
    <>
      <nav className="bg-white/90 backdrop-blur-md shadow-[0_1px_3px_0_rgba(0,0,0,0.06)] sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18 sm:h-20 w-full">

            {/* Logo & Title */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 sm:gap-4 group">
              <div className="flex items-center gap-1 sm:gap-3">
                <img src="/img/Logo UBJ.png"    alt="Logo UBJ"    className="h-8 sm:h-11 w-auto object-contain drop-shadow-sm" />
                <img src="/img/Logo Bem.png"    alt="Logo BEM"    className="h-8 sm:h-11 w-auto object-contain drop-shadow-sm" />
                <img src="/img/Logo Pemira.png" alt="Logo Pemira" className="h-8 sm:h-11 w-auto object-contain drop-shadow-sm" />
              </div>
              <div className="flex flex-col justify-center border-l border-gray-200 pl-2 sm:pl-4">
                <span className="font-serif text-base sm:text-xl font-bold text-merah-formal group-hover:text-red-900 transition-colors duration-300 leading-none tracking-wide">
                  PEMIRA
                </span>
                <span className="font-sans text-[9px] sm:text-xs font-semibold text-gray-500 mt-0.5 leading-none tracking-widest uppercase">
                  FH UBJ 2026
                </span>
              </div>
            </Link>

            {/* Desktop Navigation (hidden on mobile) */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                    pathname === link.path
                      ? 'text-merah-formal bg-red-50'
                      : 'text-slate-600 hover:text-merah-formal hover:bg-red-50/60'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {user ? (
                <div className="flex items-center gap-2 ml-2">
                  <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                    <UserCheck size={14} className="text-emerald-600" />
                    <span>NPM: {npmBadge}</span>
                  </div>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 border border-slate-200 hover:border-red-600"
                  >
                    <LogOut size={15} />
                    {isLoggingOut ? 'Keluar...' : 'Keluar'}
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="ml-2 inline-flex items-center gap-1.5 bg-merah-formal text-white hover:bg-red-900 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 shadow-[0_2px_10px_-3px_rgba(139,0,0,0.4)] hover:shadow-[0_4px_15px_-3px_rgba(139,0,0,0.6)] hover:-translate-y-px"
                >
                  <LogIn size={15} />
                  Login Pemilih
                </Link>
              )}
            </div>

            {/* Hamburger Button (mobile only) */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex md:hidden items-center justify-center w-10 h-10 rounded-xl text-merah-formal bg-red-50 border border-red-100 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-merah-formal/30 transition-colors"
              aria-label="Buka menu navigasi"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-Over Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Slide-over panel dari kanan */}
            <motion.div
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-[80vw] max-w-xs bg-white shadow-2xl flex flex-col md:hidden"
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <div>
                  <p className="font-serif font-bold text-lg text-slate-900 leading-none">Menu Navigasi</p>
                  {user && (
                    <p className="text-xs text-emerald-600 font-semibold mt-1">
                      NPM: {npmBadge}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-merah-formal flex items-center justify-center text-slate-600 transition-colors"
                  aria-label="Tutup menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                {navLinks.map((link, index) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.path;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index, duration: 0.25 }}
                    >
                      <Link
                        href={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-4 px-4 py-4 rounded-2xl text-base font-bold transition-all duration-200 ${
                          isActive
                            ? 'bg-red-50 text-merah-formal border border-red-100'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-merah-formal'
                        }`}
                      >
                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isActive ? 'bg-merah-formal text-white shadow-md' : 'bg-slate-100 text-slate-500'
                        }`}>
                          <Icon size={20} />
                        </span>
                        <span className="flex-1">{link.name}</span>
                        {isActive && <ChevronRight size={16} className="text-merah-formal" />}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Login / Logout Button di bawah panel */}
              <div className="px-4 pb-8 pt-4 border-t border-slate-100">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.25 }}
                >
                  {user ? (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center justify-center gap-2 w-full bg-slate-800 text-white hover:bg-red-700 px-4 py-4 rounded-2xl text-base font-bold transition-all duration-300"
                    >
                      <LogOut size={18} />
                      Keluar dari Akun
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full bg-merah-formal text-white hover:bg-red-900 px-4 py-4 rounded-2xl text-base font-bold transition-all duration-300 shadow-[0_4px_15px_-3px_rgba(139,0,0,0.4)]"
                    >
                      <LogIn size={18} />
                      Login Pemilih
                    </Link>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

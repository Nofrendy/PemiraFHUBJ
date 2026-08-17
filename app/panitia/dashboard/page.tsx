"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Users, UserCheck, UserMinus, Activity, 
  Search, Filter, LayoutDashboard, Database, 
  Settings, LogOut, ChevronRight, Clock, Menu, X, BarChart2, FileText
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { DUMMY_VOTERS, DUMMY_CANDIDATES } from '@/data/dummy';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function DashboardPanitia() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const firstDataLoad = useRef(true);

  // Simulasi loading tabel saat pertama kali buka tab 'data'
  useEffect(() => {
    if (activeTab === 'data') {
      if (firstDataLoad.current) {
        firstDataLoad.current = false;
        setIsTableLoading(true);
        const t = setTimeout(() => setIsTableLoading(false), 1200);
        return () => clearTimeout(t);
      }
    }
  }, [activeTab]);

  // Simulasi re-loading tabel saat filter berubah
  useEffect(() => {
    if (activeTab === 'data' && !firstDataLoad.current) {
      setIsTableLoading(true);
      const t = setTimeout(() => setIsTableLoading(false), 600);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filterStatus]);

  // Kalkulasi Metrik
  const totalDPT = DUMMY_VOTERS.length;
  const sudahMemilih = DUMMY_VOTERS.filter(v => v.status === 'Sudah Memilih').length;
  const belumMemilih = totalDPT - sudahMemilih;
  const persentase = ((sudahMemilih / totalDPT) * 100).toFixed(1);

  // Filter Logic untuk Tabel Data Pemilih
  const filteredVoters = useMemo(() => {
    return DUMMY_VOTERS.filter(voter => {
      const matchSearch = voter.npm.includes(searchTerm) || voter.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchFilter = filterStatus === 'Semua' || voter.status === filterStatus;
      return matchSearch && matchFilter;
    });
  }, [searchTerm, filterStatus]);

  return (
    // Trick Layout: fixed inset-0 dan z-50 akan menutupi Navbar dan Footer global
    <div className="fixed inset-0 z-[100] bg-slate-50 flex overflow-hidden font-sans">
      
      {/* Overlay Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Kiri */}
      <aside className={`fixed lg:relative lg:flex inset-y-0 left-0 w-64 bg-slate-900 text-white flex-col h-full shadow-2xl z-30 transition-transform duration-300 flex-shrink-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between lg:justify-start gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-merah-formal rounded-xl flex items-center justify-center font-bold text-2xl font-serif shadow-lg border border-red-900 shrink-0">
              P
            </div>
            <div>
              <h2 className="font-bold text-lg tracking-wide text-white">Admin Portal</h2>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">Pemira UBHARA 26</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-r-xl text-sm transition-all duration-300 ${activeTab === 'overview' ? 'bg-red-500/10 text-red-500 font-bold border-l-4 border-red-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white border-l-4 border-transparent font-medium'}`}
          >
            <LayoutDashboard size={20} />
            Overview Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('livecount')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-r-xl text-sm transition-all duration-300 ${activeTab === 'livecount' ? 'bg-red-500/10 text-red-500 font-bold border-l-4 border-red-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white border-l-4 border-transparent font-medium'}`}
          >
            <BarChart2 size={20} />
            Live Count
          </button>
          <button 
            onClick={() => setActiveTab('data')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-r-xl text-sm transition-all duration-300 ${activeTab === 'data' ? 'bg-red-500/10 text-red-500 font-bold border-l-4 border-red-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white border-l-4 border-transparent font-medium'}`}
          >
            <Database size={20} />
            Data Pemilih
          </button>
          <button 
            onClick={() => setActiveTab('pengaturan')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-r-xl text-sm transition-all duration-300 ${activeTab === 'pengaturan' ? 'bg-red-500/10 text-red-500 font-bold border-l-4 border-red-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white border-l-4 border-transparent font-medium'}`}
          >
            <Settings size={20} />
            Pengaturan Sistem
          </button>
        </nav>

        <div className="p-5 border-t border-slate-800 bg-slate-900/50">
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 border border-transparent hover:border-red-500/20"
          >
            <LogOut size={20} />
            Keluar Dashboard
          </button>
        </div>
      </aside>

      {/* Main Content Area (Kanan) */}
      <main className="flex-1 h-full w-full overflow-y-auto bg-slate-50/80 relative">
        {/* Header Content */}
        <header className="bg-white/80 backdrop-blur-md px-4 lg:px-8 py-4 lg:py-5 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-lg lg:text-2xl font-bold text-slate-900 font-serif line-clamp-1">
                {activeTab === 'overview' && 'Overview Dashboard'}
                {activeTab === 'livecount' && 'Live Count Perolehan Suara'}
                {activeTab === 'data' && 'Manajemen Data Pemilih'}
                {activeTab === 'pengaturan' && 'Pengaturan Modul Sistem'}
              </h1>
              <p className="hidden sm:block text-sm text-slate-500 mt-1 font-medium">Sistem Informasi Pemilihan Raya BEM</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 px-4 py-2 rounded-full border border-slate-200 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Sistem Aktif
            </span>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="bg-white border-0 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[100px] -mr-2 -mt-2 z-0"></div>
                  <CardContent className="p-7 flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Pemilih DPT</p>
                      <h3 className="text-4xl font-bold text-slate-900 font-serif tracking-tight">{totalDPT}</h3>
                    </div>
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 border border-slate-100 shadow-sm">
                      <Users size={24} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-[100px] -mr-2 -mt-2 z-0"></div>
                  <CardContent className="p-7 flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-[11px] font-bold text-green-600 uppercase tracking-widest mb-2">Sudah Memilih</p>
                      <h3 className="text-4xl font-bold text-slate-900 font-serif tracking-tight">{sudahMemilih}</h3>
                    </div>
                    <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 border border-green-100 shadow-sm">
                      <UserCheck size={24} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-[100px] -mr-2 -mt-2 z-0"></div>
                  <CardContent className="p-7 flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-[11px] font-bold text-orange-500 uppercase tracking-widest mb-2">Belum Memilih</p>
                      <h3 className="text-4xl font-bold text-slate-900 font-serif tracking-tight">{belumMemilih}</h3>
                    </div>
                    <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 border border-orange-100 shadow-sm">
                      <UserMinus size={24} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-[100px] -mr-2 -mt-2 z-0"></div>
                  <CardContent className="p-7 flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-[11px] font-bold text-red-500 uppercase tracking-widest mb-2">Partisipasi</p>
                      <h3 className="text-4xl font-bold text-slate-900 font-serif tracking-tight">{persentase}%</h3>
                    </div>
                    <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 border border-red-100 shadow-sm">
                      <Activity size={24} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Tabel Data Ringkas */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden h-full">
                    <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                      <h3 className="text-lg font-bold text-slate-900 font-serif">Data Pemilih Terkini</h3>
                      <button onClick={() => setActiveTab('data')} className="text-sm text-merah-formal font-bold hover:underline flex items-center gap-1">
                        Lihat Database <ChevronRight size={16} />
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider border-b border-slate-100">
                          <tr>
                            <th className="px-6 py-3">Nama Lengkap</th>
                            <th className="px-6 py-3">NPM</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {DUMMY_VOTERS.slice(0, 6).map((voter) => (
                            <tr key={voter.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-2.5 font-bold text-slate-900 whitespace-nowrap">{voter.name}</td>
                              <td className="px-6 py-2.5 font-mono whitespace-nowrap">{voter.npm}</td>
                              <td className="px-6 py-2.5 text-slate-500 whitespace-nowrap">{voter.email}</td>
                              <td className="px-6 py-2.5 text-center">
                                <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                  voter.status === 'Sudah Memilih' 
                                    ? 'bg-green-100 text-green-700 border border-green-200' 
                                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                                }`}>
                                  {voter.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Visualisasi Data Live Count (Pie Chart) */}
                <div>
                  <div className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden h-full flex flex-col">
                    <div className="px-6 py-5 border-b border-slate-100 bg-white flex justify-between items-center">
                      <h3 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
                        <Activity size={20} className="text-merah-formal" /> Statistik Pemilih
                      </h3>
                    </div>
                    <div className="flex-grow p-6 flex flex-col items-center justify-center">
                      <div className="w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Sudah Memilih', value: sudahMemilih },
                                { name: 'Belum Memilih', value: belumMemilih }
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              paddingAngle={5}
                              dataKey="value"
                              stroke="none"
                            >
                              <Cell fill="#22c55e" />
                              <Cell fill="#f97316" />
                            </Pie>
                            <Tooltip 
                              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}
                              itemStyle={{ fontWeight: 'bold' }}
                            />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: LIVE COUNT */}
          {activeTab === 'livecount' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
              
              {/* Header Status Live */}
              <div className="bg-slate-900 rounded-3xl p-8 relative overflow-hidden shadow-xl shadow-slate-900/20 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-merah-formal/40 rounded-full blur-[100px] -mr-20 -mt-20 z-0 mix-blend-screen"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-bold uppercase tracking-widest mb-4">
                      <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
                      LIVE BROADCAST SYSTEM
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold font-serif tracking-tight mb-2">Real-Time Vote Tally</h2>
                    <p className="text-slate-400 text-lg">Perolehan suara sementara Pemilihan Raya BEM 2026</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl min-w-[200px] text-center">
                    <p className="text-slate-300 text-sm font-bold uppercase tracking-widest mb-1">Total Suara Masuk</p>
                    <p className="text-5xl font-bold font-serif text-white">{sudahMemilih}</p>
                    <p className="text-green-400 text-xs font-bold mt-2">▲ {persentase}% dari DPT</p>
                  </div>
                </div>
              </div>

              {/* Progress Bars Paslon — data dari DUMMY_CANDIDATES */}
              <div className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 p-8 md:p-12">
                {(() => {
                  const totalVotes = DUMMY_CANDIDATES.reduce((a, c) => a + c.votes, 0);
                  return (
                    <div className="space-y-10">
                      {DUMMY_CANDIDATES.map((paslon) => {
                        const pct = totalVotes > 0 ? ((paslon.votes / totalVotes) * 100) : 0;
                        const pctStr = pct.toFixed(1);
                        const isLeading = paslon.votes === Math.max(...DUMMY_CANDIDATES.map(c => c.votes));
                        return (
                          <div key={paslon.id}>
                            <div className="flex justify-between items-end mb-5">
                              <div className="flex items-center gap-5">
                                <div
                                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full font-bold text-2xl sm:text-3xl flex items-center justify-center border-4 shadow-lg text-white"
                                  style={{ background: paslon.color, borderColor: `${paslon.color}40` }}
                                >
                                  {paslon.noUrut}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="block font-bold text-slate-900 text-xl sm:text-2xl leading-tight">
                                      {paslon.presiden} &amp; {paslon.wapres}
                                    </span>
                                    {isLeading && (
                                      <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-100 text-amber-700 border border-amber-200">
                                        Unggul
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{paslon.name}</span>
                                </div>
                              </div>
                              {/* Angka pasti + persentase */}
                              <div className="text-right flex-shrink-0">
                                <span className="block text-4xl sm:text-6xl font-bold font-serif" style={{ color: paslon.color }}>
                                  {paslon.votes.toLocaleString('id-ID')}
                                </span>
                                <span className="text-slate-500 font-bold text-base mt-0.5 block">{pctStr}%</span>
                              </div>
                            </div>
                            {/* Progress bar */}
                            <div className="w-full bg-slate-100 rounded-full h-7 overflow-hidden shadow-inner">
                              <div
                                className="h-full rounded-full transition-all duration-1000 ease-out relative"
                                style={{ width: `${pctStr}%`, background: `linear-gradient(90deg, ${paslon.color}cc, ${paslon.color})` }}
                              >
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1.5rem_1.5rem]" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-xs font-bold">{pctStr}%</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Chart Visualizations — data dari DUMMY_CANDIDATES */}
              {(() => {
                const totalVotes = DUMMY_CANDIDATES.reduce((a, c) => a + c.votes, 0);
                const pieData = DUMMY_CANDIDATES.map(c => ({ name: c.name, value: c.votes, color: c.color }));
                const barData = DUMMY_CANDIDATES.map(c => ({ name: c.name, Suara: c.votes, color: c.color }));
                return (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Pie Chart */}
                    <div className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 p-8">
                      <h3 className="text-lg font-bold text-slate-900 font-serif mb-1">Distribusi Suara</h3>
                      <p className="text-xs text-slate-400 font-medium mb-6">Total suara masuk: <strong className="text-slate-700">{totalVotes.toLocaleString('id-ID')}</strong> suara</p>
                      <div className="w-full h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%" cy="45%"
                              innerRadius={75} outerRadius={115}
                              paddingAngle={5}
                              dataKey="value"
                              stroke="#ffffff" strokeWidth={2}
                              label={({ name, percent }) => `${(percent * 100).toFixed(1)}%`}
                              labelLine={false}
                            >
                              {pieData.map((entry, i) => (
                                <Cell key={i} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value: number) => [`${value.toLocaleString('id-ID')} suara`, 'Perolehan']}
                              contentStyle={{ backgroundColor: '#1e293b', color: '#ffffff', borderRadius: '8px', border: 'none' }}
                              itemStyle={{ color: '#ffffff' }}
                            />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 p-8">
                      <h3 className="text-lg font-bold text-slate-900 font-serif mb-1">Perbandingan Kuantitatif</h3>
                      <p className="text-xs text-slate-400 font-medium mb-6">Angka suara per paslon secara aktual</p>
                      <div className="w-full h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={barData} margin={{ top: 20, right: 10, left: 0, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontWeight: 'bold', fontSize: 13 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                            <Tooltip
                              cursor={{ fill: '#f8fafc' }}
                              formatter={(value: number) => [`${value.toLocaleString('id-ID')} suara`, 'Perolehan']}
                              contentStyle={{ backgroundColor: '#1e293b', color: '#ffffff', borderRadius: '8px', border: 'none' }}
                              itemStyle={{ color: '#ffffff' }}
                            />
                            <Bar dataKey="Suara" radius={[6, 6, 0, 0]} maxBarSize={90}>
                              {barData.map((entry, i) => (
                                <Cell key={i} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB: DATA PEMILIH */}
          {activeTab === 'data' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
                <div className="px-6 py-6 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <h3 className="text-xl font-bold text-slate-900 font-serif">Database Pemilih Keseluruhan</h3>
                  
                  {/* Filter & Search Bar */}
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text"
                        placeholder="Cari NPM atau Nama..."
                        className="w-full pl-10 pr-4 py-2.5 text-sm font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-merah-formal focus:border-transparent transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <select
                        className="appearance-none pl-4 pr-10 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-merah-formal focus:border-transparent bg-white text-slate-700 font-bold cursor-pointer shadow-sm"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="Semua">Semua Status</option>
                        <option value="Sudah Memilih">Sudah Memilih</option>
                        <option value="Belum Memilih">Belum Memilih</option>
                      </select>
                      <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-widest border-b-2 border-slate-100">
                      <tr>
                        <th className="px-6 py-3.5">No</th>
                        <th className="px-6 py-3.5">Pemilih</th>
                        <th className="px-6 py-3.5">Kontak</th>
                        <th className="px-6 py-3.5">Program Studi</th>
                        <th className="px-6 py-3.5 text-center">Berkas KRS</th>
                        <th className="px-6 py-3.5 text-center">Status Pemilihan</th>
                        <th className="px-6 py-3.5 text-right">Waktu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {isTableLoading ? (
                        /* ── Skeleton Loading Rows ── */
                        <TableSkeleton rows={8} cols={7} />
                      ) : filteredVoters.length > 0 ? (
                        filteredVoters.map((voter, index) => (
                          <tr key={voter.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-3 font-bold text-slate-400">{index + 1}</td>
                            <td className="px-6 py-3 whitespace-nowrap">
                              <div className="font-bold text-slate-900">{voter.name}</div>
                              <div className="font-mono text-xs text-slate-500 mt-0.5">{voter.npm}</div>
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap">
                              <div className="text-slate-700">{voter.email}</div>
                              <div className="text-xs text-slate-500 mt-0.5 font-medium">{voter.hp}</div>
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap">
                              <div className="text-slate-700 font-medium">{voter.prodi}</div>
                              <div className="text-xs text-slate-500 mt-0.5">Angkatan {voter.angkatan}</div>
                            </td>
                            <td className="px-6 py-3 text-center whitespace-nowrap">
                              <a 
                                href={voter.krsUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors text-xs font-bold shadow-sm"
                              >
                                <FileText size={14} />
                                Lihat KRS
                              </a>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm ${
                                voter.status === 'Sudah Memilih' 
                                  ? 'bg-green-100 text-green-700 border border-green-200' 
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}>
                                {voter.status}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-right text-slate-500 font-bold whitespace-nowrap">
                              {voter.time}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-6 py-20 text-center text-slate-500">
                            <div className="flex flex-col items-center justify-center">
                              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <Search size={32} className="text-slate-400" />
                              </div>
                              <p className="text-lg font-bold text-slate-700">Data tidak ditemukan</p>
                              <p className="text-sm mt-1">Coba ubah kata kunci atau filter pencarian Anda.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>

                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PENGATURAN */}
          {activeTab === 'pengaturan' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-12 text-center text-slate-500">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
                  <Settings size={48} className="text-slate-300 animate-[spin_10s_linear_infinite]" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 font-serif mb-3">Modul Pengaturan Terkunci</h2>
                <p className="max-w-md mx-auto text-slate-600 leading-relaxed">
                  Modul pengaturan hanya tersedia ketika aplikasi sudah terintegrasi dengan Backend untuk mengelola Jadwal, DPT, dan konfigurasi API Keys.
                </p>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

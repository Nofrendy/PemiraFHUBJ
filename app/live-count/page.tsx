"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { DUMMY_CANDIDATES, CONFIG } from '@/data/dummy';

export default function LiveCountPage() {
  const [data, setData] = useState(DUMMY_CANDIDATES);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    // Simulasi Real-time: Tambah suara acak setiap 5 detik
    const interval = setInterval(() => {
      setData(currentData => {
        return currentData.map(candidate => {
          // Tambah 0 hingga 3 suara secara acak
          const randomVotes = Math.floor(Math.random() * 4);
          return { ...candidate, votes: candidate.votes + randomVotes };
        });
      });
      setLastUpdated(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!isClient) return null; // Hydration fix

  const totalSuara = data.reduce((acc, curr) => acc + curr.votes, 0);
  const persentasePartisipasi = ((totalSuara / CONFIG.totalDPT) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50/50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          {/* Live Indicator */}
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-red-50 border border-red-100 mb-6 shadow-sm">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600"></span>
            </span>
            <span className="text-sm font-bold text-red-700 tracking-widest uppercase">Live Real-time</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-gray-900 mb-4">Dashboard Live Count</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Pantau perolehan suara Pemilihan Raya BEM FH UBHARA 2026 secara transparan. Data diperbarui otomatis secara real-time.
          </p>
        </div>

        {/* Statistik Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-t-4 border-t-merah-formal shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <CardContent className="p-8">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Total Suara Masuk</p>
              <div className="flex items-baseline gap-3">
                <h2 className="text-5xl font-bold text-gray-900 font-serif">{totalSuara.toLocaleString('id-ID')}</h2>
                <span className="text-gray-500 font-medium">suara</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-gray-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <CardContent className="p-8">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Partisipasi Pemilih</p>
              <div className="flex items-baseline gap-3">
                <h2 className="text-5xl font-bold text-gray-900 font-serif">{persentasePartisipasi}%</h2>
                <span className="text-gray-500 font-medium">dari {CONFIG.totalDPT.toLocaleString('id-ID')} DPT</span>
              </div>
              {/* Progress bar partisipasi */}
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div className="bg-gray-800 h-2 rounded-full transition-all duration-1000" style={{ width: `${persentasePartisipasi}%` }}></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-blue-600 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <CardContent className="p-8">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Terakhir Diperbarui</p>
              <div className="flex flex-col justify-center h-[52px]">
                <h2 className="text-2xl font-bold text-gray-900 font-serif tracking-wide">
                  {lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB
                </h2>
                <span className="text-gray-500 font-medium mt-1">
                  {lastUpdated.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Statistik Per Paslon ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {data.map((paslon) => {
            const pct = totalSuara > 0 ? ((paslon.votes / totalSuara) * 100).toFixed(1) : '0.0';
            return (
              <Card key={paslon.id} className="shadow-lg border border-gray-100 overflow-hidden">
                <CardContent className="p-0">
                  {/* Top accent bar warna paslon */}
                  <div className="h-1.5 w-full" style={{ background: paslon.color }} />
                  <div className="p-7 flex items-center justify-between gap-6">
                    {/* Nomor + nama */}
                    <div className="flex items-center gap-5 min-w-0">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl font-serif text-white shadow-lg flex-shrink-0"
                        style={{ background: paslon.color }}
                      >
                        {paslon.noUrut}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">Paslon {paslon.noUrut}</p>
                        <p className="font-bold text-gray-900 text-base leading-snug truncate">
                          {paslon.presiden} &amp; {paslon.wapres}
                        </p>
                      </div>
                    </div>
                    {/* Angka suara pasti + persentase */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-4xl font-bold font-serif" style={{ color: paslon.color }}>
                        {paslon.votes.toLocaleString('id-ID')}
                      </p>
                      <p className="text-sm font-bold text-gray-400 mt-0.5">{pct}%</p>
                    </div>
                  </div>
                  {/* Progress bar warna paslon */}
                  <div className="px-7 pb-6">
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${pct}%`, background: paslon.color }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 font-medium mt-1.5 text-right">{pct}% dari total suara masuk</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Bar Chart */}
          <Card className="shadow-lg border border-gray-100">
            <CardHeader className="border-b border-gray-50 pb-5 pt-8 px-8">
              <h3 className="text-xl font-bold font-serif text-gray-900">Perbandingan Suara Sementara</h3>
            </CardHeader>
            <CardContent className="p-8 h-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#4b5563', fontWeight: 700, fontSize: 14 }} 
                    dy={15} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 13 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ backgroundColor: '#1e293b', color: '#ffffff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
                    itemStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="votes" radius={[4, 4, 0, 0]} maxBarSize={100} animationDuration={1000}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card className="shadow-lg border border-gray-100">
            <CardHeader className="border-b border-gray-50 pb-5 pt-8 px-8">
              <h3 className="text-xl font-bold font-serif text-gray-900">Distribusi Persentase</h3>
            </CardHeader>
            <CardContent className="p-8 h-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="45%"
                    innerRadius={90}
                    outerRadius={140}
                    paddingAngle={4}
                    dataKey="votes"
                    stroke="#ffffff"
                    strokeWidth={2}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                    labelLine={true}
                    animationDuration={1000}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', color: '#ffffff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
                    itemStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                  />
                  <Legend verticalAlign="bottom" height={40} iconType="circle" wrapperStyle={{ fontWeight: 600, color: '#4b5563' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

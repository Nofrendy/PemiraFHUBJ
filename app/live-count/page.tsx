"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { getLiveCountData, subscribeToLiveCount, LiveCountResponse, CandidateVoteAggregate } from '@/lib/supabase/livecount';
import { Loader2, RefreshCw, Lock, AlertTriangle, Trophy } from 'lucide-react';

const CANDIDATE_COLORS = ['#8b0000', '#000000', '#2563eb', '#059669', '#d97706'];

export default function LiveCountPage() {
  const [liveData, setLiveData] = useState<LiveCountResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [realtimeStatus, setRealtimeStatus] = useState<'SUBSCRIBED' | 'CLOSED' | 'CHANNEL_ERROR' | 'INITIALIZING'>('INITIALIZING');
  const [isClient, setIsClient] = useState(false);

  const fetchLatestCount = useCallback(async () => {
    try {
      const res = await getLiveCountData();
      setLiveData(res);
    } catch (err) {
      console.error('Error loading live count:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
    fetchLatestCount();

    // Setup Supabase Realtime Subscription
    const unsubscribe = subscribeToLiveCount(
      () => {
        fetchLatestCount();
      },
      (status) => {
        setRealtimeStatus(status);
      }
    );

    // Controlled aggregate polling interval (every 15 seconds)
    const pollingInterval = setInterval(() => {
      fetchLatestCount();
    }, 15000);

    return () => {
      unsubscribe();
      clearInterval(pollingInterval);
    };
  }, [fetchLatestCount]);

  if (!isClient || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-merah-formal" />
          <p className="font-semibold text-sm">Menghubungkan ke Realtime Live Count Supabase...</p>
        </div>
      </div>
    );
  }

  const candidates = liveData?.candidates || [];
  const election = liveData?.election;
  const totalSuara = liveData?.totalVotesCast || 0;
  const persentasePartisipasi = liveData?.turnoutPercentage || 0;
  const lastUpdated = liveData?.lastUpdated || '-';

  // Prepare chart data
  const chartData = candidates.map((c, idx) => ({
    id: c.candidate_id,
    number: c.number,
    name: `Paslon ${c.number}`,
    fullName: `${c.chairman} & ${c.vice_chairman}`,
    votes: c.total_votes,
    percentage: c.percentage,
    color: CANDIDATE_COLORS[idx % CANDIDATE_COLORS.length]
  }));

  // Determine Winner Paslon if CLOSED
  const winningPaslon = election?.status === 'CLOSED' && chartData.length > 0
    ? [...chartData].sort((a, b) => b.votes - a.votes)[0]
    : null;

  return (
    <div className="min-h-screen bg-gray-50/50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Banner Election Operational State */}
        {election?.status === 'PAUSED' && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <strong className="font-bold">Pemilihan Sementara Dijeda oleh KPU:</strong>
              <span> Proses pemungutan suara dihentikan sementara. Hasil perolehan di bawah adalah data agregat hingga jeda dilakukan.</span>
            </div>
          </div>
        )}

        {election?.status === 'CLOSED' && (
          <div className="mb-8 p-6 bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl shadow-lg animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-400/10 border border-amber-400/30 text-amber-400 rounded-2xl">
                  <Trophy className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase font-mono tracking-wider">Hasil Resmi Pemira Final</span>
                  <h2 className="text-xl font-bold font-serif text-white mt-0.5">Pemungutan Suara Telah Ditutup Permanen</h2>
                  {winningPaslon && (
                    <p className="text-xs text-slate-300 mt-1">
                      Perolehan suara tertinggi diraih oleh <strong className="text-amber-400 font-serif">Paslon {winningPaslon.number} ({winningPaslon.fullName})</strong> dengan <strong className="text-white">{winningPaslon.votes.toLocaleString('id-ID')} suara ({winningPaslon.percentage}%)</strong>.
                    </p>
                  )}
                </div>
              </div>
              <span className="px-3 py-1 bg-red-950 text-red-400 border border-red-800 rounded-full text-xs font-mono font-bold uppercase shrink-0">
                CLOSED FINAL
              </span>
            </div>
          </div>
        )}

        <div className="text-center mb-12">
          {/* Live vs Polling Realtime Indicator */}
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-white border border-slate-200 mb-6 shadow-sm font-mono text-xs">
            {realtimeStatus === 'SUBSCRIBED' ? (
              <>
                <span className="relative flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-600"></span>
                </span>
                <span className="font-bold text-emerald-700 uppercase">Live Realtime WebSocket</span>
              </>
            ) : (
              <>
                <span className="relative flex h-3 w-3">
                  <span className="inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
                <span className="font-bold text-amber-700 uppercase flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin text-amber-600" /> Polling Fallback (10s)
                </span>
              </>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-gray-900 mb-4">Dashboard Live Count</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Pantau perolehan suara Pemilihan Raya BEM FH UBHARA 2026 secara transparan. Data diperbarui secara otomatis dari database Supabase.
          </p>
        </div>

        {/* Key Metrics Cards */}
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
                <span className="text-gray-500 font-medium">dari {(liveData?.totalVotersTarget || 0).toLocaleString('id-ID')} DPT</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div className="bg-gray-800 h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min(persentasePartisipasi, 100)}%` }}></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-blue-600 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <CardContent className="p-8">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Terakhir Diperbarui</p>
              <div className="flex flex-col justify-center h-[52px]">
                <h2 className="text-2xl font-bold text-gray-900 font-serif tracking-wide font-mono">
                  {lastUpdated}
                </h2>
                <span className="text-gray-500 font-medium mt-1">
                  {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistik Per Paslon */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {chartData.map((paslon) => (
            <Card key={paslon.id} className="shadow-lg border border-gray-100 overflow-hidden">
              <CardContent className="p-0">
                <div className="h-1.5 w-full" style={{ background: paslon.color }} />
                <div className="p-7 flex items-center justify-between gap-6">
                  <div className="flex items-center gap-5 min-w-0">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl font-serif text-white shadow-lg flex-shrink-0"
                      style={{ background: paslon.color }}
                    >
                      {paslon.number}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">Paslon {paslon.number}</p>
                      <p className="font-bold text-gray-900 text-base leading-snug truncate">
                        {paslon.fullName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-4xl font-bold font-serif" style={{ color: paslon.color }}>
                      {paslon.votes.toLocaleString('id-ID')}
                    </p>
                    <p className="text-sm font-bold text-gray-400 mt-0.5">{paslon.percentage}%</p>
                  </div>
                </div>
                <div className="px-7 pb-6">
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${paslon.percentage}%`, background: paslon.color }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 font-medium mt-1.5 text-right">{paslon.percentage}% dari total suara masuk</p>
                </div>
              </CardContent>
            </Card>
          ))}
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
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
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
                    {chartData.map((entry, index) => (
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
                    data={chartData}
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
                    {chartData.map((entry, index) => (
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

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trophy, Users, BarChart2, History, Target, Star, Activity, Award, TrendingUp, Calendar, Zap, ShieldCheck } from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell 
} from 'recharts';
import { motion, AnimatePresence } from "framer-motion";

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111] border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
        <p className="text-white/40 text-[10px] font-black uppercase mb-2 tracking-widest">{label} SEASON</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <p className="text-sm font-bold text-white">
              {entry.name}: <span className="text-[#00e5a0]">{entry.value}</span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function PlayerHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const playerName = decodeURIComponent(params.name as string);

  const [loading, setLoading] = useState(true);
  const [selectedStat, setSelectedStat] = useState('goals');
  const [activeTab, setActiveTab] = useState('contribution');
  const [currentAwardPage, setCurrentAwardPage] = useState(0);

  // 데이터 모킹 (참고 코드 로직 및 디자인 일관성 유지)
  const historyData = [
    { year: '2021', ovr: 85, goals: 8, assists: 5, attackPoints: 13, cleanSheets: 1, matches: 20, winRate: 55, personalPoints: 30, momTop3Count: 1, win: 10, draw: 5, lose: 5, momScore: 120 },
    { year: '2022', ovr: 88, goals: 12, assists: 8, attackPoints: 20, cleanSheets: 2, matches: 25, winRate: 60, personalPoints: 45, momTop3Count: 3, win: 15, draw: 5, lose: 5, momScore: 150 },
    { year: '2023', ovr: 90, goals: 18, assists: 11, attackPoints: 29, cleanSheets: 4, matches: 28, winRate: 64, personalPoints: 59, momTop3Count: 5, win: 18, draw: 4, lose: 6, momScore: 180 },
    { year: '2024', ovr: 92, goals: 22, assists: 15, attackPoints: 37, cleanSheets: 5, matches: 30, winRate: 67, personalPoints: 64, momTop3Count: 7, win: 20, draw: 5, lose: 5, momScore: 210 },
    { year: '2025', ovr: 93, goals: 25, assists: 12, attackPoints: 37, cleanSheets: 6, matches: 32, winRate: 69, personalPoints: 69, momTop3Count: 8, win: 22, draw: 6, lose: 4, momScore: 240 },
    { year: '2026', ovr: 96, goals: 28, assists: 18, attackPoints: 46, cleanSheets: 8, matches: 35, winRate: 71, personalPoints: 80, momTop3Count: 10, win: 25, draw: 5, lose: 5, momScore: 280 },
  ];

  const statOptions = [
    { value: 'ovr', label: '오버롤', color: '#00e5a0', icon: Star },
    { value: 'matches', label: '출석(출장)', color: '#ff6b6b', icon: Calendar },
    { value: 'goals', label: '득점', color: '#ffd166', icon: Target },
    { value: 'assists', label: '어시스트', color: '#00b4ff', icon: Zap },
    { value: 'attackPoints', label: '공격포인트', color: '#ff9f1c', icon: Activity },
    { value: 'cleanSheets', label: '클린시트', color: '#4cc9f0', icon: ShieldCheck },
    { value: 'personalPoints', label: '개인승점', color: '#a855f7', icon: TrendingUp },
    { value: 'winRate', label: '승률(%)', color: '#4cc9f0', icon: TrendingUp },
    { value: 'momTop3Count', label: 'MOM TOP3', color: '#f72585', icon: Trophy },
  ];

  const bestPartners = [
    { label: "가장 많이 뛴 동료", name: "최규빈", value: "32경기", color: "#00e5a0", icon: Users },
    { label: "시너지 해결사", name: "이지석", value: "8득점", color: "#ffd166", icon: Zap },
    { label: "특급 도우미", name: "박정빈", value: "6도움", color: "#00b4ff", icon: Star },
    { label: "철벽 듀오", name: "조원빈", value: "10회", color: "#8884d8", icon: ShieldCheck },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-dvh bg-[#080808] flex flex-col items-center justify-center gap-6">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-[#00e5a0]/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#00e5a0] border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-4 bg-[#00e5a0]/10 rounded-full animate-pulse flex items-center justify-center">
            <Activity className="w-8 h-8 text-[#00e5a0]" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-white text-lg font-black italic uppercase tracking-tighter animate-pulse mb-1">Analyzing Performance</p>
          <p className="text-white/30 text-[10px] font-bold tracking-[0.2em] uppercase">Player History Engine v10</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#080808] text-white font-['Noto_Sans_KR'] selection:bg-[#00e5a0]/30 selection:text-[#00e5a0] overflow-x-hidden">
      {/* Background Blurs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-[#00e5a0]/5 blur-[120px] rounded-full"></div>
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-[#00b4ff]/5 blur-[150px] rounded-full"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-[#ffd166]/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-16">
        {/* Navigation Header */}
        <div className="flex flex-col gap-10 mb-16">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => router.back()}
                className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-bold text-white/60 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                BACK
              </button>
              <div className="px-3 py-1 bg-[#00e5a0]/10 border border-[#00e5a0]/20 rounded-lg text-[10px] font-black text-[#00e5a0] tracking-widest uppercase italic">
                All-Time Statistics
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-tight flex flex-wrap items-center gap-x-4">
              <span className="text-white">{playerName}</span>
              <span className="text-[#00e5a0] drop-shadow-[0_0_20px_rgba(0,229,160,0.3)] underline decoration-[#00e5a0]/30 underline-offset-8">올타임 통합 기록</span>
            </h1>
          </div>
          
          {/* Quick Stats Grid - Expanded to 9 items */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-3 w-full">
            {[
              { label: "통산 출장수", val: "150", icon: Calendar, color: "#ff6b6b" },
              { label: "통산 득점", val: "105", icon: Target, color: "#ffd166" },
              { label: "통산 도움", val: "64", icon: Zap, color: "#00b4ff" },
              { label: "통산 공격포인트", val: "169", icon: Activity, color: "#ff9f1c" },
              { label: "통산 클린시트", val: "25", icon: ShieldCheck, color: "#4cc9f0" },
              { label: "통산 개인승점", val: "450", icon: TrendingUp, color: "#a855f7" },
              { label: "통산 승률", val: "71%", icon: TrendingUp, color: "#4cc9f0" },
              { label: "MOM TOP 3", val: "33", icon: Trophy, color: "#f72585" },
              { label: "평균 OVR", val: "94.2", icon: Star, color: "#00e5a0" },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-[24px] p-4 flex-1 min-w-[100px] group hover:bg-white/10 transition-all hover:translate-y-[-4px] cursor-default">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                    <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                  </div>
                  <span className="text-[9px] font-black tracking-tight text-white/30 uppercase whitespace-nowrap">{s.label}</span>
                </div>
                <div className="text-xl font-black italic tracking-tighter text-white group-hover:text-[#00e5a0] transition-colors">
                  {s.val}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Analytics Section */}
        <div className="flex flex-col gap-8 mb-16">
          {/* Chart Header - Stat Selection */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-white/20 tracking-[0.3em] uppercase px-2 italic">분석 지표 선택</h4>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {statOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedStat(opt.value)}
                  className={`group relative flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-300 ${
                    selectedStat === opt.value 
                      ? `bg-white/10 border-[${opt.color}]/50 shadow-[0_0_20px_${opt.color}20]` 
                      : `bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10`
                  }`}
                >
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    selectedStat === opt.value ? `bg-[${opt.color}]/20` : 'bg-white/5'
                  }`}>
                    <opt.icon className={`w-3.5 h-3.5 ${selectedStat === opt.value ? `text-white` : 'text-white/40'}`} style={{ color: selectedStat === opt.value ? opt.color : undefined }} />
                  </div>
                  <span className={`text-xs font-bold tracking-tight uppercase ${selectedStat === opt.value ? 'text-white' : 'text-white/40'}`}>
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Visualizer */}
            <div className="lg:col-span-12 bg-white/[0.03] border border-white/10 rounded-[40px] p-6 md:p-12 relative overflow-hidden backdrop-blur-3xl group">
              {/* Glossy Overlay */}
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter mb-1">
                      {statOptions.find(o => o.value === selectedStat)?.label} <span className="text-white/20">
                        {selectedStat === 'total' ? '커리어 통합 성장 분석' : '데이터 성장 분석'}
                      </span>
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: statOptions.find(o => o.value === selectedStat)?.color }}></div>
                      <p className="text-[10px] font-black text-white/30 tracking-widest uppercase italic">
                        {selectedStat === 'total' ? '올타임 히스토리 맵핑 활성화됨' : '데이터 기반 퍼포먼스 맵핑 활성화됨'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 w-full min-h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historyData} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={statOptions.find(o => o.value === selectedStat)?.color} stopOpacity={0.4}/>
                          <stop offset="95%" stopColor={statOptions.find(o => o.value === selectedStat)?.color} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="rgba(255,255,255,0.03)" />
                      <XAxis 
                        dataKey="year" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 11, fontWeight: 'bold' }}
                        dy={15}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 11, fontWeight: 'bold' }}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
                      <Area 
                        type="monotone" 
                        dataKey={selectedStat} 
                        name={statOptions.find(o => o.value === selectedStat)?.label}
                        stroke={statOptions.find(o => o.value === selectedStat)?.color} 
                        strokeWidth={5}
                        fillOpacity={1} 
                        fill="url(#colorCurrent)" 
                        animationDuration={2000}
                        animationEasing="ease-in-out"
                        dot={{ r: 6, fill: '#080808', stroke: statOptions.find(o => o.value === selectedStat)?.color, strokeWidth: 3 }}
                        activeDot={{ r: 10, fill: statOptions.find(o => o.value === selectedStat)?.color, stroke: '#fff', strokeWidth: 3 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seasonal Best Partners - Full Width */}
        <div className="mb-16">
          <div className="bg-white/[0.03] border border-white/10 rounded-[40px] p-8 md:p-10 backdrop-blur-2xl">
            <div className="flex items-center gap-3 mb-12">
              <div className="p-3 bg-white/5 rounded-2xl">
                <Users className="w-5 h-5 text-[#00b4ff]" />
              </div>
              <h3 className="text-2xl font-black italic tracking-tight uppercase">올시즌 <span className="text-[#00b4ff]">베스트 파트너</span></h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {bestPartners.map((partner, i) => (
                <div key={i} className="group flex items-center gap-5 p-5 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/[0.08] hover:border-white/10 transition-all cursor-default">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-[#080808] border border-white/10 flex items-center justify-center overflow-hidden">
                      <partner.icon className="w-6 h-6 text-white/10 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">{partner.label}</div>
                    <div className="text-sm font-black italic text-white group-hover:text-[#00e5a0] transition-colors mb-0.5">{partner.name}</div>
                    <div className="text-xs font-black italic tracking-tight" style={{ color: partner.color }}>{partner.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Awards Record - Full Width & Optimized Grid */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-[#111] to-[#080808] border border-white/10 rounded-[40px] p-8 md:p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ffd166]/5 blur-[150px] rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-1000"></div>
            
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#ffd166]/10 rounded-2xl border border-[#ffd166]/20">
                  <Trophy className="w-5 h-5 text-[#ffd166]" />
                </div>
                <h3 className="text-2xl font-black italic tracking-tight uppercase">수상 <span className="text-[#ffd166]">기록</span></h3>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentAwardPage(Math.max(0, currentAwardPage - 1))}
                  disabled={currentAwardPage === 0}
                  className="p-3 rounded-2xl bg-white/5 border border-white/5 disabled:opacity-20 hover:bg-white/10 hover:border-white/10 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="px-4 text-[10px] font-black italic text-white/40 tracking-widest uppercase">
                  Page {currentAwardPage + 1}
                </div>
                <button 
                  onClick={() => setCurrentAwardPage(currentAwardPage + 1)}
                  disabled={(currentAwardPage + 1) * 3 >= 6} 
                  className="p-3 rounded-2xl bg-white/5 border border-white/5 disabled:opacity-20 hover:bg-white/10 hover:border-white/10 rotate-180 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAwardPage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "circOut" }}
                  className="space-y-12"
                >
                  {[
                    { season: '2026', items: [{ title: '득점왕 1위', value: '28 Goals', type: 'Primary', emoji: '🥇' }, { title: 'MOM 랭킹 1위', value: '10 MOMs', type: 'Primary', emoji: '👑' }] },
                    { season: '2025', items: [{ title: '공격포인트 2위', value: '37 Points', type: 'Secondary', emoji: '🥈' }] },
                    { season: '2024', items: [{ title: '도움왕 3위', value: '15 Assists', type: 'Secondary', emoji: '🥉' }, { title: '최다 출장 2위', value: '30 Matches', type: 'Secondary', emoji: '🏃' }] },
                    { season: '2023', items: [{ title: '득점왕 1위', value: '18 Goals', type: 'Primary', emoji: '🥇' }] },
                    { season: '2022', items: [{ title: '도움왕 1위', value: '8 Assists', type: 'Primary', emoji: '🎯' }] },
                    { season: '2021', items: [{ title: '출석왕 1위', value: '20 Matches', type: 'Primary', emoji: '⭐' }] },
                  ].slice(currentAwardPage * 3, (currentAwardPage + 1) * 3).map((group, idx) => (
                    <div key={idx} className="space-y-5">
                      <div className="flex items-center gap-3 px-2">
                        <div className="w-2 h-2 rounded-full bg-[#ffd166] shadow-[0_0_10px_rgba(255,209,102,0.5)]"></div>
                        <span className="text-sm font-black italic text-white/50 tracking-[0.2em]">{group.season} SEASON</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {group.items.map((award, i) => (
                          <div key={i} className={`flex items-center justify-between p-6 rounded-3xl border transition-all ${
                            award.type === 'Primary' 
                              ? 'bg-gradient-to-r from-white/[0.08] to-transparent border-white/10 hover:border-[#ffd166]/40 group/item hover:bg-white/[0.1]' 
                              : 'bg-white/[0.03] border-white/5 hover:border-white/10 hover:bg-white/[0.05]'
                          }`}>
                            <div className="flex items-center gap-4">
                              <div className={`text-2xl font-bold flex items-center justify-center w-12 h-12 rounded-2xl ${
                                award.type === 'Primary' ? 'bg-[#ffd166]/10 text-[#ffd166]' : 'bg-white/5 text-white/40'
                              }`}>
                                {award.emoji}
                              </div>
                              <div>
                                <div className="text-xs font-black italic text-white/20 uppercase tracking-tighter mb-0.5">{award.type === 'Primary' ? 'Winner' : 'Record'}</div>
                                <div className="text-sm font-black italic tracking-tight">{award.title}</div>
                              </div>
                            </div>
                            <div className={`text-xl font-black italic tracking-tighter ${
                              award.type === 'Primary' ? 'text-[#ffd166] drop-shadow-[0_0_10px_rgba(255,209,102,0.3)]' : 'text-white/40'
                            }`}>
                              {award.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Seasonal Journey Table */}
        <div className="bg-white/[0.02] border border-white/10 rounded-[40px] overflow-hidden">
          <div className="p-10 border-b border-white/10 flex items-center justify-between bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/5 rounded-2xl">
                <History className="w-5 h-5 text-white/40" />
              </div>
              <h3 className="text-2xl font-black italic tracking-tight uppercase">시즌별 <span className="text-white/20">통합기록</span></h3>
            </div>
            <div className="text-[10px] font-black text-white/20 tracking-[0.3em] uppercase">All records verified</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.02] text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                  <th className="py-6 px-10">시즌</th>
                  <th className="py-6 px-6 text-center">출장</th>
                  <th className="py-6 px-6 text-center">득점</th>
                  <th className="py-6 px-6 text-center">도움</th>
                  <th className="py-6 px-6 text-center">클린시트</th>
                  <th className="py-6 px-6 text-center">승 / 무 / 패</th>
                  <th className="py-6 px-6 text-center">승점</th>
                  <th className="py-6 px-6 text-center">MOM 점수</th>
                  <th className="py-6 px-10 text-right">TOP 3</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[...historyData].reverse().map((r) => (
                  <tr key={r.year} className="group hover:bg-white/[0.03] transition-all">
                    <td className="py-8 px-10">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-8 rounded-full bg-[#00e5a0]/0 group-hover:bg-[#00e5a0] transition-all"></div>
                        <div className="text-2xl font-black italic tracking-tighter text-[#00e5a0] group-hover:translate-x-1 transition-transform">{r.year}</div>
                      </div>
                    </td>
                    <td className="py-8 px-6 text-center font-black italic text-white/40 group-hover:text-white transition-colors">{r.matches}</td>
                    <td className="py-8 px-6 text-center text-xl font-black italic group-hover:scale-110 transition-transform">{r.goals}</td>
                    <td className="py-8 px-6 text-center text-xl font-black italic group-hover:scale-110 transition-transform">{r.assists}</td>
                    <td className="py-8 px-6 text-center text-lg font-black italic text-[#8884d8] group-hover:animate-pulse">{r.cleanSheets}</td>
                    <td className="py-8 px-6 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-2 text-xs font-black italic">
                          <span className="text-[#00e5a0]">{r.win}W</span> 
                          <span className="text-white/20">/</span> 
                          <span>{r.draw}D</span> 
                          <span className="text-white/20">/</span> 
                          <span className="text-red-500">{r.lose}L</span>
                        </div>
                        <div className="text-[9px] font-black text-white/20">{r.winRate}% WIN RATE</div>
                      </div>
                    </td>
                    <td className="py-8 px-6 text-center">
                      <div className="inline-block px-3 py-1 rounded-lg bg-white/5 text-lg font-black italic tracking-tighter text-[#ffd166]">
                        {r.personalPoints}
                      </div>
                    </td>
                    <td className="py-8 px-6 text-center font-black italic tracking-tighter text-white/60">{r.momScore}</td>
                    <td className="py-8 px-10 text-right">
                      <div className="inline-flex items-center gap-2 text-2xl font-black italic tracking-tighter group-hover:text-[#ffd166] transition-colors">
                        {r.momTop3Count}
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-2 group-hover:text-[#ffd166]/40 transition-colors">Awards</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

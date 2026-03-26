"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trophy, Users, BarChart2, History, Target, Star, Activity, Award, TrendingUp, Calendar, Zap, ShieldCheck } from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell 
} from 'recharts';
import { motion, AnimatePresence } from "framer-motion";
import { useBestElevenQuery } from "@/components/team-management/hooks/useBestElevenQuery";
import { Suspense } from "react";
import { getValidImageSrc } from "@/lib/utils";

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
  return (
    <Suspense fallback={
      <div className="min-h-dvh bg-[#080808] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00e5a0]"></div>
      </div>
    }>
      <PlayerHistoryContent />
    </Suspense>
  );
}

function PlayerHistoryContent() {
  const params = useParams();
  const router = useRouter();
  
  // URL 인코딩 이슈 해결을 위해 명시적으로 디코딩 (이중 인코딩 대응)
  const playerNameRaw = params.name as string;
  const getDecodedName = (name: string) => {
    try {
      let decoded = decodeURIComponent(name);
      // 혹시 모르니 한 번 더 디코딩 시도 (이중 인코딩 방어)
      if (decoded.includes('%')) {
        decoded = decodeURIComponent(decoded);
      }
      return decoded;
    } catch (e) {
      return name;
    }
  };
  const playerName = getDecodedName(playerNameRaw);

  // 실제 데이터 연동 (임시로 teamId 1 사용, 실제로는 URL이나 세션에서 가져와야 함)
  const queryData = useBestElevenQuery(1);
  const playerMember = queryData.findManyTeamMember?.members?.find(
    (m: any) => {
      const mName = m.user?.name || "";
      return mName === playerName || getDecodedName(mName) === playerName;
    }
  );
  const stats = playerMember?.overall;
  const isDebutExpected = !stats || stats.appearances === 0;

  const [loading, setLoading] = useState(true);
  const [selectedStat, setSelectedStat] = useState('goals');
  const [activeTab, setActiveTab] = useState('contribution');
  const [currentAwardPage, setCurrentAwardPage] = useState(0);

  // 데이터 가공 (API 데이터 + 부족한 부분은 모킹 유지)
  const historyData = [
    { 
      year: '2026', 
      ovr: stats?.ovr || 0, 
      goals: stats?.goals || 0, 
      assists: stats?.assists || 0, 
      attackPoints: stats?.attackPoints || 0, 
      cleanSheets: stats?.cleanSheets || 0, 
      matches: stats?.appearances || 0, 
      winRate: stats?.winRate || 0, 
      momTop3Count: (stats?.mom3 || 0) + (stats?.mom8 || 0),
      win: 0, draw: 0, lose: 0, momScore: 0, personalPoints: 0 
    },
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

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return null;

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
                {isDebutExpected ? "NEW PLAYER" : "Verified Statistics"}
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
              { label: "통산 출장수", val: stats?.appearances || 0, icon: Calendar, color: "#ff6b6b" },
              { label: "통산 득점", val: stats?.goals || 0, icon: Target, color: "#ffd166" },
              { label: "통산 도움", val: stats?.assists || 0, icon: Zap, color: "#00b4ff" },
              { label: "통산 공격포인트", val: stats?.attackPoints || 0, icon: Activity, color: "#ff9f1c" },
              { label: "통산 클린시트", val: stats?.cleanSheets || 0, icon: ShieldCheck, color: "#4cc9f0" },
              { label: "통산 개인승점", val: (stats as any)?.personalPoints || 0, icon: TrendingUp, color: "#a855f7" },
              { label: "통산 승률", val: `${stats?.winRate || 0}%`, icon: TrendingUp, color: "#4cc9f0" },
              { label: "MOM TOP 3", val: (stats?.mom3 || 0) + (stats?.mom8 || 0), icon: Trophy, color: "#f72585" },
              { label: "현재 OVR", val: stats?.ovr || 0, icon: Star, color: "#00e5a0" },
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
                      ? `bg-white/10 border-[#00e5a0]/50 shadow-[0_0_20px_#00e5a020]` 
                      : `bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10`
                  }`}
                >
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    selectedStat === opt.value ? `bg-[#00e5a0]/20` : 'bg-white/5'
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
                        데이터 성장 분석
                      </span>
                    </h3>
                    {isDebutExpected && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                        <p className="text-[10px] font-black text-amber-500/60 tracking-widest uppercase italic">
                          분석을 위한 데이터가 부족합니다 (데뷔 기록 없음)
                        </p>
                      </div>
                    )}
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
            
            <div className="flex flex-col items-center justify-center py-10 border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
                <Users className="w-10 h-10 text-white/10 mb-4" />
                <p className="text-white/40 font-bold italic tracking-tight">올시즌 베스트 파트너를 만들어보세요</p>
            </div>
          </div>
        </div>

        {/* Awards Record - Restored & Fallback Message Added */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-[#111] to-[#080808] border border-white/10 rounded-[40px] p-8 md:p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ffd166]/5 blur-[150px] rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-1000"></div>
            
            <div className="flex items-center gap-3 mb-12">
              <div className="p-3 bg-[#ffd166]/10 rounded-2xl border border-[#ffd166]/20">
                <Trophy className="w-5 h-5 text-[#ffd166]" />
              </div>
              <h3 className="text-2xl font-black italic tracking-tight uppercase">수상 <span className="text-[#ffd166]">기록</span></h3>
            </div>

            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/5 rounded-3xl bg-white/[0.01] relative z-10">
              <div className="w-16 h-16 rounded-full bg-[#ffd166]/5 flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-[#ffd166]/20" />
              </div>
              <p className="text-xl font-black italic tracking-tighter text-white/40 mb-2 underline decoration-[#ffd166]/20 underline-offset-8">2026년 수상을 해보아요</p>
              <p className="text-[10px] font-bold text-white/10 tracking-[0.2em] uppercase">No award history detected for this season</p>
            </div>
          </div>
        </div>

        {/* Seasonal Journey Table */}
        <div className="bg-white/[0.02] border border-white/10 rounded-[40px] overflow-hidden mb-16">
          <div className="p-10 border-b border-white/10 flex items-center justify-between bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/5 rounded-2xl">
                <History className="w-5 h-5 text-white/40" />
              </div>
              <h3 className="text-2xl font-black italic tracking-tight uppercase">시즌별 <span className="text-white/20">통합기록</span></h3>
            </div>
          </div>
            <div className="">
              <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="bg-white/[0.02] text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                  <th className="py-6 px-10">시즌</th>
                  <th className="py-6 px-6 text-center">출장</th>
                  <th className="py-6 px-6 text-center">득점</th>
                  <th className="py-6 px-6 text-center">도움</th>
                  <th className="py-6 px-6 text-center">클린시트</th>
                  <th className="py-6 px-6 text-center">승률</th>
                  <th className="py-6 px-10 text-right">TOP 3</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {historyData.map((r) => (
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
                    <td className="py-8 px-6 text-center text-lg font-black italic text-[#4cc9f0]">{r.cleanSheets}</td>
                    <td className="py-8 px-6 text-center font-black italic text-white/60">{r.winRate}%</td>
                    <td className="py-8 px-10 text-right font-black italic text-2xl tracking-tighter text-[#ffd166]">{r.momTop3Count}</td>
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

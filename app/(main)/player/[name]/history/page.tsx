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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return (
    <div className="min-h-dvh bg-[#080808] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00e5a0]"></div>
    </div>
  );

  return <PlayerHistoryDataView />;
}

function PlayerHistoryDataView() {
  const params = useParams();
  const router = useRouter();
  
  // URL 인코딩 이슈 해결을 위해 명시적으로 디코딩 (이중 인코딩 대응)
  const playerNameRaw = params.name as string;
  const getDecodedName = (name: string) => {
    try {
      let decoded = decodeURIComponent(name);
      if (decoded.includes('%')) {
        decoded = decodeURIComponent(decoded);
      }
      return decoded;
    } catch (e) {
      return name;
    }
  };
  const playerName = getDecodedName(playerNameRaw);

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
  const [showOpening, setShowOpening] = useState(false);
  const [skipOpening, setSkipOpening] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [selectedStat, setSelectedStat] = useState('goals');
  const [activeTab, setActiveTab] = useState('contribution');
  const [currentAwardPage, setCurrentAwardPage] = useState(0);

  // 데이터 가공
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
    // 사용자가 '앞으로 안보기'를 눌렀어도 테스트 중에는 나오게 하거나, 명시적으로 확인 가능하도록 함
    const savedSkip = localStorage.getItem('skipHistoryOpening') === 'true';
    setSkipOpening(savedSkip);
    
    // 강제로 오프닝을 보여주기 위해 showOpening(true) 호출 (사용자 확인용)
    setShowOpening(true);
    
    // 카운트다운 타이머
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // 실제 운영시에는 skip여부에 따라 닫아야 하지만, 지금은 10초 노출 후 닫음
          setShowOpening(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadTimer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(loadTimer);
  }, []);

  const handleOpeningComplete = () => {
    setShowOpening(false);
  };

  const handleSkipToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSkipOpening(checked);
    localStorage.setItem('skipHistoryOpening', checked ? 'true' : 'false');
  };

  if (loading) return (
    <div className="min-h-dvh bg-[#080808] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00e5a0]"></div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-[#080808] text-white font-['Noto_Sans_KR'] selection:bg-[#00e5a0]/30 selection:text-[#00e5a0]">
      <AnimatePresence>
        {showOpening && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-100 bg-[#080808] flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Cinematic Background */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00e5a0]/10 blur-[150px] rounded-full animate-pulse"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-12">
              {/* Player Card Frame */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ 
                  duration: 1.2, 
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.2
                }}
                className="relative w-72 h-[420px] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl group/card"
              >
                {/* Real Card Background */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src="/images/card-bgs/normal-blue.webp" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110"
                    alt="Card Background"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover/card:bg-black/0 transition-colors duration-500"></div>
                </div>

                {/* Glossy Overlay */}
                <div className="absolute inset-0 bg-linear-to-tr from-white/10 via-transparent to-white/20 z-20 pointer-events-none"></div>
                
                {/* Player Photo */}
                <div className="absolute inset-0 z-10 p-2 flex items-end justify-center">
                  <div className="relative w-full h-[85%] overflow-hidden">
                    <img 
                      src={getValidImageSrc(playerMember?.user?.profileImage)} 
                      alt={playerName}
                      className="w-full h-full object-contain object-bottom transition-all duration-700 group-hover/card:scale-105 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    />
                  </div>
                </div>

                {/* Card Info Overlay */}
                <div className="absolute bottom-10 left-0 w-full z-30 px-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                  >
                    <div className="text-[10px] font-black text-[#00e5a0] tracking-[0.4em] uppercase mb-1 drop-shadow-lg">Elite Class</div>
                    <div className="text-3xl font-black italic tracking-tighter uppercase leading-none text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">{playerName}</div>
                  </motion.div>
                </div>

                {/* OVR & Number Badge */}
                <div className="absolute top-8 left-8 z-30 flex flex-col items-start gap-1">
                  <motion.div 
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", delay: 1.2 }}
                    className="text-6xl font-black italic tracking-tighter text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] leading-none"
                  >
                    {stats?.ovr || '--'}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 0.8, x: 0 }}
                    transition={{ delay: 1.5 }}
                    className="text-2xl font-black text-white italic drop-shadow-md flex items-center gap-1"
                  >
                    <span className="text-[10px] uppercase font-black opacity-40 not-italic">NO.</span>
                    {playerMember?.backNumber || '--'}
                  </motion.div>
                </div>
              </motion.div>

              {/* History Text */}
              {/* History Text */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-2">
                  {"HISTORY".split("").map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: 0.8 + (i * 0.1),
                        ease: "easeOut" 
                      }}
                      className="text-6xl md:text-8xl font-black italic tracking-tighter text-[#00e5a0] drop-shadow-[0_0_30px_rgba(0,229,160,0.3)]"
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2, duration: 1 }}
                  className="hidden md:block px-6 py-2 rounded-full border border-white/10 bg-white/5 text-[10px] font-black tracking-[0.5em] text-white/40 uppercase"
                >
                  Season 2026 Archive
                </motion.div>
              </div>

              {/* Enter Button with Countdown */}
              <div className="flex flex-col items-center gap-6">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.5 }}
                  onClick={handleOpeningComplete}
                  className="group relative px-10 py-4 bg-white text-black font-black italic rounded-full overflow-hidden hover:scale-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center gap-4"
                >
                  <span className="relative z-10">ENTER HISTORY</span>
                  <span className="relative z-10 w-6 h-6 rounded-full bg-black text-white text-[10px] flex items-center justify-center not-italic group-hover:bg-[#00e5a0] group-hover:text-black transition-colors">
                    {countdown}
                  </span>
                  <div className="absolute inset-0 bg-[#00e5a0] -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                </motion.button>

                {/* Skip Option (Below Button on Mobile, Bottom Right for Desktop) */}
                <div className="md:fixed md:bottom-10 md:right-16 z-110 flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5 whitespace-nowrap">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative w-6 h-6 rounded-lg border-2 border-white/10 bg-white/5 flex items-center justify-center group-hover:border-[#00e5a0]/50 transition-all overflow-hidden shadow-inner">
                      <input 
                        type="checkbox" 
                        checked={skipOpening}
                        onChange={handleSkipToggle}
                        className="peer absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-3 h-3 bg-[#00e5a0] scale-0 peer-checked:scale-100 transition-all duration-300 rounded-md shadow-[0_0_10px_#00e5a0]"></div>
                    </div>
                    <span className="text-[11px] font-black text-white/40 group-hover:text-[#00e5a0] transition-colors tracking-widest uppercase italic">오프닝 앞으로 안보기</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-16 overflow-x-hidden">
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
          <div className="bg-white/3 border border-white/10 rounded-[40px] p-8 md:p-10 backdrop-blur-2xl">
            <div className="flex items-center gap-3 mb-12">
              <div className="p-3 bg-white/5 rounded-2xl">
                <Users className="w-5 h-5 text-[#00b4ff]" />
              </div>
              <h3 className="text-2xl font-black italic tracking-tight uppercase">올시즌 <span className="text-[#00b4ff]">베스트 파트너</span></h3>
            </div>
            
            <div className="flex flex-col items-center justify-center py-10 border border-dashed border-white/10 rounded-3xl bg-white/1">
                <Users className="w-10 h-10 text-white/10 mb-4" />
                <p className="text-white/40 font-bold italic tracking-tight">올시즌 베스트 파트너를 만들어보세요</p>
            </div>
          </div>
        </div>

        {/* Awards Record - Restored & Fallback Message Added */}
        <div className="mb-16">
          <div className="bg-linear-to-br from-[#111] to-[#080808] border border-white/10 rounded-[40px] p-8 md:p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ffd166]/5 blur-[150px] rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-1000"></div>
                        <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#00e5a0]/20 to-transparent flex items-center justify-center mb-1">
                    <Trophy className="w-5 h-5 text-[#00e5a0]" />
                  </div>
              <h3 className="text-2xl font-black italic tracking-tight uppercase">수상 <span className="text-[#ffd166]">기록</span></h3>
            </div>

            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/5 rounded-3xl bg-white/1 relative z-10">
              <div className="w-16 h-16 rounded-full bg-[#ffd166]/5 flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-[#ffd166]/20" />
              </div>
              <p className="text-xl font-black italic tracking-tighter text-white/40 mb-2 underline decoration-[#ffd166]/20 underline-offset-8">2026년 수상을 해보아요</p>
              <p className="text-[10px] font-bold text-white/10 tracking-[0.2em] uppercase">No award history detected for this season</p>
            </div>
          </div>
        </div>

        {/* Seasonal Journey Table */}
        <div className="bg-white/2 border border-white/10 rounded-[40px] overflow-hidden mb-16">
          <div className="p-10 border-b border-white/10 flex items-center justify-between bg-white/1">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/5 rounded-2xl">
                <History className="w-5 h-5 text-white/40" />
              </div>
              <h3 className="text-2xl font-black italic tracking-tight uppercase">시즌별 <span className="text-white/20">통합기록</span></h3>
            </div>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="bg-white/[0.02] text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                  <th className="sticky left-0 bg-[#080808] z-20 py-4 px-6 border-b border-white/5 whitespace-nowrap">시즌</th>
                  <th className="py-4 px-4 text-center border-b border-white/5">출장</th>
                  <th className="py-4 px-4 text-center border-b border-white/5">득점</th>
                  <th className="py-4 px-4 text-center border-b border-white/5">도움</th>
                  <th className="py-4 px-4 text-center border-b border-white/5">클린시트</th>
                  <th className="py-4 px-4 text-center border-b border-white/5">승률</th>
                  <th className="py-4 px-6 text-right border-b border-white/5">TOP 3</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {historyData.map((r) => (
                  <tr key={r.year} className="group hover:bg-white/[0.03] transition-all">
                    <td className="sticky left-0 bg-[#080808] z-20 py-5 px-6 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-5 rounded-full bg-[#00e5a0]/0 group-hover:bg-[#00e5a0] transition-all"></div>
                        <div className="text-xl font-black italic tracking-tighter text-[#00e5a0] group-hover:translate-x-1 transition-transform">{r.year}</div>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-center font-black italic text-white/40 group-hover:text-white transition-colors border-b border-white/5 text-xs">{r.matches}</td>
                    <td className="py-5 px-4 text-center text-lg font-black italic group-hover:scale-110 transition-transform border-b border-white/5">{r.goals}</td>
                    <td className="py-5 px-4 text-center text-lg font-black italic group-hover:scale-110 transition-transform border-b border-white/5">{r.assists}</td>
                    <td className="py-5 px-4 text-center text-base font-black italic text-[#4cc9f0] border-b border-white/5">{r.cleanSheets}</td>
                    <td className="py-5 px-4 text-center font-black italic text-white/60 border-b border-white/5 text-xs">{r.winRate}%</td>
                    <td className="py-5 px-6 text-right font-black italic text-xl tracking-tighter text-[#ffd166] border-b border-white/5">{r.momTop3Count}</td>
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

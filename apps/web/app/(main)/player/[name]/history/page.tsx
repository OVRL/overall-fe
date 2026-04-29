"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Trophy, Users, BarChart2, History, Target, Star, Activity, Award, TrendingUp, Calendar, Zap, ShieldCheck } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import AttackContributionLineChart, {
  LineChartTooltipContent,
} from "@/components/charts/AttackContributionLineChart";
import { motion, AnimatePresence } from "motion/react";
import { useBestElevenQuery } from "@/components/team-management/hooks/useBestElevenQuery";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import { Suspense } from "react";
import { getValidImageSrc } from "@/lib/utils";

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
  const searchParams = useSearchParams();
  const imgUrlParam = searchParams.get("imgUrl");
  const backNumberParam = searchParams.get("backNumber");

  const { selectedTeamIdNum } = useSelectedTeamId();
  const queryData = useBestElevenQuery(selectedTeamIdNum ?? 1);
  const playerMember = queryData.findManyTeamMember?.members?.find(
    (m: any) => {
      const mName = m.user?.name || "";
      return mName === playerName || getDecodedName(mName) === playerName;
    }
  );
  const stats = playerMember?.overall;
  const isDebutExpected = !stats || stats.appearances === 0;
  const getPartnerAvatarUrl = (partnerName: string) => {
    if (!partnerName || partnerName === '기록 없음') return '/icons/logo_OVR.svg';
    const member = queryData?.findManyTeamMember?.members?.find((m: any) => m.user?.name === partnerName);
    return member?.user?.profileImage ? getValidImageSrc(member.user.profileImage) : '/icons/logo_OVR.svg';
  };

  const [loading, setLoading] = useState(true);
  const [showOpening, setShowOpening] = useState(false);
  const [skipOpening, setSkipOpening] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [selectedStat, setSelectedStat] = useState('goals');
  const [activeTab, setActiveTab] = useState('contribution');
  const [currentAwardPage, setCurrentAwardPage] = useState(0);
  const [showGraphs, setShowGraphs] = useState(false);
  
  const toggleGraphs = () => setShowGraphs(!showGraphs);
  const getMaxValue = (statKey: string) => {
    const max = Math.max(...historyData.map(item => Number(item[statKey as keyof typeof item]) || 0));
    return max === 0 ? 10 : Math.ceil(max * 1.2);
  };

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
          setIsExiting(true);
          setTimeout(() => setShowOpening(false), 1000);
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
    setIsExiting(true);
    setTimeout(() => setShowOpening(false), 1000);
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
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden"
          >
            {/* landing_bg.webp 배경 */}
            <div className="absolute inset-0 z-0">
              <img
                src="/images/landing_bg.webp"
                alt=""
                className="w-full h-full object-cover object-center scale-105"
                style={{ filter: "brightness(0.35) saturate(1.2)" }}
              />
            </div>

            {/* 중앙 스포트라이트 빔 */}
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              style={{ transformOrigin: "top center" }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-full z-0 pointer-events-none"
            >
              <div className="w-full h-full bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(0,229,160,0.13)_0%,transparent_70%)]" />
            </motion.div>

            {/* 좌우 광선 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 0.6 }}
              className="absolute inset-0 z-0 pointer-events-none"
            >
              <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-[#00e5a0]/20 via-transparent to-transparent rotate-12 origin-top" />
              <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-[#00e5a0]/15 via-transparent to-transparent -rotate-12 origin-top" />
              <div className="absolute top-0 left-[38%] w-px h-full bg-gradient-to-b from-white/10 via-transparent to-transparent rotate-6 origin-top" />
              <div className="absolute top-0 right-[38%] w-px h-full bg-gradient-to-b from-white/8 via-transparent to-transparent -rotate-6 origin-top" />
            </motion.div>

            {/* 하단 그라데이션 */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/80 to-transparent z-0 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center gap-8 md:gap-10">

              {/* HISTORY 텍스트 - 카드 위로 이동 */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-1 md:gap-2">
                  {"HISTORY".split("").map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: -40, rotateX: 90 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{
                        duration: 0.7,
                        delay: 0.3 + (i * 0.08),
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      className="text-5xl md:text-7xl font-black italic tracking-tighter text-white drop-shadow-[0_0_40px_rgba(0,229,160,0.5)]"
                      style={{ textShadow: "0 0 60px rgba(0,229,160,0.4), 0 2px 20px rgba(0,0,0,0.8)" }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 1.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="px-5 py-1.5 rounded-full border border-[#00e5a0]/30 bg-[#00e5a0]/5 text-[9px] font-black tracking-[0.5em] text-[#00e5a0]/70 uppercase"
                >
                  Season 2026 Archive
                </motion.div>
              </div>

              {/* Player Card */}
              <motion.div
                initial={{ scale: 0.6, opacity: 0, y: 80, rotateY: -25 }}
                animate={isExiting
                  ? { scale: 0.05, opacity: 0, rotateY: 720, rotateZ: 360, y: 200, filter: "blur(20px)" }
                  : { scale: 1, opacity: 1, y: 0, rotateY: 0, filter: "blur(0px)" }
                }
                transition={isExiting
                  ? { duration: 0.9, ease: [0.55, 0, 1, 0.45] }
                  : { duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.5 }
                }
                className="relative"
                style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
              >
                {/* 카드 후광 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isExiting
                    ? { opacity: 0, scale: 0 }
                    : { opacity: [0, 0.6, 0.3], scale: [0.8, 1.1, 1] }
                  }
                  transition={{ duration: isExiting ? 0.4 : 2, delay: isExiting ? 0 : 1.2, times: isExiting ? undefined : [0, 0.5, 1] }}
                  className="absolute -inset-6 rounded-[48px] bg-[#00e5a0]/15 blur-2xl pointer-events-none"
                />
                <motion.div
                  animate={isExiting ? {} : { boxShadow: ["0 0 40px rgba(0,229,160,0.2)", "0 0 80px rgba(0,229,160,0.35)", "0 0 40px rgba(0,229,160,0.2)"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  className="relative w-64 md:w-72 h-[380px] md:h-[420px] rounded-[32px] overflow-hidden border border-white/15 group/card"
                >
                  {/* 카드 배경 */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src="/images/card-bgs/normal-blue.webp"
                      className="w-full h-full object-cover"
                      alt="Card Background"
                    />
                  </div>

                  {/* Glossy Overlay */}
                  <div className="absolute inset-0 bg-linear-to-tr from-white/5 via-transparent to-white/15 z-20 pointer-events-none" />

                  {/* 선수 사진 - URL param 우선, 없으면 Relay 데이터 */}
                  <div className="absolute inset-0 z-10 flex items-end justify-center">
                    <div className="relative w-full h-[90%] overflow-hidden">
                      <img
                        src={imgUrlParam ? decodeURIComponent(imgUrlParam) : getValidImageSrc(playerMember?.user?.profileImage)}
                        alt={playerName}
                        className="w-full h-full object-contain object-bottom drop-shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
                      />
                    </div>
                  </div>

                  {/* 등번호 - 왼쪽 상단만, URL param 우선 */}
                  <div className="absolute top-5 left-5 z-30">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col items-start leading-none"
                    >
                      <span className="text-[9px] uppercase font-black text-white/50 tracking-widest">NO.</span>
                      <span className="text-5xl font-black italic tracking-tighter text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]">
                        {backNumberParam ?? (playerMember?.preferredNumber != null ? String(playerMember.preferredNumber) : '-')}
                      </span>
                    </motion.div>
                  </div>

                  {/* 카드 반짝임 sweep */}
                  <motion.div
                    initial={{ x: "-100%", skewX: "-20deg" }}
                    animate={{ x: "200%" }}
                    transition={{ duration: 0.8, delay: 1.8, ease: "easeInOut" }}
                    className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent z-40 pointer-events-none"
                  />
                </motion.div>
              </motion.div>

              {/* Enter Button */}
              <div className="flex flex-col items-center gap-5">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.2, duration: 0.6 }}
                  onClick={handleOpeningComplete}
                  className="group relative px-10 py-4 bg-white text-black font-black italic rounded-full overflow-hidden hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.25)] flex items-center gap-4"
                >
                  <span className="relative z-10">ENTER HISTORY</span>
                  <span className="relative z-10 w-6 h-6 rounded-full bg-black text-white text-[10px] flex items-center justify-center not-italic group-hover:bg-[#00e5a0] group-hover:text-black transition-colors">
                    {countdown}
                  </span>
                  <div className="absolute inset-0 bg-[#00e5a0] -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                </motion.button>

                <div className="md:fixed md:bottom-10 md:right-16 z-110 flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5 whitespace-nowrap">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative w-6 h-6 rounded-lg border-2 border-white/10 bg-white/5 flex items-center justify-center group-hover:border-[#00e5a0]/50 transition-all overflow-hidden shadow-inner">
                      <input
                        type="checkbox"
                        checked={skipOpening}
                        onChange={handleSkipToggle}
                        className="peer absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-3 h-3 bg-[#00e5a0] scale-0 peer-checked:scale-100 transition-all duration-300 rounded-md shadow-[0_0_10px_#00e5a0]" />
                    </div>
                    <span className="text-[11px] font-black text-white/40 group-hover:text-[#00e5a0] transition-colors tracking-widest uppercase italic">오프닝 앞으로 안보기</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    <div className="relative z-10 w-full min-h-[calc(100vh-env(safe-area-inset-top))] pt-[env(safe-area-inset-top)] bg-bg-basic dark:bg-background pb-20">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-6 md:py-16 flex flex-col gap-8 md:gap-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8 border-b border-Label-Tertiary/10 pb-5 md:pb-6">
          <div className="flex flex-col gap-2.5 md:gap-3">
            <div className="flex items-center gap-3 md:gap-4">
               <button 
                onClick={() => router.back()}
                className="group flex flex-shrink-0 items-center justify-center w-9 md:w-10 h-9 md:h-10 bg-white dark:bg-surface-secondary border border-Label-Tertiary/10 rounded-xl hover:bg-gray-50 dark:hover:bg-surface-elevated transition-all shadow-sm dark:shadow-none cursor-pointer"
               >
                 <ArrowLeft className="w-4.5 md:w-5 h-4.5 md:h-5 text-Label-Primary group-hover:-translate-x-0.5 transition-transform" />
               </button>
               <h1 className="text-2xl md:text-3xl font-extrabold text-Label-Primary tracking-tight uppercase m-0 leading-none">{playerName}</h1>
            </div>
            <p className="text-[14px] md:text-[16px] font-semibold text-Label-Tertiary m-0">시즌별 성과 및 성장 추이를 한눈에 확인하세요</p>
          </div>
        </header>

        {/* Section: 올타임 통합 기록 (통산) */}
        <section className="flex flex-col gap-3 md:gap-4 animate-in fade-in duration-500">
          <div className="flex items-center gap-2 mb-1.5 md:mb-2">
             <Target className="w-5 md:w-6 h-5 md:h-6 text-blue-500" />
             <h3 className="text-[18px] md:text-xl font-bold text-Label-Primary m-0">올타임 통합 기록 (통산)</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4">
            {[
              { label: "통산 출장수", val: `${stats?.appearances || 0}경기` },
              { label: "통산 득점", val: `${stats?.goals || 0}골` },
              { label: "통산 도움", val: `${stats?.assists || 0}도움` },
              { label: "통산 공격포인트", val: `${stats?.attackPoints || 0}포인트` },
              { label: "통산 클린시트", val: `${stats?.cleanSheets || 0}회` },
              { label: "MOM", val: `${(stats?.mom3 || 0) + (stats?.mom8 || 0)}회` },
            ].map((s, i) => (
              <div key={i} className="bg-white dark:bg-surface-secondary rounded-2xl p-4 md:p-5 flex flex-col gap-1 md:gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.03)] dark:shadow-none border border-Label-Tertiary/10 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)]">
                <span className="text-[12px] md:text-[13px] font-semibold tracking-tight text-Label-Tertiary">{s.label}</span>
                <span className="text-[18px] md:text-[22px] font-black tracking-tight text-Label-Primary leading-tight">{s.val}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section: 시즌별 통합 기록 */}
        <section className="flex flex-col gap-3 md:gap-4 animate-in fade-in duration-500 delay-100">
          <div className="flex items-center gap-2 mb-1.5 md:mb-2">
             <History className="w-5 md:w-6 h-5 md:h-6 text-blue-500" />
             <h3 className="text-[18px] md:text-xl font-bold text-Label-Primary m-0">시즌별 통합 기록</h3>
          </div>

          <div className="bg-white dark:bg-surface-secondary border border-Label-Tertiary/10 rounded-3xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.04)] dark:shadow-none p-4 md:p-6 mx-[-16px] sm:mx-0">
             <div className="overflow-x-auto w-full scrollbar-hide">
               <table className="w-full text-left min-w-[800px] border-collapse">
                 <thead>
                   <tr>
                     {["연도", "득점", "도움", "클린시트", "출장", "승/무/패", "승률", "개인승점", "MOM"].map((h, i) => (
                       <th key={h} className={`py-3 md:py-4 px-3 text-center text-[12px] md:text-sm font-bold text-Label-Tertiary uppercase border-b border-Label-Tertiary/10 bg-gray-50/50 dark:bg-surface-secondary/50 whitespace-nowrap ${i === 0 ? 'text-left pl-4 md:pl-5 sticky left-0 z-20 bg-white dark:bg-background border-r border-Label-Tertiary/10 dark:border-transparent drop-shadow-[2px_0_4px_rgba(0,0,0,0.02)]' : ''} ${i === 8 ? 'pr-4 md:pr-5' : ''}`}>
                         {h}
                       </th>
                     ))}
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-Label-Tertiary/5">
                   {historyData.map((r, idx) => (
                     <tr key={r.year} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                       <td className="py-4 md:py-5 px-3 pl-4 md:pl-5 font-black tracking-tight text-[14px] md:text-[15px] whitespace-nowrap sticky left-0 z-10 bg-white dark:bg-background border-r border-Label-Tertiary/10 dark:border-transparent drop-shadow-[2px_0_4px_rgba(0,0,0,0.02)]">
                         <span className={idx === 0 ? "text-blue-500" : "text-Label-Primary"}>{r.year} {idx === 0 && '(현재)'}</span>
                       </td>
                       <td className="py-4 md:py-5 px-3 text-center font-bold tracking-tight text-[14px] md:text-[15px] text-Label-Primary">{r.goals}</td>
                       <td className="py-4 md:py-5 px-3 text-center font-bold tracking-tight text-[14px] md:text-[15px] text-Label-Primary">{r.assists}</td>
                       <td className="py-4 md:py-5 px-3 text-center font-bold tracking-tight text-[14px] md:text-[15px] text-Label-Primary">{r.cleanSheets}</td>
                       <td className="py-4 md:py-5 px-3 text-center font-bold tracking-tight text-[14px] md:text-[15px] text-Label-Primary">{r.matches}</td>
                       <td className="py-4 md:py-5 px-3 text-center font-bold tracking-tight text-[13px] md:text-[15px]">
                         <span className="text-blue-500">{r.win}</span><span className="text-Label-Tertiary mx-0.5">/</span>
                         <span className="text-Label-Tertiary">{r.draw}</span><span className="text-Label-Tertiary mx-0.5">/</span>
                         <span className="text-[#f04452]">{r.lose}</span>
                       </td>
                       <td className="py-4 md:py-5 px-3 text-center font-bold tracking-tight text-[14px] md:text-[15px] text-Label-Primary">{r.winRate}%</td>
                       <td className="py-4 md:py-5 px-3 text-center font-bold tracking-tight text-[14px] md:text-[15px] text-Label-Primary">{r.personalPoints}</td>
                       <td className="py-4 md:py-5 px-3 text-center font-bold tracking-tight text-[14px] md:text-[15px] pr-4 md:pr-5 text-Label-Primary">{r.momTop3Count + (stats?.mom8 || 0)}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </section>

        {/* Section: 종합 공격 기여도 & 성장 추이 */}
        <section className="flex flex-col gap-3 md:gap-4 animate-in fade-in duration-500 delay-200">
           <div className="flex items-center gap-2 mb-1.5 md:mb-2">
             <Activity className="w-5 md:w-6 h-5 md:h-6 text-blue-500" />
             <h3 className="text-[18px] md:text-xl font-bold text-Label-Primary m-0">종합 공격 기여도</h3>
           </div>
           
           <div className="bg-white dark:bg-surface-secondary border border-Label-Tertiary/10 rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.04)] dark:shadow-none p-4 md:p-8">
             <AttackContributionLineChart data={historyData} />
           </div>
        </section>

        {/* Section: 상세 분석 (Button Toggle) */}
        <section className="flex flex-col gap-3 md:gap-4 animate-in fade-in duration-500 delay-300">
           <button 
              onClick={toggleGraphs}
              className="w-full flex items-center justify-center gap-2.5 md:gap-3 px-4 py-3 md:py-4 rounded-2xl bg-white dark:bg-surface-secondary border border-Label-Tertiary/10 text-Label-Primary text-[15px] md:text-[16px] font-bold tracking-tight transition-all hover:bg-gray-50 dark:hover:bg-surface-elevated hover:-translate-y-0.5 shadow-sm dark:shadow-none cursor-pointer"
           >
              {showGraphs ? <BarChart2 size={18} className="md:w-5 md:h-5" /> : <Activity size={18} className="md:w-5 md:h-5" />}
              {showGraphs ? '분석 차트 닫기' : '성장 추이 상세 분석하기'}
           </button>

           {showGraphs && (
             <div className="flex flex-col gap-4 md:gap-6 animate-in slide-in-from-top-4 duration-500">
                <div className="bg-white dark:bg-surface-secondary border border-Label-Tertiary/10 rounded-3xl p-5 md:p-8 flex flex-col gap-5 shadow-[0_8px_24px_rgba(0,0,0,0.04)] dark:shadow-none mt-2">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h3 className="text-[17px] md:text-[20px] font-bold tracking-tight text-Label-Primary m-0">지표별 성장 추이</h3>
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                      {[
                        { value: 'goals', label: '득점', color: '#ff6b6b' },
                        { value: 'assists', label: '어시스트', color: '#51cf66' },
                        { value: 'attackPoints', label: '공격포인트', color: '#fcc419' },
                        { value: 'cleanSheets', label: '클린시트', color: '#00e5a0' },
                        { value: 'matches', label: '출장수', color: '#3182f6' },
                        { value: 'personalPoints', label: '개인승점', color: '#a855f7' },
                        { value: 'winRate', label: '승률', color: '#4cc9f0' },
                        { value: 'ovr', label: '오버롤', color: '#ff9f1c' },
                        { value: 'momTop3Count', label: 'MOM', color: '#f72585' },
                      ].map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setSelectedStat(opt.value)}
                          style={{
                            backgroundColor: selectedStat === opt.value ? opt.color : 'transparent',
                            borderColor: selectedStat === opt.value ? opt.color : 'rgba(150,150,150,0.2)',
                            color: selectedStat === opt.value ? '#fff' : 'var(--color-Label-Primary)'
                          }}
                          className={`flex-1 md:flex-none text-center px-3 py-2 md:px-4 md:py-2 rounded-xl border text-[12px] md:text-[14px] font-bold tracking-tight transition-all cursor-pointer ${selectedStat !== opt.value ? 'hover:bg-gray-50 dark:hover:bg-surface-elevated' : ''}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="w-full h-[250px] md:h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="var(--color-chart-grid-soft)"
                        />
                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-Label-Tertiary)', fontSize: 12, fontWeight: 600 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-Label-Tertiary)', fontSize: 12, fontWeight: 600 }} domain={[0, getMaxValue(selectedStat)]} />
                        <Tooltip content={<LineChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey={selectedStat}
                          stroke="var(--color-chart-series-goals)"
                          strokeWidth={3}
                          dot={{
                            r: 5,
                            fill: "var(--color-white)",
                            strokeWidth: 2,
                            stroke: "var(--color-chart-series-goals)",
                          }}
                          activeDot={{ r: 8, strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white dark:bg-surface-secondary border border-Label-Tertiary/10 rounded-3xl p-5 md:p-8 flex flex-col gap-5 shadow-[0_8px_24px_rgba(0,0,0,0.04)] dark:shadow-none">
                  <h3 className="text-[17px] md:text-[20px] font-bold tracking-tight text-Label-Primary m-0">승/무/패 밸런스</h3>
                  <div className="w-full h-[250px] md:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="var(--color-chart-grid-soft)"
                        />
                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-Label-Tertiary)', fontSize: 12, fontWeight: 600 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-Label-Tertiary)', fontSize: 12, fontWeight: 600 }} />
                        <Tooltip content={<LineChartTooltipContent />} />
                        <Legend
                          verticalAlign="top"
                          align="right"
                          height={36}
                          wrapperStyle={{
                            fontSize: "0.8125rem",
                            fontWeight: 600,
                            color: "var(--color-Label-Primary)",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="win"
                          name="승"
                          stroke="var(--color-chart-series-goals)"
                          strokeWidth={2.5}
                          dot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="draw"
                          name="무"
                          stroke="var(--color-gray-500)"
                          strokeWidth={2.5}
                          dot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="lose"
                          name="패"
                          stroke="var(--color-chart-series-attack)"
                          strokeWidth={2.5}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
             </div>
           )}
        </section>

        {/* Section: 수상 기록 */}
        <section className="flex flex-col gap-3 md:gap-4 animate-in fade-in duration-500 delay-300">
           <div className="flex items-center gap-2 mb-1.5 md:mb-2">
             <Trophy className="w-5 md:w-6 h-5 md:h-6 text-blue-500" />
             <h3 className="text-[18px] md:text-xl font-bold text-Label-Primary m-0">수상 기록</h3>
           </div>
           
           <div className="bg-white dark:bg-surface-secondary border border-Label-Tertiary/10 rounded-[20px] p-8 lg:p-12 flex flex-col items-center justify-center gap-4 shadow-sm dark:shadow-none min-h-[160px] md:min-h-[200px]">
             <div className="w-12 md:w-14 h-12 md:h-14 rounded-full bg-amber-500/10 flex items-center justify-center">
               <Award className="w-6 md:w-7 h-6 md:h-7 text-amber-500" />
             </div>
             <p className="text-[14px] md:text-[15px] font-bold text-Label-Tertiary">아직 분석된 수상 기록이 없습니다</p>
           </div>
        </section>

        {/* Section: 베스트 파트너 */}
        <section className="flex flex-col gap-3 md:gap-4 animate-in fade-in duration-500 delay-500 mb-10">
           <div className="flex items-center gap-2 mb-1.5 md:mb-2">
             <Users className="w-5 md:w-6 h-5 md:h-6 text-blue-500" />
             <h3 className="text-[18px] md:text-xl font-bold text-Label-Primary m-0">베스트 파트너 (2026 시즌)</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
             {[
               { id: 1, title: '가장 많이 함께 뛴 동료', name: '기록 없음', value: '0쿼터' },
               { id: 2, title: '나의 도움으로 득점한 선수', name: '기록 없음', value: '0골' },
               { id: 3, title: '가장 많은 도움을 준 선수', name: '기록 없음', value: '0도움' },
               { id: 4, title: '함께 클린시트를 만든 선수', name: '기록 없음', value: '0회' }
             ].map(opt => (
               <div key={opt.id} className="bg-white dark:bg-surface-secondary rounded-[20px] p-4 md:p-5 flex flex-row items-center gap-4 shadow-[0_4px_16px_rgba(0,0,0,0.03)] dark:shadow-none border border-Label-Tertiary/10 transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_12px_rgba(255,255,255,0.02)] hover:-translate-y-0.5 group">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-Label-Tertiary/10 bg-gray-50 dark:bg-surface-elevated flex-shrink-0 overflow-hidden relative flex items-center justify-center">
                    <img src={getPartnerAvatarUrl(opt.name)} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110 opacity-50 dark:opacity-20" />
                  </div>
                  <div className="flex flex-col gap-0.5 w-full overflow-hidden">
                    <span className="text-[11px] md:text-[12px] font-bold text-Label-Tertiary truncate leading-tight">{opt.title}</span>
                    <span className="text-[15px] md:text-[16px] font-black tracking-tight text-Label-Primary truncate">{opt.name}</span>
                    <span className="text-[13px] md:text-[14px] font-bold tracking-tight text-blue-500">{opt.value}</span>
                  </div>
               </div>
             ))}
           </div>
        </section>

      </div>
    </div>
    </div>
  );
}


"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

// ──────────────────────────────────────────────
// Types & Constants
// ──────────────────────────────────────────────
interface MOMPlayer {
  rank: number;
  id: number;
  name: string;
  position: string;
  number: number;
  goals: number;
  assists: number;
  clean: number;
  votes: number;
  image: string;
}

const ORB_ICONS = ["🏆", "⭐", "🎖️", "🎖️", "🎖️", "🎖️"];

interface MOMVoteBoardProps {
  results: any[];
  onClose: () => void;
}

// ──────────────────────────────────────────────
// Utils
// ──────────────────────────────────────────────

export default function MOMVoteBoard({ results, onClose }: MOMVoteBoardProps) {
  const [showVideo, setShowVideo] = useState(true);
  const [showBoard, setShowBoard] = useState(false);
  const [momPlayers, setMomPlayers] = useState<MOMPlayer[]>([]);
  const [flippedSet, setFlippedSet] = useState<Set<number>>(new Set());
  const [allFlipped, setAllFlipped] = useState(false);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const celebrationCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [sideFlash, setSideFlash] = useState(false);

  useEffect(() => {
    const totalVotes = results.reduce((acc, r) => acc + r.voteCount, 0) || 1;
    const mapped = results.map((r, i) => {
      // 동률 처리: 이전 항목보다 득표수가 같으면 같은 순위 부여
      let rank = 1;
      for (let j = 0; j < i; j++) {
        if (results[j].voteCount > r.voteCount) rank++;
      }
      return {
        rank,
        id: r.candidateUserId || r.candidateMercenaryId || i,
        name: r.candidateUser?.name || r.candidateMercenary?.name || "알 수 없음",
        position: r.candidateUser?.mainPosition || "상대팀/용병",
        number: r.candidateUser?.preferredNumber ?? 0,
        goals: 0,
        assists: 0,
        clean: 0,
        votes: Math.round((r.voteCount / totalVotes) * 100),
        image: r.candidateUser?.profileImage || "/images/player/default.webp",
      };
    });
    setMomPlayers(mapped);
  }, [results]);

  useEffect(() => {
    if (showVideo) {
      const timer = setTimeout(() => {
        if (!showBoard) {
          setShowVideo(false);
          setShowBoard(true);
        }
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [showVideo, showBoard]);

  // 1. Particles Effect
  useEffect(() => {
    const cvs = particleCanvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    let pts: any[] = [];
    const resize = () => {
      cvs.width = window.innerWidth;
      cvs.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 75; i++) {
      pts.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(Math.random() * 0.35 + 0.08),
        a: Math.random() * 0.35 + 0.08,
        c: Math.random() > 0.5 ? "255,215,0" : "0,180,220",
      });
    }

    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -5) p.y = cvs.height + 5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${p.a})`;
        ctx.fill();
      });
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  // 2. Celebration (Confetti) Effect — FC Online 스타일
  const launchConfetti = () => {
    const cel = celebrationCanvasRef.current;
    if (!cel) return;
    const cCtx = cel.getContext("2d");
    if (!cCtx) return;

    cel.style.display = "block";
    cel.width = window.innerWidth;
    cel.height = window.innerHeight;

    // 사이드 플래시 트리거
    setSideFlash(true);
    setTimeout(() => setSideFlash(false), 1500);

    let conf: any[] = [];
    // FC Online 스타일: 빨간/금빛 중심
    const cols = ["#ff0000", "#ff3300", "#ff6600", "#ffd700", "#ffffff", "#ff1744", "#ffcc00"];

    // 상단 중앙 폭죽
    for (let i = 0; i < 180; i++) {
      conf.push({
        x: Math.random() * cel.width,
        y: -10 - Math.random() * 280,
        w: Math.random() * 10 + 4,
        h: Math.random() * 14 + 5,
        color: cols[Math.floor(Math.random() * cols.length)],
        vx: (Math.random() - 0.5) * 5,
        vy: Math.random() * 5 + 2,
        rot: Math.random() * 360,
        rotV: (Math.random() - 0.5) * 7,
        a: 1,
      });
    }
    // 좌측 사이드 폭죽
    for (let i = 0; i < 80; i++) {
      conf.push({
        x: -10,
        y: Math.random() * cel.height * 0.6,
        w: Math.random() * 8 + 3,
        h: Math.random() * 12 + 4,
        color: cols[Math.floor(Math.random() * cols.length)],
        vx: Math.random() * 7 + 2,
        vy: (Math.random() - 0.3) * 4,
        rot: Math.random() * 360,
        rotV: (Math.random() - 0.5) * 7,
        a: 1,
      });
    }
    // 우측 사이드 폭죽
    for (let i = 0; i < 80; i++) {
      conf.push({
        x: cel.width + 10,
        y: Math.random() * cel.height * 0.6,
        w: Math.random() * 8 + 3,
        h: Math.random() * 12 + 4,
        color: cols[Math.floor(Math.random() * cols.length)],
        vx: -(Math.random() * 7 + 2),
        vy: (Math.random() - 0.3) * 4,
        rot: Math.random() * 360,
        rotV: (Math.random() - 0.5) * 7,
        a: 1,
      });
    }

    const animC = () => {
      cCtx.clearRect(0, 0, cel.width, cel.height);
      conf.forEach((c) => {
        c.x += c.vx;
        c.y += c.vy;
        c.rot += c.rotV;
        if (c.y > cel.height || c.x < -60 || c.x > cel.width + 60) c.a -= 0.04;
        cCtx.save();
        cCtx.globalAlpha = Math.max(0, c.a);
        cCtx.translate(c.x, c.y);
        cCtx.rotate((c.rot * Math.PI) / 180);
        cCtx.fillStyle = c.color;
        cCtx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        cCtx.restore();
      });
      conf = conf.filter((c) => c.a > 0);
      if (conf.length > 0) {
        requestAnimationFrame(animC);
      } else {
        cel.style.display = "none";
      }
    };
    animC();
  };

  const flipCard = (idx: number) => {
    if (flippedSet.has(idx)) return;

    const nextSet = new Set(flippedSet);
    nextSet.add(idx);
    setFlippedSet(nextSet);

    if (momPlayers[idx]?.rank === 1) {
      setTimeout(launchConfetti, 700);
    }

    if (momPlayers.length > 0 && nextSet.size === momPlayers.length) {
      setAllFlipped(true);
    }
  };

  const handleMainBtn = () => {
    if (!allFlipped) {
      momPlayers.forEach((_, i) => flipCard(i));
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black overflow-hidden select-none">
      <style jsx global>{`
        @keyframes pulse-mom { 0%,100%{opacity:0.4} 50%{opacity:0.9} }
        @keyframes fallIn-mom {
          from{opacity:0;transform:translateY(-150px) scale(1.1);filter:brightness(2) blur(6px);}
          to{opacity:1;transform:translateY(0) scale(1);filter:brightness(1) blur(0);}
        }
        @keyframes shimmerSweep-mom{0%{left:-80%}100%{left:120%}}
        @keyframes btnShimmer-mom{0%{left:-60%}100%{left:140%}}
        @keyframes fadeDown-mom{from{opacity:0;transform:translateY(-30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeUp-mom{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes sideFlash-mom{0%{opacity:0}15%{opacity:1}100%{opacity:0}}
        /* OVR 로고: 안쪽에서 바깥쪽 3D 회전 (rotateY) - 천천히 */
        @keyframes spin-ovr{
          0%{transform:perspective(800px) rotateY(0deg);}
          100%{transform:perspective(800px) rotateY(360deg);}
        }
        .spin-ovr{animation:spin-ovr 5s linear infinite;}

        .card-inner-mom {
          width:100%; height:100%;
          position:relative;
          transform-style: preserve-3d;
          transition: transform 1s cubic-bezier(.4,0,.2,1);
        }
        .flipped-mom .card-inner-mom { transform: rotateY(180deg); }

        .shimmer-active-mom::before {
          content:''; position:absolute;
          top:-50%; left:-80%; width:55%; height:200%;
          background:linear-gradient(105deg,transparent 20%,rgba(184,255,18,0.3) 50%,transparent 80%);
          animation:shimmerSweep-mom 2s linear infinite;
        }

        /* 모바일 스크롤 바 숨기기 */
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* 시네마틱 오프닝 영상 - 최상단 배치 + 대각선 컷 */}
      {showVideo && (
        <div
          className="fixed inset-0 z-[10000] bg-black flex items-center justify-center overflow-hidden"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 88%, 88% 100%, 0 100%)" }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            onEnded={() => {
              setShowVideo(false);
              setShowBoard(true);
            }}
            onError={() => {
              setShowVideo(false);
              setShowBoard(true);
            }}
          >
            <source src="/videos/MOMTOP3_Chapion.mp4" type="video/mp4" />
          </video>

          <div className="absolute bottom-[-30px] right-[-30px] w-48 h-48 md:w-80 md:h-80 bg-linear-to-tl from-yellow-500/15 via-transparent to-transparent rotate-45 pointer-events-none border-l-[1.5px] border-yellow-500/35 shadow-[0_0_40px_rgba(255,215,0,0.08)]"></div>
          <div className="absolute bottom-8 right-8 md:bottom-14 md:right-14 z-[10001] flex flex-col items-end opacity-20 pointer-events-none select-none">
            <span className="text-[10px] md:text-[14px] font-black text-white tracking-[0.6em] italic">SOOP FC CINEMATIC</span>
          </div>

          <button
            onClick={() => { setShowVideo(false); setShowBoard(true); }}
            className="absolute bottom-8 left-8 z-[10002] text-white/50 hover:text-white transition-colors text-[10px] tracking-widest font-bold bg-black/60 px-5 py-2.5 rounded-full border border-white/20"
          >
            SKIP VIDEO
          </button>
        </div>
      )}

      {/* 배경: landing_bg.webp + 오버레이 */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/landing_bg.webp')" }}></div>
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,215,0,0.02)_1px,transparent_1px)] bg-size-[28px_28px]"></div>
      </div>
      {/* FC Online 스타일: 좌우 빨간 배경 패널 */}
      <div className="absolute left-0 top-0 bottom-0 w-[15%] z-2 bg-linear-to-r from-red-950/80 via-red-900/30 to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-[15%] z-2 bg-linear-to-l from-red-950/80 via-red-900/30 to-transparent pointer-events-none"></div>
      {/* FC Online 폭죽 사이드 플래시 */}
      {sideFlash && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-[22%] z-45 pointer-events-none bg-linear-to-r from-red-600/75 to-transparent animate-[sideFlash-mom_1.5s_ease_both]"></div>
          <div className="absolute right-0 top-0 bottom-0 w-[22%] z-45 pointer-events-none bg-linear-to-l from-red-600/75 to-transparent animate-[sideFlash-mom_1.5s_ease_both]"></div>
        </>
      )}
      <canvas ref={particleCanvasRef} className="absolute inset-0 z-3 pointer-events-none"></canvas>

      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-[110] w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-95 shadow-2xl"
      >
        <X size={20} />
      </button>

      <div className={cn(
        "relative z-10 h-full flex flex-col font-['Noto_Sans_KR'] text-white transition-all duration-1000",
        showBoard ? "opacity-100 scale-100" : "opacity-0 invisible scale-110"
      )}>
        <header className="text-center pt-8 pb-3 px-4 animate-[fadeDown-mom_0.8s_ease_both] flex-shrink-0">
          <div className="inline-flex items-center gap-2 bg-linear-to-br from-blue-900/30 to-blue-800/20 border border-yellow-500/30 rounded-full px-4 py-1.5 mb-2">
            <span className="text-[9px] md:text-[11px] tracking-[4px] text-yellow-400 opacity-85 font-bold uppercase">⚽ SOOP FOOTBALL CLUB</span>
          </div>
          <h1 className="font-['Cinzel'] text-[clamp(1.2rem,3.5vw,2.5rem)] font-black tracking-widest text-white drop-shadow-[0_0_40px_rgba(255,215,0,0.25)] leading-tight">MAN OF THE MATCH</h1>
        </header>

        <section className="flex-1 flex flex-col overflow-hidden relative">
          <div className={cn(
            "text-center text-[10px] md:text-[12px] text-white/30 mb-3 tracking-[1.5px] transition-all duration-500 font-bold flex-shrink-0",
            allFlipped ? "text-green-400" : "animate-[pulse-mom_2s_infinite]"
          )}>
            {allFlipped ? "🎉 모든 MOM이 공개되었습니다!" : "▼ 카드를 선택하거나 스크롤하여 확인하세요 ▼"}
          </div>

          {/* 모바일 1인 1카드 스크롤 + PC 가로 고정 레이아웃 */}
          <div className="flex-1 overflow-y-auto sm:overflow-visible snap-y snap-mandatory hide-scrollbar pb-16 sm:pb-0 px-4">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-[clamp(20px,4vw,40px)] items-center justify-center min-h-max sm:min-h-0 sm:flex-nowrap sm:w-max sm:mx-auto pt-8 sm:pt-0">
              {momPlayers.map((p, i) => {
                const isFlipped = flippedSet.has(i);
                // 마지막 카드(최하위)가 먼저 등장하고, 첫 카드(1위)가 가장 늦게 등장
                const animDelay = `${(momPlayers.length - 1 - i) * 300}ms`;

                return (
                  <div
                    key={i}
                    className={cn(
                      "relative perspective-distant cursor-pointer animate-[fallIn-mom_1.2s_cubic-bezier(.16,1,.3,1)_both] snap-center shrink-0",
                      isFlipped && "flipped-mom"
                    )}
                    style={{
                      animationDelay: animDelay,
                      width: 'clamp(220px, 70vw, 304px)',
                      height: 'clamp(288px, 91.8vw, 399px)'
                    }}
                    onClick={() => flipCard(i)}
                  >
                    <div className="card-inner-mom w-full h-full relative overflow-visible">
                      {/* FRONT — OVR 카드 (이미지 기준) */}
                      <div className="card-face absolute inset-0 rounded-2xl overflow-hidden backface-hidden hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                        style={{ boxShadow: '0 0 0 2px rgba(184,255,18,0.45), 0 0 30px rgba(184,255,18,0.2)' }}
                      >
                        {/* 배경: normal-green.webp 크리스탈 패턴 */}
                        <div className="absolute inset-0 bg-[url('/images/card-bgs/normal-green.webp')] bg-cover bg-center"></div>
                        <div className="absolute inset-0 bg-black/35"></div>
                        {/* 네온 테두리 내부 글로우 */}
                        <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: 'inset 0 0 20px rgba(184,255,18,0.15)' }}></div>
                        {/* 중앙: 스피닝 OVR MOM Board 로고 */}
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2">
                          <img
                            src="/images/logoani2.webp"
                            alt="OVR"
                            className="spin-ovr w-[90px] h-[90px] object-contain"
                            style={{ filter: 'drop-shadow(0 0 14px rgba(184,255,18,0.9)) drop-shadow(0 0 4px #b8ff12)' }}
                          />
                        </div>
                      </div>

                      {/* BACK — 선수 카드 */}
                      <div
                        className="card-face absolute inset-0 rounded-2xl overflow-hidden backface-hidden shadow-2xl"
                        style={{
                          transform: 'rotateY(180deg)',
                          border: `2px solid ${p.rank === 1 ? '#b8ff12' : p.rank === 2 ? '#c0c0c0' : '#cd7f32'}`,
                          boxShadow: `0 0 0 2px ${p.rank === 1 ? 'rgba(184,255,18,0.5)' : p.rank === 2 ? 'rgba(192,192,192,0.4)' : 'rgba(205,127,50,0.4)'}, 0 8px 32px rgba(0,0,0,0.8)`
                        }}
                      >
                        {/* 배경: normal-green.webp */}
                        <div className="absolute inset-0 bg-[url('/images/card-bgs/normal-green.webp')] bg-cover bg-center"></div>
                        <div className="absolute inset-0 bg-black/20"></div>

                        {/* 선수 이미지: 카드 전체 채움 */}
                        <div className="absolute inset-0" style={{ zIndex: 10 }}>
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover object-top"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        </div>

                        {/* 1위 shimmer — 이미지 위 */}
                        <div
                          className={cn("absolute inset-0 pointer-events-none", p.rank === 1 && "shimmer-active-mom")}
                          style={{ zIndex: 11 }}
                        />

                        {/* 상단 그라디언트 오버레이 */}
                        <div
                          className="absolute top-0 left-0 right-0 h-[45%] pointer-events-none"
                          style={{ zIndex: 20, background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)' }}
                        />

                        {/* 왼쪽 상단: 등번호 + 포지션 */}
                        <div className="absolute top-3 left-3 flex flex-col items-start leading-none" style={{ zIndex: 30 }}>
                          {p.number > 0 && (
                            <span
                              className="font-['Cinzel'] font-black text-white leading-none"
                              style={{ fontSize: 'clamp(26px, 6vw, 38px)', textShadow: '0 2px 12px rgba(0,0,0,1), 0 0 20px rgba(0,0,0,0.8)' }}
                            >
                              {p.number}
                            </span>
                          )}
                          <span
                            className="text-[11px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded"
                            style={{
                              marginTop: p.number > 0 ? '4px' : '0',
                              color: '#131312',
                              background: p.rank === 1 ? '#b8ff12' : p.rank === 2 ? '#d4d4d4' : '#cd7f32',
                            }}
                          >
                            {p.position || "FW"}
                          </span>
                        </div>

                        {/* 하단 그라디언트 오버레이 */}
                        <div
                          className="absolute bottom-0 left-0 right-0 h-[35%] pointer-events-none"
                          style={{ zIndex: 20, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)' }}
                        />

                        {/* 하단 이름 */}
                        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center px-3 pb-3 pt-2" style={{ zIndex: 30 }}>
                          <span className="font-['Black_Han_Sans'] text-white tracking-wider text-center" style={{ fontSize: 'clamp(13px, 3vw, 16px)' }}>
                            {p.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="text-center py-6 px-4 animate-[fadeUp-mom_1s_1.8s_ease_both] flex-shrink-0">
          <button
            onClick={handleMainBtn}
            className={cn(
              "relative overflow-hidden px-12 py-3.5 md:py-5 rounded-xl font-['Black_Han_Sans'] text-lg md:text-2xl tracking-[0.4em] transition-all duration-300 transform active:scale-95 group shadow-[0_20px_50px_rgba(0,0,0,0.6)] border",
              allFlipped
                ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                : "bg-primary border-primary/30 text-black hover:opacity-90 shadow-lg shadow-primary/30"
            )}
          >
            <span className="relative z-10">{allFlipped || momPlayers.length === 0 ? "CLOSE" : "전체오픈"}</span>
            <div className="absolute top-[-50%] left-[-60%] w-[40%] h-[200%] bg-linear-to-r from-transparent via-white/50 to-transparent animate-[btnShimmer-mom_2.5s_linear_infinite]"></div>
          </button>
        </div>

        <footer className="text-center py-3 text-[9px] tracking-[8px] text-white/5 font-['Cinzel'] font-black mt-auto uppercase">
          Soop Football Club · Man of the Match
        </footer>
      </div>

      <canvas ref={celebrationCanvasRef} className="absolute inset-0 z-50 pointer-events-none hidden"></canvas>
    </div>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import { INITIAL_PLAYERS } from "@/data/players";
import { cn } from "@/lib/utils";
import { X, Shield } from "lucide-react";

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

const ORB_ICONS = ["🏆", "⭐", "🎖️"];
const RANK_LABEL = ["1위", "2위", "3위"];

// 보누치 카드 스타일의 더 정교한 10각형 형태
const PREMIUM_CLIP_PATH = "polygon(50% 0%, 95% 8%, 100% 35%, 100% 70%, 95% 92%, 50% 100%, 5% 92%, 0% 70%, 0% 35%, 5% 8%)";

// ──────────────────────────────────────────────
// Utils
// ──────────────────────────────────────────────
const getRandomMOM = (): MOMPlayer[] => {
  const shuffled = [...INITIAL_PLAYERS].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);
  
  const votes = [78, 58, 34];
  return selected.map((p, i) => ({
    rank: i + 1,
    id: p.id,
    name: p.name,
    position: p.position,
    number: p.number ?? 0,
    goals: Math.floor(Math.random() * 3),
    assists: Math.floor(Math.random() * 3),
    clean: p.position === "GK" || p.position === "CB" || p.position === "LB" || p.position === "RB" ? (Math.random() > 0.5 ? 1 : 0) : 0,
    votes: votes[i],
    image: p.image || "/images/player/default.webp",
  }));
};

interface MOMVoteBoardProps {
  onClose: () => void;
}

export default function MOMVoteBoard({ onClose }: MOMVoteBoardProps) {
  const [showVideo, setShowVideo] = useState(true);
  const [showBoard, setShowBoard] = useState(false);
  const [momPlayers, setMomPlayers] = useState<MOMPlayer[]>([]);
  const [flippedSet, setFlippedSet] = useState<Set<number>>(new Set());
  const [allFlipped, setAllFlipped] = useState(false);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const celebrationCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMomPlayers(getRandomMOM());
  }, []);

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

  // 2. Celebration (Confetti) Effect
  const launchConfetti = () => {
    const cel = celebrationCanvasRef.current;
    if (!cel) return;
    const cCtx = cel.getContext("2d");
    if (!cCtx) return;

    cel.style.display = "block";
    cel.width = window.innerWidth;
    cel.height = window.innerHeight;

    let conf: any[] = [];
    const cols = ["#ffd700", "#fff200", "#ffaa00", "#ffffff", "#00b4dc", "#ff6b6b", "#4ecdc4"];
    for (let i = 0; i < 200; i++) {
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

    const animC = () => {
      cCtx.clearRect(0, 0, cel.width, cel.height);
      conf.forEach((c) => {
        c.x += c.vx;
        c.y += c.vy;
        c.rot += c.rotV;
        if (c.y > cel.height) c.a -= 0.04;
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

    if (nextSet.size === 3) {
      setAllFlipped(true);
    }
  };

  const handleMainBtn = () => {
    if (!allFlipped) {
      [0, 1, 2].forEach(i => flipCard(i));
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

        .card-inner-mom {
          width:100%; height:100%;
          position:relative;
          transform-style: preserve-3d;
          transition: transform 1s cubic-bezier(.4,0,.2,1);
        }
        .flipped-mom .card-inner-mom { transform: rotateY(180deg); }

        .premium-card-shape {
          clip-path: ${PREMIUM_CLIP_PATH};
        }

        .shimmer-active-mom::before {
          content:''; position:absolute;
          top:-50%; left:-80%; width:55%; height:200%;
          background:linear-gradient(105deg,transparent 20%,rgba(255,215,0,0.38) 50%,transparent 80%);
          animation:shimmerSweep-mom 2s linear infinite;
        }
        
        .pop-out-image {
          transition: transform 0.8s cubic-bezier(.22,1,.36,1);
          transform: translateZ(30px) scale(1.1);
        }
        .flipped-mom .pop-out-image {
          transform: translateZ(-30px) scale(1.02) rotateY(180deg);
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

      <div className="absolute inset-0 z-0 bg-radial-[ellipse_100%_80%_at_50%_30%] from-[#050c26] to-[#01020a]"></div>
      <div className="absolute inset-0 z-1 bg-[radial-gradient(circle,rgba(255,215,0,0.03)_1px,transparent_1px)] bg-size-[28px_28px]"></div>
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
              {[0, 1, 2].map((i) => {
                const p = momPlayers[i];
                if (!p) return null;
                const isFlipped = flippedSet.has(i);
                
                const entryDelay = i === 2 ? "delay-300" : i === 1 ? "delay-600" : "delay-900";

                return (
                  <div 
                    key={i} 
                    className={cn(
                      "relative perspective-distant cursor-pointer animate-[fallIn-mom_1.2s_cubic-bezier(.16,1,.3,1)_both] snap-center shrink-0",
                      entryDelay,
                      isFlipped && "flipped-mom"
                    )}
                    style={{ 
                      width: 'clamp(230px, 60vw, 250px)', 
                      height: 'clamp(340px, 55vh, 400px)' 
                    }}
                    onClick={() => flipCard(i)}
                  >
                    <div className="card-inner-mom w-full h-full relative overflow-visible">
                      {/* FRONT */}
                      <div 
                          className="card-face absolute inset-0 premium-card-shape bg-linear-to-br from-[#0c1840] via-[#050b26] to-[#020514] border-[1px] border-yellow-500/20 shadow-xl overflow-hidden flex flex-col items-center justify-center gap-3 transition-all duration-300 backface-hidden hover:scale-[1.02] hover:border-yellow-400/50"
                      >
                        <div className="w-[70px] h-[70px] rounded-full bg-radial-[circle_at_38%_32%] from-cyan-400/20 to-transparent border border-cyan-400/25 flex items-center justify-center text-[30px] shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                          {ORB_ICONS[i]}
                        </div>
                        <div className="text-[10px] tracking-[4px] text-cyan-400/50 font-black uppercase">Premium Card</div>
                        <div className="font-['Cinzel'] text-[28px] text-yellow-500/10 font-black">MOM</div>
                      </div>

                      {/* BACK - 축소된 보누치 스타일 (TOTY 제거 및 OVR 마크 추가) */}
                      <div className="card-face absolute inset-0 transition-all duration-500 rotate-y-180 backface-hidden overflow-visible">
                         <div 
                            className={cn(
                                "absolute inset-0 premium-card-shape flex flex-col p-0 overflow-hidden shadow-2xl bg-linear-to-b from-[#0a1a45] to-[#010410]"
                            )}
                            style={{ border: `1.5px solid ${p.rank === 1 ? '#ffd700' : p.rank === 2 ? '#c0c0c0' : '#cd7f32'}` }}
                         >
                            <div className="absolute inset-0 bg-[url('/images/card-bgs/normal-blue.webp')] bg-cover bg-center opacity-40 mix-blend-screen"></div>
                            <div className={cn("absolute inset-0 pointer-events-none", p.rank === 1 && "shimmer-active-mom")}></div>
                            
                            <div className="absolute top-0 left-0 w-[70px] md:w-[85px] h-full bg-white/5 border-r border-white/10 backdrop-blur-sm"></div>

                            <div className="absolute top-8 left-0 w-[70px] md:w-[85px] z-10 flex flex-col items-center translate-z-20">
                                <span className="text-4xl md:text-6xl font-['Cinzel'] font-black text-white drop-shadow-[0_4px_12px_rgba(0,0,0,1)] leading-none italic tracking-tighter">98</span>
                                <span className="text-[13px] md:text-[18px] font-black text-yellow-400 mt-1 tracking-widest drop-shadow-lg uppercase">{p.position}</span>
                                
                                <div className="mt-6 flex flex-col items-center gap-3">
                                    {/* 국기 (대한민국 예시) */}
                                    <div className="w-8 h-5 md:w-11 md:h-7 bg-black/40 border border-white/20 flex items-center justify-center overflow-hidden rounded-sm shadow-lg">
                                        <div className="w-full h-full bg-linear-to-r from-blue-600 via-white to-red-600 opacity-90"></div>
                                    </div>
                                    
                                    {/* OVR 기본 마크 (TOTY 제거 및 쉴드 아이콘 대체) */}
                                    <div className="w-8 h-8 md:w-11 md:h-11 rounded-full bg-linear-to-br from-yellow-500/20 to-transparent border border-yellow-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(255,215,0,0.1)]">
                                        <Shield size={16} className="text-yellow-500/60" />
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-6 left-0 w-full z-10 flex flex-col items-center">
                                <div className="w-[92%] h-12 md:h-16 flex items-center justify-between px-4 md:px-7 bg-linear-to-b from-blue-900/90 to-black/98 backdrop-blur-3xl border border-white/10 rounded-lg shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
                                    <div className="flex flex-col items-start min-w-[35px]">
                                        <span className="text-[7px] font-black text-yellow-400 tracking-tighter opacity-80 uppercase">Rank</span>
                                        <span className="font-['Cinzel'] text-[11px] md:text-[18px] font-black text-white leading-none italic">{RANK_LABEL[i]}</span>
                                    </div>
                                    {/* 모바일 가시성 강화를 위한 텍스트 크기 확대 (sm 미만 text-base) */}
                                    <h2 className="font-['Black_Han_Sans'] text-base sm:text-sm md:text-[19px] text-white tracking-widest leading-none drop-shadow-xl text-center px-2 flex-1 break-keep">
                                        {p.name}
                                    </h2>
                                    <div className="flex flex-col items-end min-w-[35px]">
                                        <span className="text-[7px] font-black text-white/40 tracking-tighter uppercase">Votes</span>
                                        {/* 모바일 가시성 강화를 위한 텍스트 크기 확대 (sm 미만 text-sm) */}
                                        <span className="font-['Cinzel'] text-sm sm:text-[11px] md:text-[18px] font-black text-yellow-400 leading-none italic">{p.votes}%</span>
                                    </div>
                                </div>
                            </div>
                         </div>

                         <div className="absolute inset-0 z-20 flex items-end justify-center pointer-events-none overflow-visible">
                            <img 
                              src={p.image} 
                              alt={p.name}
                              className="pop-out-image w-[112%] h-[112%] object-contain filter drop-shadow(0 25px 40px rgba(0,0,0,0.85)) -translate-y-7 md:-translate-y-14 translate-x-3 md:translate-x-6"
                            />
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
                "relative overflow-hidden px-12 py-3.5 md:py-5 rounded-xl font-['Black_Han_Sans'] text-lg md:text-2xl tracking-[0.4em] transition-all duration-300 transform active:scale-95 group shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/5",
                allFlipped 
                    ? "bg-linear-to-br from-[#1e3a8a] to-[#000000] text-white" 
                    : "bg-linear-to-br from-[#fbbf24] via-[#f59e0b] to-[#d97706] text-black"
            )}
          >
            <span className="relative z-10">{allFlipped ? "COMPLETE" : "REVEAL ALL"}</span>
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

"use client";

import React, { useEffect, useRef, useState } from "react";
import { INITIAL_PLAYERS } from "@/data/players";
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

const ORB_ICONS = ["🏆", "⭐", "🎖️"];
const RANK_LABEL = ["1위 MVP", "2위 우수선수", "3위 선정"];

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
    number: p.number,
    goals: Math.floor(Math.random() * 3),
    assists: Math.floor(Math.random() * 3),
    clean: p.position === "GK" || p.position === "CB" || p.position === "LB" || p.position === "RB" ? (Math.random() > 0.5 ? 1 : 0) : 0,
    votes: votes[i],
    image: p.image || "/images/player/default.webp",
  }));
};


// ──────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────
interface MOMVoteBoardProps {
  onClose: () => void;
}

export default function MOMVoteBoard({ onClose }: MOMVoteBoardProps) {
  const [momPlayers, setMomPlayers] = useState<MOMPlayer[]>([]);
  const [flippedSet, setFlippedSet] = useState<Set<number>>(new Set());
  const [allFlipped, setAllFlipped] = useState(false);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const celebrationCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setMomPlayers(getRandomMOM());
  }, []);

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

  const flipAllCards = () => {
    const allIndices = [0, 1, 2];
    setFlippedSet(new Set(allIndices));
    setAllFlipped(true);

    // 1위인 카드가 있는지 확인하여 폭죽 발사
    const hasRank1 = momPlayers.some(p => p.rank === 1);
    if (hasRank1) {
      setTimeout(launchConfetti, 700);
    }
  };


  const handleMainBtn = () => {
    if (!allFlipped) {
      flipAllCards();
    } else {
      onClose();
    }
  };


  return (
    <div className="fixed inset-0 z-9999 overflow-hidden bg-black select-none">

      <style jsx global>{`
        @keyframes pulse-mom { 0%,100%{opacity:0.4} 50%{opacity:0.9} }
        @keyframes floatIn-mom {
          from{opacity:0;transform:translateY(70px) scale(0.75)}
          to{opacity:1;transform:translateY(0) scale(1)}
        }
        @keyframes shimmerSweep-mom{0%{left:-80%}100%{left:120%}}
        @keyframes pulseRing-mom{0%,100%{opacity:0.1;transform:translate(-50%,-50%) scale(1)}50%{opacity:0.25;transform:translate(-50%,-50%) scale(1.1)}}
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

        .shimmer-active-mom::before {
          content:''; position:absolute;
          top:-50%; left:-80%; width:55%; height:200%;
          background:linear-gradient(105deg,transparent 20%,rgba(255,215,0,0.38) 50%,transparent 80%);
          animation:shimmerSweep-mom 2s linear infinite;
        }
        .shimmer-active-mom::after {
          content:''; position:absolute;
          top:-50%; left:-80%; width:25%; height:200%;
          background:linear-gradient(105deg,transparent 20%,rgba(255,255,220,0.6) 50%,transparent 80%);
          animation:shimmerSweep-mom 2s linear infinite 0.45s;
        }
      `}</style>

      <div className="absolute inset-0 z-0 bg-radial-[ellipse_100%_80%_at_50%_30%] from-[#0b1a4a] to-[#050a1f]"></div>
      <div className="absolute inset-0 z-1 bg-[radial-gradient(circle,rgba(255,215,0,0.07)_1px,transparent_1px)] bg-size-[28px_28px]"></div>
      <div className="absolute inset-0 z-2 bg-[linear-gradient(180deg,transparent_48%,rgba(0,180,220,0.04)_50%,transparent_52%),linear-gradient(90deg,transparent_48%,rgba(0,180,220,0.04)_50%,transparent_52%)] bg-size-[80px_80px]"></div>
      
      <canvas ref={particleCanvasRef} className="absolute inset-0 z-3 pointer-events-none"></canvas>


      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-100 w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-95"
      >

        <X size={24} />
      </button>

      <div className="relative z-10 min-h-screen flex flex-col font-['Noto_Sans_KR'] text-white overflow-y-auto">
        <header className="text-center pt-12 pb-6 px-4 animate-[fadeDown-mom_0.8s_ease_both]">
          <div className="inline-flex items-center gap-2.5 bg-linear-to-br from-blue-900/30 to-blue-800/20 border border-yellow-500/30 rounded-full px-5 py-1.5 mb-3.5">
            <span className="text-[10px] md:text-[12px] tracking-[4px] text-yellow-400 opacity-85 font-bold uppercase">⚽ SOOP FOOTBALL CLUB</span>
          </div>
          <h1 className="font-['Cinzel'] text-[clamp(1.8rem,5vw,3.6rem)] font-black tracking-widest text-white drop-shadow-[0_0_50px_rgba(255,215,0,0.5)] leading-tight">MAN OF THE MATCH</h1>
          <p className="mt-2 text-[11px] md:text-[13px] text-white/40 tracking-[2px]">이 주의 MOM 선정 · 카드를 클릭하여 공개</p>
          <div className="w-32 md:w-48 h-px mx-auto mt-4 bg-linear-to-r from-transparent via-yellow-400 to-transparent"></div>
        </header>

        <section className="flex-1 flex flex-col items-center justify-center py-6 px-4">
          <p className={cn(
            "text-[12px] md:text-[14px] text-white/40 mb-8 tracking-[2px] transition-all duration-500",
            allFlipped ? "animate-none text-green-400 font-bold" : "animate-[pulse-mom_2s_infinite]"
          )}>
            {allFlipped ? "🎉 모든 MOM이 공개되었습니다!" : "▼ 카드를 선택하여 순위를 확인하세요 ▼"}
          </p>
          
          <div className="flex gap-2.5 md:gap-[clamp(14px,3vw,36px)] justify-center md:flex-wrap max-w-5xl mx-auto px-2">

            {[0, 1, 2].map((i) => {
              const p = momPlayers[i];
              if (!p) return null;
              const isFlipped = flippedSet.has(i);
              
              return (
                <div 
                  key={i} 
                  className={cn(
                    "relative perspective-distant cursor-pointer animate-[floatIn-mom_0.8s_cubic-bezier(.22,.68,0,1.4)_both]",
                    i === 0 ? "delay-100" : i === 1 ? "delay-250" : "delay-400",
                    isFlipped && "flipped-mom"
                  )}

                  style={{ 
                    width: 'clamp(100px, 28vw, 215px)', 
                    height: 'clamp(160px, 44vw, 340px)' 
                  }}
                  onClick={() => flipCard(i)}
                >

                  <div className="card-inner-mom w-full h-full relative">
                    {/* FRONT */}
                    <div className={cn(
                      "card-face absolute inset-0 rounded-[20px] border-[1.5px] border-yellow-500/25 shadow-2xl overflow-hidden flex flex-col items-center justify-center gap-2 md:gap-3.5 transition-all duration-300 backface-hidden hover:scale-[1.04] hover:-translate-y-2 hover:border-yellow-400 hover:shadow-[0_0_40px_rgba(255,215,0,0.55)]",
                      "before:absolute before:inset-0 before:bg-[url('/images/card-bgs/normal-blue.webp')] before:bg-cover before:bg-center before:opacity-100 before:z-0"
                    )}>
                      
                      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-black/60 z-1"></div>

                      <div className="absolute top-2 left-2 md:top-3 md:left-3 w-5 h-5 md:w-9 md:h-9 border-t-2 border-l-2 border-yellow-500/40 rounded-tl-md z-2"></div>
                      <div className="absolute top-2 right-2 md:top-3 md:right-3 w-5 h-5 md:w-9 md:h-9 border-t-2 border-r-2 border-yellow-500/40 rounded-tr-md z-2"></div>
                      <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 w-5 h-5 md:w-9 md:h-9 border-b-2 border-l-2 border-yellow-500/40 rounded-bl-md z-2"></div>
                      <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-5 h-5 md:w-9 md:h-9 border-b-2 border-r-2 border-yellow-500/40 rounded-br-md z-2"></div>
                      
                      <div className="w-[45px] md:w-[82px] h-[45px] md:h-[82px] rounded-full bg-radial-[circle_at_38%_32%] from-cyan-400/20 to-cyan-800/10 border-2 border-cyan-400/50 flex items-center justify-center text-[18px] md:text-[34px] shadow-[0_0_22px_rgba(34,211,238,0.35)] relative z-2">
                        {ORB_ICONS[i]}
                      </div>
                      <div className="text-[8px] md:text-[11px] tracking-[2px] md:tracking-[4px] text-cyan-400 font-bold uppercase relative z-2">MOM CARD</div>
                      <div className="font-['Cinzel'] text-[24px] md:text-[34px] text-yellow-500/30 font-black relative z-2">?</div>
                      <div className="text-[6px] md:text-[9px] tracking-[2px] md:tracking-[3px] text-yellow-500/40 font-bold relative z-2">SOOP FC · 2026</div>
                    </div>


                    {/* BACK */}
                    <div className={cn(
                      "card-face absolute inset-0 rounded-[20px] transform rotate-y-180 backface-hidden flex flex-col items-center justify-center gap-2 md:gap-2.5 p-3 md:p-4 overflow-hidden shadow-2xl transition-all",
                      "before:absolute before:inset-0 before:bg-[url('/images/card-bgs/normal-blue.webp')] before:bg-cover before:bg-center before:opacity-100 before:z-0",
                      p.rank === 1 && "border-2 border-yellow-500 shadow-[0_0_50px_rgba(255,215,0,0.4)] bg-black",

                      p.rank === 2 && "border-2 border-slate-400 shadow-[0_0_40px_rgba(148,163,184,0.3)] bg-black",
                      p.rank === 3 && "border-2 border-amber-600 shadow-[0_0_40px_rgba(217,119,6,0.3)] bg-black"
                    )}>
                      {/* Gradient Overlay for Text Readability */}
                      <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/40 to-black/80 z-1"></div>

                      <div className={cn("absolute inset-0 pointer-events-none rounded-[18px] z-2", p.rank === 1 && "shimmer-active-mom")}></div>

                      <div className={cn(
                        "font-['Cinzel'] text-[8px] md:text-[10px] tracking-[3px] px-3 py-1 rounded-full border relative z-10 font-black",
                        p.rank === 1 ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" : p.rank === 2 ? "bg-blue-400/15 text-blue-200 border-blue-400/40" : "bg-amber-600/20 text-amber-500 border-amber-600/45"
                      )}>
                        {RANK_LABEL[p.rank - 1]}
                      </div>

                      <div className={cn(
                        "relative w-full h-[120px] md:h-[150px] flex items-center justify-center z-10"
                      )}>
                        <img 
                          src={p.image} 
                          alt={p.name}
                          className="h-full object-contain relative z-2 filter drop-shadow(0 15px 25px rgba(0,0,0,0.9))"
                        />
                        <div className="absolute bottom-1 right-[15%] bg-black/90 px-2 py-0.5 rounded-md border border-white/30 text-[10px] font-black italic text-white z-10 shadow-lg">
                          NO.{p.number}
                        </div>
                      </div>

                      <div className="text-center z-10 space-y-0.5 md:space-y-1 mt-[-10px]">
                        <h2 className={cn(
                          "font-['Black_Han_Sans'] text-3xl md:text-4xl drop-shadow-[0_4px_12px_rgba(0,0,0,1)]",
                          p.rank === 1 ? "text-yellow-400" : p.rank === 2 ? "text-blue-100" : "text-amber-400"
                        )}>
                          {p.name}
                        </h2>
                        <span className={cn(
                          "block text-[8px] md:text-[10px] tracking-[3px] uppercase opacity-70",
                          p.rank === 1 ? "text-yellow-500/80" : "text-white/60"
                        )}>
                          {p.position}
                        </span>
                      </div>

                      <div className="w-full space-y-1 z-2 mt-1">
                        <div className="flex items-center justify-between text-[8px] md:text-[10px] font-black text-white/40 px-1">
                            <span>득표율</span>
                            <span className="text-white">{p.votes}%</span>
                        </div>
                        <div className="w-full h-0.5 md:h-[3px] rounded-full bg-white/10 overflow-hidden relative">
                          <div 
                            className={cn(
                                "h-full rounded-full transition-all duration-1400 delay-700",
                                p.rank === 1 ? "bg-linear-to-r from-yellow-700 via-yellow-400 to-yellow-200" : p.rank === 2 ? "bg-linear-to-r from-blue-700 to-blue-300" : "bg-linear-to-r from-amber-800 to-amber-400"
                            )}

                            style={{ width: isFlipped ? `${p.votes}%` : '0%' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className={cn(
          "text-center py-8 px-4 animate-[fadeUp-mom_1s_1.2s_ease_both]",
          !allFlipped ? "hidden md:block" : "block"
        )}>
          <button 
            onClick={handleMainBtn}
            className={cn(
                "relative overflow-hidden px-10 md:px-14 py-3 md:py-4 rounded-full font-['Black_Han_Sans'] text-lg md:text-xl tracking-widest transition-all duration-300 transform active:scale-95 group",
                allFlipped 
                    ? "bg-linear-to-br from-cyan-600 to-cyan-800 text-white shadow-[0_4px_30px_rgba(0,140,200,0.5)]" 
                    : "bg-linear-to-br from-yellow-400 to-orange-500 text-blue-950 shadow-[0_4px_30px_rgba(255,180,0,0.5)]"
            )}
          >

            <span className="relative z-10">{allFlipped ? "닫기" : "🏆 전체 공개"}</span>
            <div className="absolute top-[-50%] left-[-60%] w-[40%] h-[200%] bg-linear-to-r from-transparent via-white/30 to-transparent animate-[btnShimmer-mom_3s_linear_infinite]"></div>

          </button>

        </div>

        <footer className="text-center py-6 text-[10px] tracking-[3px] text-white/10 font-['Cinzel'] font-bold mt-auto">
          SOOP FC · MOM SYSTEM · SINCE 2026
        </footer>
      </div>

      <canvas ref={celebrationCanvasRef} className="absolute inset-0 z-50 pointer-events-none hidden"></canvas>

    </div>
  );
}

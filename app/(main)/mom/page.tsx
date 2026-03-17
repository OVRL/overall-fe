"use client";

import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { INITIAL_PLAYERS } from "@/data/players";
import { cn } from "@/lib/utils";

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
  // INITIAL_PLAYERS에서 임의의 3명 추출
  const shuffled = [...INITIAL_PLAYERS].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);
  
  // 가공 (MOM용 임의 데이터 추가)
  const votes = [78, 58, 34]; // 예시 투표율
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
    image: p.image,
  }));
};

// ──────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────
export default function MOMSelectionPage() {
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

  const handleMainBtn = () => {
    if (!allFlipped) {
      [0, 1, 2].forEach((i) => flipCard(i));
    } else {
      window.location.href = "/home";
    }
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Noto+Sans+KR:wght@400;700;900&family=Cinzel:wght@700;900&display=swap');
        
        .bg-layer {
          position: fixed; inset: 0; z-index: 0;
          background: radial-gradient(ellipse 100% 80% at 50% 30%, #0b1a4a 0%, #050a1f 70%);
        }
        .bg-dots {
          position: fixed; inset: 0; z-index: 1;
          background-image: radial-gradient(circle, rgba(255,215,0,0.07) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .bg-lines {
          position: fixed; inset: 0; z-index: 2;
          background:
            linear-gradient(180deg, transparent 48%, rgba(0,180,220,0.04) 50%, transparent 52%),
            linear-gradient(90deg, transparent 48%, rgba(0,180,220,0.04) 50%, transparent 52%);
          background-size: 80px 80px;
        }
        
        @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:0.9} }
        @keyframes floatIn {
          from{opacity:0;transform:translateY(70px) scale(0.75)}
          to{opacity:1;transform:translateY(0) scale(1)}
        }
        @keyframes shimmerSweep{0%{left:-80%}100%{left:120%}}
        @keyframes rotateConic{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulseRing{0%,100%{opacity:0.12;transform:translate(-50%,-50%) scale(1)}50%{opacity:0.3;transform:translate(-50%,-50%) scale(1.07)}}
        @keyframes btnShimmer{0%{left:-60%}100%{left:140%}}
        @keyframes fadeDown{from{opacity:0;transform:translateY(-30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

        .card-inner {
          width:100%; height:100%;
          position:relative;
          transform-style: preserve-3d;
          transition: transform 1s cubic-bezier(.4,0,.2,1);
        }
        .flipped .card-inner { transform: rotateY(180deg); }

        .shimmer-active::before {
          content:''; position:absolute;
          top:-50%; left:-80%; width:55%; height:200%;
          background:linear-gradient(105deg,transparent 20%,rgba(255,215,0,0.38) 50%,transparent 80%);
          animation:shimmerSweep 2s linear infinite;
        }
        .shimmer-active::after {
          content:''; position:absolute;
          top:-50%; left:-80%; width:25%; height:200%;
          background:linear-gradient(105deg,transparent 20%,rgba(255,255,220,0.6) 50%,transparent 80%);
          animation:shimmerSweep 2s linear infinite 0.45s;
        }
      `}</style>

      <div className="bg-layer"></div>
      <div className="bg-dots"></div>
      <div className="bg-lines"></div>
      <canvas ref={particleCanvasRef} className="fixed inset-0 z-[3] pointer-events-none"></canvas>

      <div className="relative z-10 min-h-screen flex flex-col font-['Noto_Sans_KR'] text-white overflow-hidden">
        <header className="text-center py-10 px-4 animate-[fadeDown_0.8s_ease_both]">
          <div className="inline-flex items-center gap-2.5 bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-yellow-500/30 rounded-full px-5 py-1.5 mb-3.5">
            <span className="text-[12px] tracking-[4px] text-yellow-400 opacity-85 font-bold uppercase">⚽ SOOP FOOTBALL CLUB</span>
          </div>
          <h1 className="font-['Cinzel'] text-[clamp(2rem,5.5vw,3.6rem)] font-black tracking-widest text-white drop-shadow-[0_0_50px_rgba(255,215,0,0.5)] leading-tight">MAN OF THE MATCH</h1>
          <p className="mt-2 text-[13px] text-white/40 tracking-[2px]">이 주의 MOM 선정 · 카드를 클릭하여 공개</p>
          <div className="w-48 h-px mx-auto mt-4 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
        </header>

        <section className="flex-1 flex flex-col items-center justify-center py-6 px-4">
          <p className={cn(
            "text-[14px] text-white/40 mb-8 tracking-[2px] transition-all duration-500",
            allFlipped ? "animate-none text-green-400 font-bold" : "animate-[pulse_2s_infinite]"
          )}>
            {allFlipped ? "🎉 모든 MOM이 공개되었습니다!" : "▼ 카드를 선택하여 순위를 확인하세요 ▼"}
          </p>
          
          <div className="flex gap-[clamp(14px,3vw,36px)] justify-center flex-wrap">
            {[0, 1, 2].map((i) => {
              const p = momPlayers[i];
              if (!p) return null;
              const isFlipped = flippedSet.has(i);
              
              return (
                <div 
                  key={i} 
                  className={cn(
                    "relative perspective-[1200px] cursor-pointer animate-[floatIn_0.8s_cubic-bezier(.22,.68,0,1.4)_both]",
                    i === 0 ? "delay-100" : i === 1 ? "delay-[250ms]" : "delay-400",
                    isFlipped && "flipped"
                  )}
                  style={{ width: 'clamp(155px, 23vw, 215px)', height: 'clamp(250px, 36vw, 340px)' }}
                  onClick={() => flipCard(i)}
                >
                  <div className="card-inner w-full h-full relative">
                    {/* FRONT */}
                    <div className="card-face card-front absolute inset-0 rounded-[20px] bg-gradient-to-br from-[#0e1d50] via-[#071040] to-[#050d30] border-[1.5px] border-yellow-500/25 shadow-2xl overflow-hidden flex flex-col items-center justify-center gap-3.5 transition-all duration-300 backface-hidden hover:scale-[1.04] hover:-translate-y-2 hover:border-yellow-400 hover:shadow-[0_0_40px_rgba(255,215,0,0.55)]">
                      <div className="absolute top-3 left-3 w-9 h-9 border-t-2 border-l-2 border-yellow-500/40 rounded-tl-md"></div>
                      <div className="absolute top-3 right-3 w-9 h-9 border-t-2 border-r-2 border-yellow-500/40 rounded-tr-md"></div>
                      <div className="absolute bottom-3 left-3 w-9 h-9 border-b-2 border-l-2 border-yellow-500/40 rounded-bl-md"></div>
                      <div className="absolute bottom-3 right-3 w-9 h-9 border-b-2 border-r-2 border-yellow-500/40 rounded-br-md"></div>
                      
                      <div className="w-[82px] h-[82px] rounded-full bg-radial-[circle_at_38%_32%] from-cyan-400/20 to-cyan-800/10 border-2 border-cyan-400/50 flex items-center justify-center text-[34px] shadow-[0_0_22px_rgba(34,211,238,0.35)] relative">
                        {ORB_ICONS[i]}
                      </div>
                      <div className="text-[11px] tracking-[4px] text-cyan-400/80 font-bold">MOM CARD</div>
                      <div className="font-['Cinzel'] text-[34px] text-yellow-500/20 font-black">?</div>
                      <div className="text-[9px] tracking-[3px] text-yellow-500/25 font-bold">SOOP FC · 2026</div>
                    </div>

                    {/* BACK */}
                    <div className={cn(
                      "card-face card-back absolute inset-0 rounded-[20px] transform rotate-y-180 backface-hidden flex flex-col items-center justify-center gap-2.5 p-4 overflow-hidden shadow-2xl",
                      p.rank === 1 && "bg-gradient-to-br from-[#1a1200] to-[#0d0900] border-2 border-yellow-500",
                      p.rank === 2 && "bg-gradient-to-br from-[#131820] to-[#0a0f18] border-2 border-slate-400",
                      p.rank === 3 && "bg-gradient-to-br from-[#160c00] to-[#0e0700] border-2 border-amber-600"
                    )}>
                      {/* Shimmer & Pattern */}
                      <div className={cn("absolute inset-0 pointer-events-none rounded-[18px]", p.rank === 1 && "shimmer-active")}></div>
                      <div className={cn(
                        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-dashed animate-[pulseRing_2.5s_ease-in-out_infinite]",
                        p.rank === 1 ? "border-yellow-500/45 shadow-[0_0_30px_rgba(255,215,0,0.2)]" : p.rank === 2 ? "border-blue-300/35" : "border-amber-600/35"
                      )}></div>

                      {/* Rank Label */}
                      <div className={cn(
                        "font-['Cinzel'] text-[10px] tracking-[3px] px-3 py-1 rounded-full border relative z-2",
                        p.rank === 1 ? "bg-yellow-500/15 text-yellow-500 border-yellow-500/40" : p.rank === 2 ? "bg-blue-400/10 text-blue-200 border-blue-400/30" : "bg-amber-600/15 text-amber-500 border-amber-600/35"
                      )}>
                        {RANK_LABEL[p.rank - 1]}
                      </div>

                      {/* Player Avatar */}
                      <div className={cn(
                        "relative w-[110px] h-[110px] flex items-center justify-center z-10",
                        "before:absolute before:inset-0 before:bg-[url('/images/card-bgs/normal-blue.webp')] before:bg-cover before:bg-center before:rounded-[80px] before:opacity-80 before:border-2",
                        p.rank === 1 ? "before:border-yellow-500" : p.rank === 2 ? "before:border-slate-400" : "before:border-amber-600"
                      )}>
                        <img 
                          src={p.image} 
                          alt={p.name}
                          className="w-[100px] h-[100px] object-contain relative z-2 filter drop-shadow(0 5px 15px rgba(0,0,0,0.5))"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-black/80 px-2 py-0.5 rounded-md border border-white/20 text-[10px] font-black italic text-white z-10">
                          NO.{p.number}
                        </div>
                      </div>

                      {/* Player Info */}
                      <div className="text-center z-2 space-y-1">
                        <h2 className={cn(
                          "font-['Black_Han_Sans'] text-2xl drop-shadow-lg",
                          p.rank === 1 ? "text-yellow-400" : p.rank === 2 ? "text-blue-200" : "text-amber-500"
                        )}>
                          {p.name}
                        </h2>
                        <span className={cn(
                          "block text-[10px] tracking-[3px] uppercase opacity-70",
                          p.rank === 1 ? "text-yellow-500/80" : "text-white/60"
                        )}>
                          {p.position}
                        </span>
                      </div>

                      {/* Data Visual */}
                      <div className="w-full space-y-1.5 z-2">
                        <div className="flex items-center justify-between text-[10px] font-black text-white/40 px-1">
                            <span>득표율</span>
                            <span className="text-white">{p.votes}%</span>
                        </div>
                        <div className="w-full h-[3px] rounded-full bg-white/10 overflow-hidden relative">
                          <div 
                            className={cn(
                                "h-full rounded-full transition-all duration-[1400ms] delay-700",
                                p.rank === 1 ? "bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-200" : p.rank === 2 ? "bg-gradient-to-r from-blue-700 to-blue-300" : "bg-gradient-to-r from-amber-800 to-amber-400"
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

        <div className="text-center py-10 px-4 animate-[fadeUp_1s_1.2s_ease_both]">
          <button 
            onClick={handleMainBtn}
            className={cn(
                "relative overflow-hidden px-14 py-4 rounded-full font-['Black_Han_Sans'] text-xl tracking-widest transition-all duration-300 transform active:scale-95 group",
                allFlipped 
                    ? "bg-gradient-to-br from-cyan-600 to-cyan-800 text-white shadow-[0_4px_30px_rgba(0,140,200,0.5)]" 
                    : "bg-gradient-to-br from-yellow-400 to-orange-500 text-blue-950 shadow-[0_4px_30px_rgba(255,180,0,0.5)]"
            )}
          >
            <span className="relative z-10">{allFlipped ? "🏠 메인 페이지로" : "🏆 전체 공개"}</span>
            <div className="absolute top-[-50%] left-[-60%] w-[40%] h-[200%] bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[btnShimmer_3s_linear_infinite]"></div>
          </button>
        </div>

        <footer className="text-center py-6 text-[11px] tracking-[3px] text-white/10 font-['Cinzel'] font-bold">
          SOOP FC · MOM SYSTEM · SINCE 2026
        </footer>
      </div>

      <canvas ref={celebrationCanvasRef} className="fixed inset-0 z-[50] pointer-events-none hidden"></canvas>
    </>
  );
}

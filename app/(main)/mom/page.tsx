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
const RANK_LABEL = ["1위", "2위", "3위"];

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

export default function MOMPage() {
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

  // 비디오 폴백 로직
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
        // 원래 닫기 동작 또는 뒤로가기
        window.history.back();
    }
  };

  const clipPathStyle = {
    clipPath: "polygon(15% 0%, 85% 0%, 100% 12%, 100% 88%, 85% 100%, 15% 100%, 0% 88%, 0% 12%)"
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black overflow-hidden select-none">
      <style jsx global>{`
        @keyframes pulse-mom { 0%,100%{opacity:0.4} 50%{opacity:0.9} }
        @keyframes floatIn-mom {
          from{opacity:0;transform:translateY(70px) scale(0.75)}
          to{opacity:1;transform:translateY(0) scale(1)}
        }
        @keyframes shimmerSweep-mom{0%{left:-80%}100%{left:120%}}
        @keyframes rotateConic-mom{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulseRing-mom{0%,100%{opacity:0.12;transform:translate(-50%,-50%) scale(1)}50%{opacity:0.3;transform:translate(-50%,-50%) scale(1.07)}}
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
          clip-path: polygon(15% 0%, 85% 0%, 100% 12%, 100% 88%, 85% 100%, 15% 100%, 0% 88%, 0% 12%);
        }

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

      {/* 시네마틱 오프닝 영상 - 최상단 배치 */}
      {showVideo && (
        <div className="fixed inset-0 z-[10000] bg-black flex items-center justify-center">
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
          {/* 영상이 안나올 경우를 대비한 스킵 버튼 */}
          <button 
            onClick={() => { setShowVideo(false); setShowBoard(true); }}
            className="absolute bottom-10 right-10 z-[10001] text-white/50 hover:text-white transition-colors text-xs tracking-widest font-bold bg-black/60 px-6 py-3 rounded-full border border-white/20"
          >
            SKIP VIDEO
          </button>
        </div>
      )}

      <div className="absolute inset-0 z-0 bg-radial-[ellipse_100%_80%_at_50%_30%] from-[#0b1a4a] to-[#050a1f]"></div>
      <div className="absolute inset-0 z-1 bg-[radial-gradient(circle,rgba(255,215,0,0.07)_1px,transparent_1px)] bg-size-[28px_28px]"></div>
      <div className="absolute inset-0 z-2 bg-[linear-gradient(180deg,transparent_48%,rgba(0,180,220,0.04)_50%,transparent_52%),linear-gradient(90deg,transparent_48%,rgba(0,180,220,0.04)_50%,transparent_52%)] bg-size-[80px_80px]"></div>
      <canvas ref={particleCanvasRef} className="absolute inset-0 z-3 pointer-events-none"></canvas>

      <button 
        onClick={() => window.history.back()}
        className="absolute top-6 right-6 z-[110] w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-95 shadow-2xl"
      >
        <X size={24} />
      </button>

      <div className={cn(
        "relative z-10 min-h-screen flex flex-col font-['Noto_Sans_KR'] text-white overflow-y-auto transition-all duration-1000",
        showBoard ? "opacity-100 scale-100" : "opacity-0 invisible scale-110"
      )}>
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
            "text-[12px] md:text-[14px] text-white/40 mb-8 tracking-[2px] transition-all duration-500 font-bold",
            allFlipped ? "animate-none text-green-400" : "animate-[pulse-mom_2s_infinite]"
          )}>
            {allFlipped ? "🎉 모든 MOM이 공개되었습니다!" : "▼ 카드를 선택하여 순위를 확인하세요 ▼"}
          </p>
          
          <div className="flex gap-2.5 md:gap-[clamp(14px,3vw,36px)] justify-center flex-wrap max-w-5xl mx-auto px-2">
            {[0, 1, 2].map((i) => {
              const p = momPlayers[i];
              if (!p) return null;
              const isFlipped = flippedSet.has(i);
              
              const entryDelay = i === 2 ? "delay-300" : i === 1 ? "delay-600" : "delay-900";

              return (
                <div 
                  key={i} 
                  className={cn(
                    "relative perspective-distant cursor-pointer animate-[floatIn-mom_0.8s_cubic-bezier(.22,.68,0,1.4)_both]",
                    entryDelay,
                    isFlipped && "flipped-mom"
                  )}
                  style={{ 
                    width: 'clamp(170px, 25vw, 215px)', 
                    height: 'clamp(260px, 38vw, 340px)' 
                  }}
                  onClick={() => flipCard(i)}
                >
                  <div className="card-inner-mom w-full h-full relative">
                    {/* FRONT - 육각형 적용 */}
                    <div 
                        className="card-face absolute inset-0 premium-card-shape bg-linear-to-br from-[#0e1d50] via-[#071040] to-[#050d30] border-[1.5px] border-yellow-500/25 shadow-2xl overflow-hidden flex flex-col items-center justify-center gap-2 md:gap-3.5 transition-all duration-300 backface-hidden hover:scale-[1.04] hover:-translate-y-2 hover:border-yellow-400 hover:shadow-[0_0_40px_rgba(255,215,0,0.55)]"
                        style={clipPathStyle}
                    >
                      <div className="w-[45px] md:w-[82px] h-[45px] md:h-[82px] rounded-full bg-radial-[circle_at_38%_32%] from-cyan-400/20 to-cyan-800/10 border-2 border-cyan-400/50 flex items-center justify-center text-[18px] md:text-[34px] shadow-[0_0_22px_rgba(34,211,238,0.35)] relative">
                        {ORB_ICONS[i]}
                      </div>
                      <div className="text-[8px] md:text-[11px] tracking-[2px] md:tracking-[4px] text-cyan-400/80 font-bold">MOM CARD</div>
                      <div className="font-['Cinzel'] text-[24px] md:text-[34px] text-yellow-500/20 font-black">?</div>
                      <div className="text-[6px] md:text-[9px] tracking-[2px] md:tracking-[3px] text-yellow-500/25 font-bold">SOOP FC · 2026</div>
                    </div>

                    {/* BACK - 육각형 적용 */}
                    <div 
                        className={cn(
                            "card-face absolute inset-0 premium-card-shape transform rotate-y-180 backface-hidden flex flex-col p-0 overflow-hidden shadow-2xl transition-all duration-500",
                            "bg-black/60 backdrop-blur-sm"
                        )}
                        style={{
                            ...clipPathStyle,
                            border: `2px solid ${p.rank === 1 ? '#ffd700' : p.rank === 2 ? '#c0c0c0' : '#cd7f32'}`,
                            boxShadow: `0 0 30px ${p.rank === 1 ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.1)'}`
                        }}
                    >
                      {/* 배경 텍스처 - 항상 노출 */}
                      <div className="absolute inset-0 bg-[url('/images/card-bgs/normal-blue.webp')] bg-cover bg-center opacity-50 mix-blend-screen"></div>
                      
                      {/* 등급별 틴트 레이어 */}
                      <div className={cn(
                        "absolute inset-0 opacity-20 mix-blend-color",
                        p.rank === 1 ? "bg-yellow-500" : p.rank === 2 ? "bg-slate-300" : "bg-orange-600"
                      )}></div>
                      
                      <div className={cn("absolute inset-0 pointer-events-none", p.rank === 1 && "shimmer-active-mom")}></div>

                      {/* [중요] 오버럴 및 포지션 (상단 배치 - 원복) */}
                      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20 flex flex-col items-start translate-x-1 translate-y-1">
                        <span className="text-2xl md:text-4xl font-['Cinzel'] font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-none italic">98</span>
                        <span className="text-[8px] md:text-[10px] font-bold text-yellow-400 mt-0.5 md:mt-1 tracking-widest bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-sm">{p.position}</span>
                      </div>

                      {/* 중앙 선수 이미지 */}
                      <div className="flex-1 flex items-end justify-center relative mb-12 md:mb-16 px-4">
                        <img 
                          src={p.image} 
                          alt={p.name}
                          className="w-full h-full object-contain relative z-10 filter drop-shadow(0 15px 25px rgba(0,0,0,0.7)) translate-y-2 scale-110"
                        />
                      </div>

                      {/* [중요] 하단 이름 바 레이아웃 개편 (순위 | 이름 | 득표율%) */}
                      <div className="absolute bottom-4 left-0 w-full z-30 flex flex-col items-center">
                        <div className="w-[92%] h-10 md:h-14 flex items-center justify-between px-3 md:px-4 bg-black/85 backdrop-blur-xl border border-white/20 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] translate-y-1 overflow-hidden relative group">
                          {/* 등급별 좌측 강조 바 */}
                          <div className={cn(
                              "absolute left-0 top-0 w-1 md:w-1.5 h-full",
                              p.rank === 1 ? "bg-yellow-400" : p.rank === 2 ? "bg-slate-400" : "bg-orange-500"
                          )}></div>

                          {/* 좌측: 순위 */}
                          <div className="flex flex-col items-start min-w-[30px] md:min-w-[45px]">
                            <span className={cn(
                                "text-[7px] md:text-[10px] font-bold tracking-tighter opacity-70",
                                p.rank === 1 ? "text-yellow-400" : "text-white/60"
                            )}>RANK</span>
                            <span className="font-['Cinzel'] text-sm md:text-lg font-black text-white leading-none whitespace-nowrap">{RANK_LABEL[i]}</span>
                          </div>

                          {/* 중앙: 이름 */}
                          <div className="flex-1 text-center">
                            <h2 className="font-['Black_Han_Sans'] text-sm md:text-[20px] text-white tracking-widest leading-none drop-shadow-md truncate px-1">
                                {p.name}
                            </h2>
                          </div>

                          {/* 우측: 득표율% (포지션 대신 득표율 표시) */}
                          <div className="flex flex-col items-end min-w-[30px] md:min-w-[45px]">
                            <span className="text-[7px] md:text-[10px] font-bold tracking-tighter text-white/60 opacity-70">VOTES</span>
                            <span className="font-['Cinzel'] text-sm md:text-lg font-bold text-yellow-400 leading-none italic">{p.votes}%</span>
                          </div>
                        </div>
                      </div>

                      {/* 투표율 바 */}
                      <div className="absolute bottom-0 left-0 w-full h-1 md:h-1.5 bg-black/40">
                        <div 
                          className={cn(
                            "h-full transition-all duration-1400 delay-1000",
                            p.rank === 1 ? "bg-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.6)]" : p.rank === 2 ? "bg-blue-300" : "bg-orange-400"
                          )}
                          style={{ width: isFlipped ? `${p.votes}%` : '0%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="text-center py-8 px-4 animate-[fadeUp-mom_1s_1.2s_ease_both]">
          <button 
            onClick={handleMainBtn}
            className={cn(
                "relative overflow-hidden px-10 md:px-14 py-3 md:py-4 rounded-full font-['Black_Han_Sans'] text-lg md:text-xl tracking-widest transition-all duration-300 transform active:scale-95 group shadow-2xl",
                allFlipped 
                    ? "bg-linear-to-br from-cyan-600 to-cyan-800 text-white" 
                    : "bg-linear-to-br from-yellow-400 to-orange-500 text-blue-950"
            )}
          >
            <span className="relative z-10">{allFlipped ? "닫기" : "🏆 전체 공개"}</span>
            <div className="absolute top-[-50%] left-[-60%] w-[40%] h-[200%] bg-linear-to-r from-transparent via-white/30 to-transparent animate-[btnShimmer-mom_3s_linear_infinite]"></div>
          </button>
        </div>

        <footer className="text-center py-6 text-[10px] tracking-[3px] text-white/10 font-['Cinzel'] font-bold mt-auto mb-4">
          SOOP FC · MOM SYSTEM · SINCE 2026
        </footer>
      </div>

      <canvas ref={celebrationCanvasRef} className="absolute inset-0 z-50 pointer-events-none hidden"></canvas>
    </div>
  );
}

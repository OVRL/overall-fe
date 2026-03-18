"use client";

import React, { useEffect, useRef, useState } from "react";
import { INITIAL_PLAYERS } from "@/data/players";
import { cn } from "@/lib/utils";
import { X, Video } from "lucide-react";

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

// 보누치 카드 스타일의 정교한 8각형/육각형 조합 형태
const PREMIUM_CLIP_PATH = "polygon(50% 0%, 92% 10%, 100% 35%, 100% 70%, 92% 90%, 50% 100%, 8% 90%, 0% 70%, 0% 35%, 8% 10%)";

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
        /* 롤 스타일 낙하 애니메이션 */
        @keyframes fallIn-mom {
          from{opacity:0;transform:translateY(-150px) scale(1.1);filter:brightness(2) blur(10px);}
          to{opacity:1;transform:translateY(0) scale(1);filter:brightness(1) blur(0);}
        }
        @keyframes shimmerSweep-mom{0%{left:-80%}100%{left:120%}}
        @keyframes rotateConic-mom{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulseRing-mom{0%,100%{opacity:0.12;transform:translate(-50%,-50%) scale(1)}50%{opacity:0.3;transform:translate(-50%,-50%) scale(1.07)}}
        @keyframes btnShimmer-mom{0%{left:-60%}100%{left:140%}}
        @keyframes fadeDown-mom{from{opacity:0;transform:translateY(-30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeUp-mom{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes videoPulse-mom{0%,100%{opacity:0.3;transform:scale(1)}50%{opacity:0.6;transform:scale(1.1)}}

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
        .shimmer-active-mom::after {
          content:''; position:absolute;
          top:-50%; left:-80%; width:25%; height:200%;
          background:linear-gradient(105deg,transparent 20%,rgba(255,255,220,0.6) 50%,transparent 80%);
          animation:shimmerSweep-mom 2s linear infinite 0.45s;
        }
      `}</style>

      {/* 시네마틱 오프닝 영상 - 최상단 배치 */}
      {showVideo && (
        <div className="fixed inset-0 z-[10000] bg-black flex items-center justify-center overflow-hidden">
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
          
          {/* 영상 우측 하단 데코레이션 요소 */}
          <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 z-[10001] opacity-40 pointer-events-none flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[40px] md:text-[80px] font-black text-white/20 tracking-tighter leading-none italic select-none">VIDEO</span>
              <span className="text-[10px] md:text-[14px] font-bold text-primary/40 tracking-[0.5em] -mt-2">SOOP FC CINEMATIC</span>
            </div>
            <div className="w-16 h-16 md:w-32 md:h-32 rounded-full border-[8px] md:border-[16px] border-white/5 animate-[videoPulse-mom_4s_infinite] flex items-center justify-center">
                <Video size={40} className="text-white/10 hidden md:block" />
            </div>
          </div>

          <button 
            onClick={() => { setShowVideo(false); setShowBoard(true); }}
            className="absolute bottom-10 left-10 z-[10002] text-white/50 hover:text-white transition-colors text-xs tracking-widest font-bold bg-black/60 px-6 py-3 rounded-full border border-white/20"
          >
            SKIP VIDEO
          </button>
        </div>
      )}

      <div className="absolute inset-0 z-0 bg-radial-[ellipse_100%_80%_at_50%_30%] from-[#050c26] to-[#01040f]"></div>
      <div className="absolute inset-0 z-1 bg-[radial-gradient(circle,rgba(255,215,0,0.05)_1px,transparent_1px)] bg-size-[28px_28px]"></div>
      <canvas ref={particleCanvasRef} className="absolute inset-0 z-3 pointer-events-none"></canvas>

      <button 
        onClick={onClose}
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
          <h1 className="font-['Cinzel'] text-[clamp(1.8rem,5vw,3.6rem)] font-black tracking-widest text-white drop-shadow-[0_0_50px_rgba(255,215,0,0.4)] leading-tight">MAN OF THE MATCH</h1>
          <p className="mt-2 text-[11px] md:text-[13px] text-white/40 tracking-[2px]">이 주의 MOM 선정 · 카드를 클릭하여 공개</p>
        </header>

        <section className="flex-1 flex flex-col items-center justify-center py-6 px-4">
          <p className={cn(
            "text-[12px] md:text-[14px] text-white/40 mb-12 tracking-[2px] transition-all duration-500 font-bold",
            allFlipped ? "animate-none text-green-400" : "animate-[pulse-mom_2s_infinite]"
          )}>
            {allFlipped ? "🎉 모든 MOM이 공개되었습니다!" : "▼ 카드를 선택하여 순위를 확인하세요 ▼"}
          </p>
          
          <div className="flex gap-2.5 md:gap-[clamp(14px,3vw,36px)] justify-center flex-wrap max-w-5xl mx-auto px-2">
            {[0, 1, 2].map((i) => {
              const p = momPlayers[i];
              if (!p) return null;
              const isFlipped = flippedSet.has(i);
              
              // 3위(2) -> 2위(1) -> 1위(0) 순서로 애니메이션 적용 (딜레이 차등)
              const entryDelay = i === 2 ? "delay-300" : i === 1 ? "delay-600" : "delay-900";

              return (
                <div 
                  key={i} 
                  className={cn(
                    "relative perspective-distant cursor-pointer animate-[fallIn-mom_1s_cubic-bezier(.16,1,.3,1)_both]",
                    entryDelay,
                    isFlipped && "flipped-mom"
                  )}
                  style={{ 
                    width: 'clamp(180px, 26vw, 225px)', 
                    height: 'clamp(270px, 40vw, 360px)' 
                  }}
                  onClick={() => flipCard(i)}
                >
                  <div className="card-inner-mom w-full h-full relative">
                    {/* FRONT - 보누치 육각형 적용 */}
                    <div 
                        className="card-face absolute inset-0 premium-card-shape bg-linear-to-br from-[#0c1840] via-[#050b26] to-[#020514] border-[1.5px] border-yellow-500/25 shadow-2xl overflow-hidden flex flex-col items-center justify-center gap-2 md:gap-4 transition-all duration-300 backface-hidden hover:scale-[1.04] hover:-translate-y-2 hover:border-yellow-400 hover:shadow-[0_0_40px_rgba(255,215,0,0.5)]"
                    >
                      <div className="w-[50px] md:w-[90px] h-[50px] md:h-[90px] rounded-full bg-radial-[circle_at_38%_32%] from-cyan-400/20 to-transparent border border-cyan-400/30 flex items-center justify-center text-[20px] md:text-[38px] shadow-[0_0_25px_rgba(34,211,238,0.2)]">
                        {ORB_ICONS[i]}
                      </div>
                      <div className="text-[8px] md:text-[12px] tracking-[4px] text-cyan-400/60 font-black">PREMIUM</div>
                      <div className="font-['Cinzel'] text-[28px] md:text-[40px] text-yellow-500/10 font-black">MOM</div>
                    </div>

                    {/* BACK - 보누치 육각형 적용 */}
                    <div 
                        className={cn(
                            "card-face absolute inset-0 premium-card-shape transform rotate-y-180 backface-hidden flex flex-col p-0 overflow-hidden shadow-2xl transition-all duration-500",
                            "bg-linear-to-b from-[#0a1a45] to-[#02081a]" // GK 포메이션 느낌의 딥블루
                        )}
                        style={{
                            border: `2px solid ${p.rank === 1 ? '#ffd700' : p.rank === 2 ? '#c0c0c0' : '#cd7f32'}`,
                            boxShadow: `0 0 40px ${p.rank === 1 ? 'rgba(255,215,0,0.4)' : 'rgba(0,0,0,0.8)'}`
                        }}
                    >
                      {/* 배경 텍스처 */}
                      <div className="absolute inset-0 bg-[url('/images/card-bgs/normal-blue.webp')] bg-cover bg-center opacity-40 mix-blend-screen"></div>
                      
                      <div className={cn("absolute inset-0 pointer-events-none", p.rank === 1 && "shimmer-active-mom")}></div>

                      {/* [중요] 오버럴 및 포지션 (보누치 이미지 스타일 강조) */}
                      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20 flex flex-col items-start">
                        <span className="text-4xl md:text-6xl font-['Cinzel'] font-black text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] leading-none italic tracking-tighter">98</span>
                        <span className="text-[12px] md:text-[18px] font-black text-white/90 mt-1 md:mt-2 tracking-widest drop-shadow-lg">{p.position}</span>
                        <div className="w-8 md:w-12 h-[2px] bg-yellow-400 mt-2 md:mt-3 opacity-80"></div>
                      </div>

                      {/* 중앙 선수 이미지 */}
                      <div className="flex-1 flex items-end justify-center relative mb-14 md:mb-20 px-2">
                        <img 
                          src={p.image} 
                          alt={p.name}
                          className="w-full h-full object-contain relative z-10 filter drop-shadow(0 20px 30px rgba(0,0,0,0.8)) translate-y-2 scale-[1.15]"
                        />
                      </div>

                      {/* 하단 이름 바 */}
                      <div className="absolute bottom-6 left-0 w-full z-30 flex flex-col items-center">
                        <div className="w-[90%] h-12 md:h-16 flex items-center justify-between px-4 md:px-6 bg-linear-to-b from-blue-900/90 to-black/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.7)] translate-y-1">
                          <div className="flex flex-col items-start">
                            <span className="text-[8px] md:text-[10px] font-black text-yellow-400 tracking-tighter opacity-80">RANK</span>
                            <span className="font-['Cinzel'] text-sm md:text-xl font-black text-white leading-none italic">{RANK_LABEL[i]}</span>
                          </div>

                          <div className="flex-1 text-center">
                            <h2 className="font-['Black_Han_Sans'] text-base md:text-[22px] text-white tracking-widest leading-none drop-shadow-xl truncate px-2">
                                {p.name}
                            </h2>
                          </div>

                          <div className="flex flex-col items-end">
                            <span className="text-[8px] md:text-[10px] font-black text-white/40 tracking-tighter uppercase">Support</span>
                            <span className="font-['Cinzel'] text-sm md:text-xl font-black text-yellow-400 leading-none italic">{p.votes}%</span>
                          </div>
                        </div>
                      </div>

                      {/* 하단 금태 데코레이션 (보누치 카드 하단 느낌) */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 md:w-24 h-4 md:h-6 bg-yellow-500/20 backdrop-blur-sm border-t border-x border-yellow-500/40 rounded-t-lg z-40 flex items-center justify-center">
                          <div className="w-1 md:w-2 h-1 md:h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="text-center py-12 px-4 animate-[fadeUp-mom_1s_1.5s_ease_both]">
          <button 
            onClick={handleMainBtn}
            className={cn(
                "relative overflow-hidden px-12 md:px-18 py-4 md:py-5 rounded-xl font-['Black_Han_Sans'] text-xl md:text-2xl tracking-[0.3em] transition-all duration-300 transform active:scale-95 group shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10",
                allFlipped 
                    ? "bg-linear-to-br from-blue-600 to-indigo-900 text-white" 
                    : "bg-linear-to-br from-yellow-400 via-orange-500 to-yellow-600 text-black"
            )}
          >
            <span className="relative z-10">{allFlipped ? "COMPLETE" : "REVEAL ALL"}</span>
            <div className="absolute top-[-50%] left-[-60%] w-[40%] h-[200%] bg-linear-to-r from-transparent via-white/40 to-transparent animate-[btnShimmer-mom_2.5s_linear_infinite]"></div>
          </button>
        </div>

        <footer className="text-center py-8 text-[11px] tracking-[6px] text-white/10 font-['Cinzel'] font-black mt-auto uppercase">
          Soop Football Club · Man of the Match System
        </footer>
      </div>

      <canvas ref={celebrationCanvasRef} className="absolute inset-0 z-50 pointer-events-none hidden"></canvas>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { INITIAL_PLAYERS } from "@/data/players";
import { Trophy } from "lucide-react";

export default function PlayerPage({ params }: { params: Promise<{ name: string }> }) {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [queryImgUrl, setQueryImgUrl] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setPlayerName(decodeURIComponent(p.name)));
    // URL 파라미터 연동
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const imgFromUrl = urlParams.get("imgUrl");
      if (imgFromUrl) setQueryImgUrl(decodeURIComponent(imgFromUrl));
    }
  }, [params]);

  // 스크롤 및 등장 애니메이션 옵저버 연동
  useEffect(() => {
    if (!playerName) return;

    const generalIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("visible");
          e.target.querySelectorAll(".bar-fill").forEach((f: Element) => {
            const el = f as HTMLElement;
            setTimeout(() => {
              el.style.width = el.dataset.width || "0%";
            }, 60);
          });
        });
      },
      { threshold: 0.12 }
    );

    const pctIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("visible");

          if (e.target.id === "teamPctCard") {
            setTimeout(() => {
              const circle = document.getElementById("teamGaugeCircle");
              const text = document.getElementById("teamGaugeText");
              if (circle && text) {
                const overall = 95; // 팀 내 상위 % 예시 데이터
                const offset = 276.46 - (overall / 100) * 276.46;
                circle.style.strokeDashoffset = offset.toString();
                text.textContent = `상위 ${100 - overall}%`;
              }
              e.target.querySelectorAll(".mini-bar-fill").forEach((f: Element, i) => {
                const el = f as HTMLElement;
                setTimeout(() => {
                  el.style.width = el.dataset.width || "0%";
                }, 200 + i * 100);
              });
            }, 150);
          }
          if (e.target.id === "rankBarsCard") {
            e.target.querySelectorAll(".rank-bar-fill").forEach((f: Element, i) => {
              const el = f as HTMLElement;
              setTimeout(() => {
                el.style.width = el.dataset.width || "0%";
              }, 80 + i * 130);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    const checkElements = setInterval(() => {
      const animateElements = document.querySelectorAll(
        ".timeline-item, .partner-card, .achievement-item, .bar-row, .pct-card, .news-card"
      );
      if (animateElements.length > 0) {
        animateElements.forEach((el) => {
          if (el.classList.contains("pct-card")) pctIO.observe(el);
          else generalIO.observe(el);
        });
        clearInterval(checkElements);
      }
    }, 100);

    // Hero 요소 등장 딜레이 제어
    setTimeout(() => {
      ["heroBadge", "heroName", "heroPos", "heroStats"].forEach((i) =>
        document.getElementById(i)?.classList.add("visible")
      );
      document.getElementById("heroPlayerWrap")?.classList.add("visible");
    }, 120);

    return () => {
      clearInterval(checkElements);
      generalIO.disconnect();
      pctIO.disconnect();
    };
  }, [playerName]);

  if (!playerName) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00e5a0]"></div>
      </div>
    );
  }

  // 실제 선수 데이터 매핑 (INITIAL_PLAYERS 또는 기본값)
  const basePlayer = INITIAL_PLAYERS.find((p) => p.name === playerName);
  const player = basePlayer || {
    id: 999,
    name: playerName,
    position: "FW",
    number: 9,
    overall: 99,
    pace: 88,
    shooting: 92,
    passing: 85,
    dribbling: 94,
    defending: 50,
    physical: 80,
    season: "26",
    seasonType: "general",
    image: "/images/ovr.png",
  };

  const displayImage = queryImgUrl || player.image || "/images/ovr.png";
  const firstName = player.name.split(" ")[0];
  const lastName = player.name.split(" ").slice(1).join(" ") || player.name;
  const colorAccent = "#00e5a0";

  // 목업 데이터
  const yearsData = [
    { year: "20/21", goals: 11, ast: 7, shots: 72, dribbles: 118, mins: 2240 },
    { year: "21/22", goals: 22, ast: 20, shots: 88, dribbles: 132, mins: 2860 },
    { year: "22/23", goals: 23, ast: 21, shots: 90, dribbles: 141, mins: 2910 },
    { year: "23/24", goals: 24, ast: 11, shots: 95, dribbles: 138, mins: 2990 },
    { year: "24/25", goals: parseInt(player.shooting as any) ? Math.floor(parseInt(player.shooting as any)/3) : 28, ast: 11, shots: 98, dribbles: 74, mins: 2310 },
  ];
  const maxG = Math.max(...yearsData.map((y) => y.goals));

  const partners = [
    { name: "최규빈", pos: "MF", combos: 14 },
    { name: "이지석", pos: "FW", combos: 11 },
    { name: "조원빈", pos: "DF", combos: 9 },
    { name: "박정빈", pos: "MF", combos: 8 },
  ];

  const trophies = [
    { name: "연간 골", rank: "3위", year: "2024", icon: "⚽" },
    { name: "연속 출장", rank: "1위", year: "2024", icon: "🏃" },
    { name: "클린시트 합작", rank: "2위", year: "2023", icon: "🛡️" },
    { name: "미드필더 평점", rank: "2위", year: "2025", icon: "⭐" },
  ];

  const newsData = [
    { title: "2026년 2월 26일 MOM 수상", date: "2월 26일", tag: "MOM 투표", img: "/images/ovr.png" },
    { title: "2026년 1월 이달의 선수 선정 (퍼스트 팀)", date: "1월 11일", tag: "퍼스트 팀", img: "/images/ovr.png" },
    { title: "선발 출전하여 MOM을 수상했습니다.", date: "2025년 12월 3일", tag: "퍼스트 팀", img: "/images/ovr.png" },
    { title: "최근 3경기 연속 공격포인트 달성!", date: "2025년 11월 24일", tag: "퍼스트 팀", img: "/images/ovr.png" },
  ];

  return (
    <div id="player-detail-page">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        #player-detail-page {
          --bg: #080808;
          --surface: #111111;
          --surface2: #1a1a1a;
          --border: rgba(255,255,255,0.07);
          --accent: ${colorAccent};
          --accent2: #00b4ff;
          --gold: #ffd166;
          --text: #f0f0f0;
          --muted: #888888;
          --card-bg: rgba(255,255,255,0.03);
          background: var(--bg);
          color: var(--text);
          font-family: 'Noto Sans KR', sans-serif;
          overflow-x: hidden;
          min-height: 100vh;
        }
        
        #player-detail-page * { box-sizing: border-box; }
        
        /* HERO */
        .hero {
          height: 100vh; display: flex; flex-direction: column;
          justify-content: flex-end; align-items: flex-start;
          padding: 0 6vw 10vh; position: relative; overflow: hidden;
        }
        .hero-bg {
          position:absolute; inset:0;
          background: linear-gradient(160deg, #0a1628 0%, #050a12 50%, var(--bg) 100%); z-index:0;
        }
        .hero-bg::after {
          content:''; position:absolute; inset:0;
          background: radial-gradient(ellipse 60% 50% at 70% 30%, rgba(0,180,255,0.08) 0%, transparent 70%),
                      radial-gradient(ellipse 40% 60% at 20% 80%, rgba(0,229,160,0.06) 0%, transparent 60%);
        }
        .hero-grid {
          position:absolute; inset:0;
          background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size:60px 60px; z-index:0; opacity:0.6;
        }
        
        /* hero player photo */
        .hero-player-wrap {
          position: absolute; right: 0; bottom: 0; height: 92vh; z-index: 2;
          display: flex; align-items: flex-end;
          opacity: 0; transform: translateX(50px);
          transition: opacity 0.9s 0.3s ease, transform 0.9s 0.3s ease;
        }
        .hero-player-wrap.visible { opacity:1; transform:translateX(0); }
        .hero-player-wrap img.player-photo {
          height: 100%; max-width: 50vw;
          object-fit: contain; object-position: bottom right;
          filter: drop-shadow(-30px 0 80px rgba(0,180,255,0.2)); display: block;
        }
        
        .hero-number {
          font-family:'Bebas Neue',sans-serif; font-size:clamp(8rem,20vw,16rem);
          line-height:0.85; color:rgba(255,255,255,0.04);
          position:absolute; right:5vw; top:50%; transform:translateY(-50%); z-index:1; pointer-events:none;
        }
        
        .hero-content { position:relative; z-index:3; }
        
        .hero-badge {
          display:inline-flex; align-items:center; gap:8px;
          background:rgba(0,180,255,0.1); border:1px solid rgba(0,180,255,0.25);
          padding:6px 14px; border-radius:20px; font-size:0.75rem; color:#00b4ff; letter-spacing:0.08em;
          margin-bottom:20px; opacity:0; transform:translateY(20px); transition: opacity 0.6s 0.1s, transform 0.6s 0.1s;
        }
        .hero-badge.visible { opacity:1; transform:translateY(0); }
        
        .hero-name {
          font-family:'Bebas Neue',sans-serif; font-size:clamp(3.5rem,8vw,7rem);
          line-height:0.9; letter-spacing:0.04em; opacity:0; transform:translateY(30px);
          transition: opacity 0.7s 0.25s, transform 0.7s 0.25s; text-transform: uppercase;
        }
        .hero-name.visible { opacity:1; transform:translateY(0); }
        .hero-name span { color:var(--accent); display:block; }
        
        .hero-pos {
          font-size:0.82rem; color:var(--muted); letter-spacing:0.2em; text-transform:uppercase; margin-top:12px;
          opacity:0; transition: opacity 0.7s 0.4s;
        }
        .hero-pos.visible { opacity:1; }
        
        .hero-stat-row {
          display:flex; gap:36px; margin-top:36px; opacity:0; transform:translateY(20px);
          transition: opacity 0.7s 0.5s, transform 0.7s 0.5s;
        }
        .hero-stat-row.visible { opacity:1; transform:translateY(0); }
        .h-stat-val { font-family:'Bebas Neue',sans-serif; font-size:2.6rem; line-height:1; }
        .h-stat-val.primary { color:var(--accent); }
        .h-stat-lbl { font-size:0.7rem; color:var(--muted); letter-spacing:0.1em; margin-top:4px; font-weight: 500;}
        
        .scroll-hint {
          position:absolute; bottom:40px; left:50%; transform:translateX(-50%); z-index:10;
          display:flex; flex-direction:column; align-items:center; gap:8px; opacity:0.4;
        }
        .scroll-hint span { font-size:0.62rem; letter-spacing:0.2em; color:var(--muted); }
        .scroll-arrow { width:1px; height:40px; background:linear-gradient(to bottom,transparent,var(--muted)); animation:scrollPulse 1.8s infinite; }
        @keyframes scrollPulse { 0%,100%{transform:scaleY(1);opacity:0.4} 50%{transform:scaleY(1.4);opacity:0.9} }
        
        .back-btn {
          position:fixed; top:24px; left:24px; z-index:100;
          background:rgba(8,8,8,0.75); backdrop-filter:blur(14px);
          border:1px solid var(--border); color:var(--text); padding:10px 20px; border-radius:30px;
          font-size:0.85rem; cursor:pointer; font-weight: 500; transition:background 0.2s, color 0.2s;
          display:flex; align-items:center; gap:8px;
        }
        .back-btn:hover { background:rgba(30,30,30,0.95); color:var(--accent);}

        /* SECTIONS */
        .section { padding:100px 6vw; border-top:1px solid var(--border); }
        .section-label { font-size:0.75rem; font-weight:600; font-family:'Noto Sans KR', sans-serif; letter-spacing:0.2em; text-transform:uppercase; color:var(--accent); margin-bottom:12px; }
        .section-title { font-family:'Bebas Neue','Noto Sans KR',sans-serif; font-size:clamp(2.5rem,5vw,4rem); font-weight:700; letter-spacing:0.02em; line-height:1; margin-bottom:60px; text-transform: uppercase;}
        
        /* PERCENTILE (RANKINGS) */
        .percentile-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 20px; }
        @media(max-width:900px) { .percentile-grid { grid-template-columns:1fr; } }
        
        .pct-card {
          background:var(--card-bg); border:1px solid var(--border); border-radius:20px; padding:32px;
          position:relative; overflow:hidden; opacity:0; transform:translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease, border-color 0.25s;
        }
        .pct-card.visible { opacity:1; transform:translateY(0); }
        .pct-card:hover { border-color:rgba(255,255,255,0.11); }
        
        .pct-scope { font-size:0.7rem; font-weight:600; letter-spacing:0.15em; color:var(--muted); text-transform:uppercase; margin-bottom:8px; }
        .pct-title { font-size:1.1rem; font-weight:700; margin-bottom:28px; }
        
        .gauge-wrap { display:flex; align-items:center; justify-content:space-around; gap:36px; flex-wrap:wrap; }
        .gauge-stats { flex:1; display:flex; flex-direction:column; gap:16px; min-width:200px; }
        .gauge-row { display:flex; flex-direction:column; gap:6px; }
        .gauge-row-top { display:flex; justify-content:space-between; align-items:flex-end; }
        .gauge-row-top .gr-lbl { font-size:0.8rem; color:var(--muted); font-weight:600; }
        .gauge-row-top .gr-pct { font-family:'Bebas Neue',sans-serif; font-size:1.1rem; line-height:1;}
        .mini-bar-track { height:6px; background:rgba(255,255,255,0.06); border-radius:3px; overflow:hidden; }
        .mini-bar-fill { height:100%; border-radius:3px; width:0; transition:width 1.2s ease; }
        
        .rank-bars { display:flex; flex-direction:column; gap:20px; }
        .rank-bar-row { display:grid; grid-template-columns:130px 1fr 60px; gap:16px; align-items:center; }
        .rank-bar-lbl { font-size:0.85rem; color:var(--muted); font-weight:600; text-align:left;}
        .rank-bar-track { height:8px; background:rgba(255,255,255,0.05); border-radius:4px; overflow:hidden; }
        .rank-bar-fill { height:100%; border-radius:4px; width:0; transition:width 1.2s ease; }
        .rank-bar-val { font-family:'Noto Sans KR',sans-serif; font-size:0.9rem; text-align:right; font-weight:700; }
        @media(max-width:500px) { .rank-bar-row { grid-template-columns:80px 1fr 50px; } }
        
        /* TIMELINE */
        .timeline { position:relative; padding-left:0; margin-top:20px;}
        .timeline::before { content:''; position:absolute; left:0; top:0; bottom:0; width:1px; background:linear-gradient(to bottom,var(--accent),transparent); }
        .timeline-item { display:grid; grid-template-columns:80px 1fr; gap:0 32px; margin-bottom:32px; opacity:0; transform:translateX(-30px); transition: opacity 0.6s ease, transform 0.6s ease; }
        @media(max-width:600px) { .timeline-item { grid-template-columns:55px 1fr; gap:0 12px; } }
        .timeline-item.visible { opacity:1; transform:translateX(0); }
        .timeline-year { text-align:right; padding-right:32px; padding-top:4px; position:relative; color:var(--muted); font-size:0.85rem; letter-spacing:0.05em; font-weight:600;}
        .timeline-year::after { content:''; position:absolute; right:-5px; top:10px; width:9px; height:9px; border-radius:50%; background:var(--accent); box-shadow:0 0 12px var(--accent); }
        .timeline-card { background:var(--card-bg); border:1px solid var(--border); border-radius:16px; padding:24px; display:grid; grid-template-columns:repeat(auto-fit,minmax(80px,1fr)); gap:16px; position:relative; overflow:hidden; transition:border-color 0.25s; filter:drop-shadow(0 4px 10px rgba(0,0,0,0.2)); }
        .timeline-card:hover { border-color:rgba(0,229,160,0.3); }
        .timeline-card::before { content:''; position:absolute; left:0;top:0;bottom:0; width:4px; background:var(--accent); border-radius:0 2px 2px 0; }
        .t-stat { text-align:center; }
        .t-stat-val { font-family:'Bebas Neue',sans-serif; font-size:2.2rem; line-height:1; }
        .t-stat-val.hi { color:var(--gold); }
        .t-stat-lbl { font-size:0.7rem; color:var(--muted); letter-spacing:0.08em; margin-top:6px; font-weight:600; }
        .season-badge { position:absolute; top:12px; right:14px; font-size:0.65rem; color:var(--muted); letter-spacing:0.1em; }
        
        .bar-chart { display:flex; flex-direction:column; gap:16px; margin-top:10px;}
        .bar-row { display:grid; grid-template-columns:60px 1fr 50px; gap:16px; align-items:center; opacity:0; transform:translateX(-20px); transition: opacity 0.5s ease, transform 0.5s ease; }
        .bar-row.visible { opacity:1; transform:translateX(0); }
        .bar-year { font-size:0.85rem; color:var(--muted); text-align:right; font-weight:600;}
        .bar-track { height:10px; background:rgba(255,255,255,0.05); border-radius:5px; overflow:hidden; }
        .bar-fill { height:100%; border-radius:5px; width:0; transition:width 1s ease; background:linear-gradient(90deg,var(--accent),var(--accent2)); }
        .bar-val { font-family:'Bebas Neue',sans-serif; font-size:1.2rem; }
        
        /* PARTNERS */
        .partners-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:24px; }
        .partner-card { background:var(--card-bg); border:1px solid var(--border); border-radius:20px; padding:32px 24px; text-align:center; position:relative; overflow:hidden; opacity:0; transform:translateY(30px) scale(0.97); transition: opacity 0.6s ease, transform 0.6s ease, border-color 0.25s, box-shadow 0.25s; filter:drop-shadow(0 4px 10px rgba(0,0,0,0.1)); cursor:pointer;}
        .partner-card.visible { opacity:1; transform:translateY(0) scale(1); }
        .partner-card:hover { border-color:rgba(0,180,255,0.4); box-shadow:0 8px 40px rgba(0,180,255,0.12); z-index:2;}
        .partner-card::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at top,rgba(0,180,255,0.08),transparent 70%); }
        .partner-avatar { width:76px; height:76px; border-radius:50%; margin:0 auto 20px; border:2px solid var(--border); overflow:hidden; position:relative; display:flex; align-items:center; justify-content:center; background:var(--surface2); transition:border-color 0.3s; }
        .partner-card:hover .partner-avatar { border-color:var(--accent2); transform:scale(1.05); }
        .partner-avatar .p-ph { font-size:28px; }
        .partner-name { font-weight:800; font-size:1.05rem; margin-bottom:8px; }
        .partner-pos { font-size:0.75rem; color:var(--muted); letter-spacing:0.1em; margin-bottom:18px; font-weight:600;}
        .partner-combo { display:inline-flex; align-items:center; gap:6px; background:rgba(0,180,255,0.1); border:1px solid rgba(0,180,255,0.2); padding:6px 16px; border-radius:20px; font-size:0.75rem; color:var(--accent2); font-weight:700;}
        
        /* ACHIEVEMENTS */
        .achievements-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:20px; }
        .achievement-item { display:flex; align-items:center; gap:20px; padding:24px; border:1px solid var(--border); border-radius:16px; background:var(--card-bg); opacity:0; transform:translateY(20px); transition: opacity 0.5s ease, transform 0.5s ease, border-color 0.25s, box-shadow 0.2s; filter:drop-shadow(0 4px 8px rgba(0,0,0,0.1)); cursor:pointer;}
        .achievement-item.visible { opacity:1; transform:translateY(0); }
        .achievement-item:hover { border-color:rgba(255,209,102,0.3); transform:translateY(-3px); box-shadow:0 8px 30px rgba(255,209,102,0.1);}
        .ach-icon { width:52px; height:52px; border-radius:14px; background:rgba(255,209,102,0.1); border:1px solid rgba(255,209,102,0.2); display:flex; align-items:center; justify-content:center; font-size:1.5rem; flex-shrink:0; }
        .ach-name { font-weight:700; font-size:0.95rem; margin-bottom:6px; }
        .ach-year { font-size:0.8rem; color:var(--gold); font-weight:700; letter-spacing:0.02em;}

        /* MOM NEWS CARDS */
        .news-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
        .news-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; display:flex; flex-direction:column; cursor:pointer; opacity:0; transform:translateY(20px); transition:opacity 0.5s ease, transform 0.3s ease, border-color 0.2s, box-shadow 0.3s; }
        .news-card.visible { opacity:1; transform:translateY(0); }
        .news-card:hover { transform:translateY(-6px); border-color: rgba(255,40,80,0.5); box-shadow: 0 12px 40px rgba(255,40,80,0.15); }
        .news-img { width: 100%; height: 200px; display:flex; align-items:center; justify-content:center; background: #222; overflow:hidden;}
        .news-img img { width:100%; height:100%; object-fit:cover; object-position:top; opacity:0.9; transition:transform 0.6s ease, opacity 0.3s; }
        .news-card:hover .news-img img { transform:scale(1.08); opacity:1; }
        .news-body { padding: 24px; flex: 1; display:flex; flex-direction:column; justify-content:space-between; gap:16px; background:linear-gradient(180deg, var(--surface), var(--bg)); }
        .news-title { font-size: 1.05rem; font-weight: 700; line-height: 1.5; word-break: keep-all; color:white; }
        .news-meta { display:flex; justify-content:space-between; align-items:flex-end; font-size: 0.8rem; color: var(--muted); font-weight:600;}
        .news-tag { color: #ff3355; display:flex; align-items:center; gap:6px; font-weight:700; letter-spacing:0.05em; margin-bottom: 8px;}
        .news-tag::before { content:'■'; font-size:0.55rem; color:#ff3355; }
        
        .detail-footer { padding:80px 6vw 40px; text-align:center; color:var(--muted); font-size:0.8rem; letter-spacing:0.1em; border-top:1px solid var(--border); margin-top:80px; font-weight:600;}
        
        @media(max-width:600px) {
          .hero { padding:0 5vw 8vh; }
          .hero-player-wrap { opacity:0.4; }
          .hero-stat-row { gap:20px; }
        }
      `,
        }}
      />

      <button className="back-btn" onClick={() => router.back()}>
        <Trophy className="w-4 h-4" /> 목록으로
      </button>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-number" id="heroNumber">
          {player.number || 9}
        </div>

        <div className="hero-player-wrap" id="heroPlayerWrap">
          <img
            className="player-photo"
            src={displayImage}
            alt={player.name}
            onError={(e) => {
              e.currentTarget.src = "/images/ovr.png";
            }}
          />
        </div>

        <div className="hero-content">
          <div className="hero-badge" id="heroBadge">
            <span>●</span>
            <span>OVR FC</span>
          </div>
          <div className="hero-name" id="heroName">
            {firstName}
            <br />
            <span>{lastName}</span>
          </div>
          <div className="hero-pos" id="heroPos">
            {player.position} · #{player.number || 9}
          </div>
          <div className="hero-stat-row" id="heroStats">
            <div>
              <div className="h-stat-val text-white">{player.shooting || 80}</div>
              <div className="h-stat-lbl">슈팅 (SHO)</div>
            </div>
            <div>
              <div className="h-stat-val text-white">{player.passing || 80}</div>
              <div className="h-stat-lbl">패스 (PAS)</div>
            </div>
            <div>
              <div className="h-stat-val">
                <span className="primary">{player.overall || 99}</span>
              </div>
              <div className="h-stat-lbl">오버롤 (OVR)</div>
            </div>
            <div>
              <div className="h-stat-val text-white">{player.pace || 80}</div>
              <div className="h-stat-lbl">스피드 (PAC)</div>
            </div>
          </div>
        </div>

        <div className="scroll-hint">
          <span>SCROLL</span>
          <div className="scroll-arrow" />
        </div>
      </section>

      {/* RANKINGS */}
      <section className="section">
        <div className="section-label">RANKINGS</div>
        <div className="section-title">팀 내 순위</div>
        <div className="percentile-grid">
          {/* 팀 내 상위 가우지 */}
          <div className="pct-card" id="teamPctCard">
            <div className="pct-scope">WITHIN TEAM</div>
            <div className="pct-title text-white">종합 평점 상위</div>
            <div className="gauge-wrap">
              <svg width="110" height="110" viewBox="0 0 110 110" style={{ flexShrink: 0 }}>
                <circle cx="55" cy="55" r="44" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                <circle
                  id="teamGaugeCircle"
                  cx="55"
                  cy="55"
                  r="44"
                  fill="none"
                  stroke={colorAccent}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="276.46"
                  strokeDashoffset="276.46"
                  transform="rotate(-90 55 55)"
                  style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.17,.67,.35,1)" }}
                />
                <text
                  id="teamGaugeText"
                  x="55"
                  y="62"
                  textAnchor="middle"
                  fontFamily="'Bebas Neue',sans-serif"
                  fontSize="22"
                  fill={colorAccent}
                >
                  —
                </text>
              </svg>
              <div className="gauge-stats">
                {[
                  { label: "시즌 득점", pct: 90 },
                  { label: "유효 슈팅률", pct: 85 },
                  { label: "공간 침투", pct: 95 },
                ].map((s) => (
                  <div className="gauge-row" key={s.label}>
                    <div className="gauge-row-top">
                      <span className="gr-lbl">{s.label}</span>
                      <span className="gr-pct" style={{ color: colorAccent }}>
                        상위 {100 - s.pct}%
                      </span>
                    </div>
                    <div className="mini-bar-track">
                      <div
                        className="mini-bar-fill"
                        data-width={`${s.pct}%`}
                        style={{ background: `linear-gradient(90deg, ${colorAccent}, var(--accent2))` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 항목별 팀 내 순위 바 */}
          <div className="pct-card" id="rankBarsCard">
            <div className="pct-scope">TEAM CATEGORY RANK</div>
            <div className="pct-title text-white">항목별 팀 내 순위</div>
            <div className="rank-bars">
              {[
                { label: "시즌 득점", rank: "1위", pct: 98, color: colorAccent },
                { label: "어시스트", rank: "3위", pct: 85, color: "#00b4ff" },
                { label: "드리블 성공", rank: "2위", pct: 92, color: "#ffd166" },
                { label: "출전 시간", rank: "4위", pct: 75, color: colorAccent },
              ].map((r) => (
                <div className="rank-bar-row" key={r.label}>
                  <div className="rank-bar-lbl">{r.label}</div>
                  <div className="rank-bar-track">
                    <div
                      className="rank-bar-fill"
                      data-width={`${r.pct}%`}
                      style={{ background: `linear-gradient(90deg, ${r.color}, ${r.color}80)` }}
                    />
                  </div>
                  <div className="rank-bar-val" style={{ color: r.color }}>
                    {r.rank}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CAREER RECORDS */}
      <section className="section">
        <div className="section-label">CAREER RECORDS</div>
        <div className="section-title">연도별 기록</div>
        <div style={{ marginBottom: "60px" }}>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--muted)",
              letterSpacing: "0.15em",
              marginBottom: "20px",
              fontWeight: 600,
            }}
          >
            GOALS PER SEASON
          </div>
          <div className="bar-chart" id="goalBarChart">
            {yearsData.map((y) => {
              const pct = Math.round((y.goals / maxG) * 100);
              return (
                <div className="bar-row" key={y.year}>
                  <div className="bar-year">{y.year}</div>
                  <div className="bar-track">
                    <div className="bar-fill" data-width={`${pct}%`}></div>
                  </div>
                  <div className="bar-val text-white">{y.goals}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="timeline" id="timeline">
          {[...yearsData].reverse().map((y) => {
            const hi = y.goals === maxG;
            return (
              <div className="timeline-item" key={y.year}>
                <div className="timeline-year">{y.year}</div>
                <div className="timeline-card">
                  <div className="season-badge">{y.year} 시즌</div>
                  <div className="t-stat">
                    <div className={`t-stat-val ${hi ? "hi" : "text-white"}`}>{y.goals}</div>
                    <div className="t-stat-lbl">GOALS</div>
                  </div>
                  <div className="t-stat">
                    <div className="t-stat-val text-white">{y.ast}</div>
                    <div className="t-stat-lbl">ASSISTS</div>
                  </div>
                  <div className="t-stat">
                    <div className="t-stat-val text-white">{y.shots}</div>
                    <div className="t-stat-lbl">SHOTS</div>
                  </div>
                  <div className="t-stat">
                    <div className="t-stat-val text-white">{y.dribbles}</div>
                    <div className="t-stat-lbl">DRIBBLES</div>
                  </div>
                  <div className="t-stat">
                    <div className="t-stat-val text-white">{Math.floor(y.mins / 90)}</div>
                    <div className="t-stat-lbl">GAMES</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CHEMISTRY */}
      <section className="section">
        <div className="section-label">CHEMISTRY</div>
        <div className="section-title">베스트 파트너</div>
        <div className="partners-grid">
          {partners.map((pt) => (
            <div className="partner-card" key={pt.name}>
              <div className="partner-avatar">
                <div className="p-ph">🏃</div>
              </div>
              <div className="partner-name text-white">{pt.name}</div>
              <div className="partner-pos">{pt.pos}</div>
              <div className="partner-combo">🤝 {pt.combos}번 합작</div>
            </div>
          ))}
        </div>
      </section>

      {/* HONOURS */}
      <section className="section">
        <div className="section-label">HONOURS</div>
        <div className="section-title">연도별 주요 기록</div>
        <div className="achievements-grid">
          {trophies.map((a, i) => (
            <div className="achievement-item" key={i}>
              <div className="ach-icon">{a.icon}</div>
              <div>
                <div className="ach-name text-white">
                  {a.year}년도 {a.name}
                </div>
                <div className="ach-year">{a.rank}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MOM AWARDS / LATEST NEWS */}
      <section className="section" style={{ borderTop: "none" }}>
        <div className="section-label">MOM AWARDS</div>
        <div className="section-title">최신 수상 내역</div>
        <div className="news-grid">
          {newsData.map((news, i) => (
            <div className="news-card" key={i}>
              <div className="news-img">
                {/* 
                  사용자가 제공한 레퍼런스 이미지 스타일 
                  (news.img가 실제로 없거나 깨질 경우를 대비해 object-fit 처리)
                */}
                <img src={news.img} alt={news.title} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span style="opacity:0.6;font-size:32px;">📸</span>'; }} />
              </div>
              <div className="news-body">
                <div>
                  <div className="news-tag">{news.tag}</div>
                  <div className="news-title">{news.title}</div>
                </div>
                <div className="news-meta">
                  <span>퍼스트 팀</span>
                  <span>⏱️ {news.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="detail-footer">
        DATA UPDATED · LIVE SYNC · ⚽ {new Date().getFullYear()} OVR FC STATS
      </div>
    </div>
  );
}

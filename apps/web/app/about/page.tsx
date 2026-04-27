"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/ui/Footer";

// ─── useInView Hook ─────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ─── AnimatedCounter ─────────────────────────────────────────────
function AnimatedCounter({
  target,
  suffix = "",
  duration = 2000,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useInView();

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [visible, target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Section Wrapper ─────────────────────────────────────────────
function Section({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.8s cubic-bezier(0.25,1,0.5,1), transform 0.8s cubic-bezier(0.25,1,0.5,1)",
      }}
      className={className}
    >
      {children}
    </div>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────
const features = [
  {
    icon: "⚽",
    title: "팀 관리",
    desc: "감독부터 선수까지, 팀 구성원의 역할과 정보를 한 곳에서 체계적으로 관리하세요.",
  },
  {
    icon: "📊",
    title: "경기 기록",
    desc: "경기 결과, 득점자, 어시스트까지 상세한 경기 데이터를 자동으로 누적 집계합니다.",
  },
  {
    icon: "🏆",
    title: "MOM 투표",
    desc: "매 경기 후 팀원 모두가 참여하는 맨 오브 더 매치 투표로 팀 분위기를 끌어올리세요.",
  },
  {
    icon: "⭐",
    title: "베스트 11",
    desc: "감독이 직접 선정하는 최고의 선발 라인업. 포메이션과 포지션을 시각적으로 구성하세요.",
  },
  {
    icon: "📈",
    title: "통계 분석",
    desc: "시즌별, 쿼터별 개인 및 팀 통계를 한눈에 파악하고 전략 수립에 활용하세요.",
  },
  {
    icon: "🤖",
    title: "AI 지원",
    desc: "AI 기반 경기 분석과 포메이션 추천으로 팀의 전술적 역량을 한 단계 높이세요.",
  },
];

// ─── Main Page ─────────────────────────────────────────────────────
export default function AboutPage() {
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    // 약간의 딜레이 후 Hero 등장
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-dvh bg-black text-white overflow-x-hidden">
      {/* ─── Hero Section ─── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-16 pb-24 text-center overflow-hidden">
        {/* 배경 그라디언트 */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(34,197,94,0.12) 0%, transparent 70%)",
          }}
        />

        {/* 배경 파티클(구체들) */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="pointer-events-none absolute rounded-full animate-float"
            style={{
              width: `${8 + (i % 4) * 8}px`,
              height: `${8 + (i % 4) * 8}px`,
              background: `rgba(34,197,94,${0.04 + (i % 3) * 0.04})`,
              left: `${(i * 8.3) % 95}%`,
              top: `${(i * 13.7) % 85}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${4 + (i % 4)}s`,
            }}
          />
        ))}

        {/* 축구공 캐릭터 이미지 */}
        <div
          className="relative mb-8 transition-all duration-1000"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.9)",
          }}
        >
          <Image
            src="/images/soccer_chibi_squad.webp"
            alt="Overall 캐릭터"
            width={220}
            height={160}
            className="mx-auto drop-shadow-2xl"
            style={{
              filter: "drop-shadow(0 0 40px rgba(34,197,94,0.35))",
            }}
          />
        </div>

        {/* 로고 뱃지 */}
        <div
          className="mb-6 transition-all duration-700"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "200ms",
          }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-green-600/30 bg-green-600/10 px-4 py-1.5 text-xs font-semibold text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            축구팀을 위한 올인원 플랫폼
          </span>
        </div>

        {/* 메인 헤드라인 */}
        <div
          className="mb-6 transition-all duration-700 flex justify-center"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "350ms",
          }}
        >
          <Image
            src="/icons/logo_OVRx3.png"
            alt="Overall Logo"
            width={320}
            height={80}
            className="w-48 sm:w-64 md:w-80 h-auto"
          />
        </div>

        <p
          className="max-w-lg text-base sm:text-lg text-gray-400 leading-relaxed transition-all duration-700"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "500ms",
          }}
        >
          팀 관리부터 경기 기록, AI 분석까지.
          <br />
          당신의 축구팀을 위한 모든 것이 여기 있습니다.
        </p>


        <div
          className="mt-10 flex flex-col sm:flex-row gap-3 transition-all duration-700"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "650ms",
          }}
        >
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-2xl bg-green-600 px-8 py-4 text-sm font-bold text-black transition-all hover:bg-green-500 hover:scale-105 active:scale-95"
          >
            지금 시작하기 →
          </Link>
          <Link
            href="/partnership"
            className="inline-flex items-center justify-center rounded-2xl border border-gray-800 bg-surface-secondary px-8 py-4 text-sm font-bold text-gray-300 transition-all hover:border-gray-600 hover:scale-105 active:scale-95"
          >
            제휴 신청
          </Link>
        </div>

        {/* 스크롤 힌트 */}
        <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-all duration-700"
          style={{
            opacity: heroVisible ? 1 : 0,
            transitionDelay: "900ms",
          }}
        >
          <span className="text-xs text-gray-600">스크롤해서 더 보기</span>
          <div className="h-8 w-0.5 bg-linear-to-b from-gray-600 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ─── Brand Story Section ─── */}
      <section className="px-4 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <Section className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold tracking-widest text-green-400 uppercase">
              Our Story
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
              축구를 더 스마트하게,
              <br />
              더 함께.
            </h2>
          </Section>

          <div className="grid gap-8 md:grid-cols-2 items-center">
            <Section delay={100}>
              <div className="space-y-4 text-gray-400 leading-relaxed text-sm md:text-base">
                <p>
                  오버롤(Overall)은 아마추어 축구팀의 고충에서 시작되었습니다. 
                  선수 관리는 단체 카톡방에서, 경기 기록은 메모장에서, 
                  통계는 엑셀에서. 이 불편함을 해소하고 싶었습니다.
                </p>
                <p>
                  <span className="text-white font-semibold">팀이 있는 곳에 Overall이 있습니다.</span>{" "}
                  감독부터 막내 선수까지 모든 팀원이 하나의 플랫폼에서 
                  소통하고, 성장하고, 이겨낼 수 있도록 만들었습니다.
                </p>
                <p>
                  경기장 밖에서의 준비가 경기장 안에서의 결과를 만듭니다. 
                  Overall과 함께라면 그 준비가 더 쉬워집니다.
                </p>
              </div>
            </Section>

            <Section delay={200}>
              <div className="relative rounded-3xl overflow-hidden border border-border-card bg-surface-secondary p-6">
                <Image
                  src="/images/team_squad_picture.webp"
                  alt="Team Squad"
                  width={600}
                  height={360}
                  className="rounded-2xl w-full object-cover"
                  style={{
                    filter: "brightness(0.85) saturate(1.1)",
                  }}
                />
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(34,197,94,0.08) 0%, transparent 100%)",
                  }}
                />
              </div>
            </Section>
          </div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section className="px-4 py-24 md:py-32 bg-surface-primary/40">
        <div className="mx-auto max-w-5xl">
          <Section className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold tracking-widest text-green-400 uppercase">
              Features
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">
              팀 운영의 모든 것
            </h2>
            <p className="mt-4 text-gray-400 max-w-md mx-auto">
              Overall이 제공하는 강력한 기능들로 팀을 한 단계 업그레이드하세요.
            </p>
          </Section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feat, i) => (
              <Section key={feat.title} delay={i * 80}>
                <div className="group relative rounded-2xl border border-border-card bg-surface-secondary p-6 transition-all hover:border-green-600/30 hover:bg-surface-elevated hover:-translate-y-1">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-600/10 text-2xl transition-transform group-hover:scale-110">
                    {feat.icon}
                  </div>
                  <h3 className="mb-2 text-base font-bold text-white">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {feat.desc}
                  </p>
                  {/* 호버 글로우 */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: "radial-gradient(circle at 30% 20%, rgba(34,197,94,0.06) 0%, transparent 60%)",
                    }}
                  />
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats Section ─── */}
      <section className="px-4 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <Section className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold tracking-widest text-green-400 uppercase">
              Numbers
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-green-500">
              숫자로 보는 Overall
            </h2>
          </Section>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "등록 팀", target: 247, suffix: "+" },
              { label: "활성 회원", target: 3800, suffix: "+" },
              { label: "기록된 경기", target: 1200, suffix: "+" },
              { label: "MOM 투표", target: 15000, suffix: "+" },
            ].map((stat, i) => (
              <Section key={stat.label} delay={i * 100}>
                <div className="rounded-2xl border border-border-card bg-surface-secondary p-6 text-center">
                  <div className="text-3xl sm:text-4xl font-black text-green-400">
                    <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{stat.label}</p>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="relative px-4 py-32 md:py-40 overflow-hidden text-center">
        {/* 동적 축구 배경 */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* 잔디 라인 패턴 */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(34,197,94,1) 60px, rgba(34,197,94,1) 61px)",
            }}
          />
          {/* 중앙 원 */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-green-600/8 opacity-60" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-green-600/6" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[12px] h-[12px] -ml-[6px] -mt-[6px] rounded-full bg-green-600/20" />
          {/* 페널티 박스 */}
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[340px] h-[140px] border-t border-l border-r border-green-600/8" />
          {/* 그라디언트 글로우 */}
          <div className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 80% 50% at 50% 60%, rgba(34,197,94,0.10) 0%, transparent 70%)",
            }}
          />
          {/* 떠다니는 축구공들 */}
          {[
            { size: 28, left: "8%", top: "15%", delay: 0, dur: 7 },
            { size: 18, left: "18%", top: "70%", delay: 1.2, dur: 5.5 },
            { size: 22, left: "78%", top: "20%", delay: 0.5, dur: 6 },
            { size: 14, left: "88%", top: "65%", delay: 2, dur: 8 },
            { size: 32, left: "50%", top: "8%", delay: 0.8, dur: 6.5 },
            { size: 16, left: "35%", top: "80%", delay: 1.8, dur: 7.5 },
            { size: 20, left: "65%", top: "75%", delay: 3, dur: 5 },
          ].map((b, i) => (
            <div key={i} className="absolute animate-soccer-float"
              style={{
                left: b.left, top: b.top,
                width: b.size, height: b.size,
                animationDelay: `${b.delay}s`,
                animationDuration: `${b.dur}s`,
              }}
            >
              {/* 축구공 SVG */}
              <svg viewBox="0 0 100 100" className="w-full h-full opacity-20">
                <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(34,197,94,0.8)" strokeWidth="3" />
                <circle cx="50" cy="50" r="48" fill="rgba(34,197,94,0.05)" />
                <polygon points="50,18 62,30 58,46 42,46 38,30" fill="rgba(34,197,94,0.4)" stroke="rgba(34,197,94,0.6)" strokeWidth="2" />
                <polygon points="22,36 38,30 42,46 30,56 16,48" fill="rgba(34,197,94,0.25)" stroke="rgba(34,197,94,0.5)" strokeWidth="2" />
                <polygon points="78,36 84,48 70,56 58,46 62,30" fill="rgba(34,197,94,0.25)" stroke="rgba(34,197,94,0.5)" strokeWidth="2" />
                <polygon points="30,56 42,46 58,46 70,56 62,72 38,72" fill="rgba(34,197,94,0.3)" stroke="rgba(34,197,94,0.5)" strokeWidth="2" />
                <polygon points="16,48 30,56 38,72 24,80 12,68" fill="rgba(34,197,94,0.2)" stroke="rgba(34,197,94,0.4)" strokeWidth="2" />
                <polygon points="84,48 88,68 76,80 62,72 70,56" fill="rgba(34,197,94,0.2)" stroke="rgba(34,197,94,0.4)" strokeWidth="2" />
              </svg>
            </div>
          ))}
        </div>

        {/* 콘텐츠 */}
        <Section className="relative z-10 space-y-6 max-w-2xl mx-auto">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/soccer_chibi_squad.webp"
              alt="Character squad"
              width={260}
              height={170}
              className="drop-shadow-2xl"
              style={{ filter: "drop-shadow(0 0 40px rgba(34,197,94,0.3))" }}
            />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black leading-tight">
            지금 바로 팀을<br />
            <span style={{
              background: "linear-gradient(135deg, #22c55e 0%, #86efac 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>만들어보세요</span>
          </h2>
          <p className="text-gray-400 text-base max-w-md mx-auto leading-relaxed">
            Overall과 함께라면 팀 운영이 즐거워집니다.<br />
            오늘부터 스마트한 축구팀 관리를 시작하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-2xl bg-green-600 px-10 py-4 text-base font-bold text-black transition-all hover:bg-green-500 hover:scale-105 active:scale-95 shadow-xl shadow-green-600/20"
            >
              지금 시작하기 →
            </Link>
            <Link
              href="/partnership"
              className="inline-flex items-center justify-center rounded-2xl border border-gray-700 px-10 py-4 text-base font-bold text-gray-300 transition-all hover:border-gray-500 hover:scale-105 active:scale-95"
            >
              제휴 문의하기
            </Link>
          </div>
        </Section>
      </section>

      {/* ─── Footer ─── */}
      <Footer />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }

        @keyframes soccer-float {
          0%   { transform: translateY(0px) rotate(0deg)   scale(1); }
          33%  { transform: translateY(-18px) rotate(120deg) scale(1.05); }
          66%  { transform: translateY(-8px)  rotate(240deg) scale(0.97); }
          100% { transform: translateY(0px) rotate(360deg) scale(1); }
        }
        .animate-soccer-float {
          animation: soccer-float linear infinite;
        }
      `}</style>
    </div>
  );
}

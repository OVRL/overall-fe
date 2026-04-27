"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import localFont from "next/font/local";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";

const paperlogy = localFont({
  src: [
    { path: "../../../../styles/fonts/Paperlogy/Paperlogy-7Bold.ttf", weight: "700", style: "normal" },
    { path: "../../../../styles/fonts/Paperlogy/Paperlogy-9Black.ttf", weight: "900", style: "normal" },
  ],
  display: "swap",
  variable: "--font-paperlogy",
});

export default function InvitePageClient({ code }: { code: string }) {
  const router = useRouter();
  const dispatched = useRef(false);

  useEffect(() => {
    if (dispatched.current) return;
    dispatched.current = true;
    // 초대 코드를 전역 이벤트로 브로드캐스트 → LandingStartForm이 수신해 자동 실행
    window.dispatchEvent(new CustomEvent("ovr:invite", { detail: { code } }));
  }, [code]);

  return (
    <main
      className={`h-dvh max-h-dvh pt-safe font-sans ${paperlogy.variable} ${paperlogy.className} flex min-h-0 flex-col w-full overflow-x-hidden overflow-y-hidden`}
    >
      <Header />
      <HeroSection initialInviteCode={code} />
    </main>
  );
}

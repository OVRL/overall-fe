import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/Link";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없음",
  description: "요청한 페이지가 존재하지 않습니다.",
};

export default function NotFound() {
  return (
    <main className="fixed inset-0 z-0 flex min-h-dvh w-full flex-col items-center justify-center overflow-x-hidden bg-[#000000] pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] pl-[max(1.25rem,env(safe-area-inset-left,0px))] pr-[max(1.25rem,env(safe-area-inset-right,0px))] pt-[max(1.5rem,env(safe-area-inset-top,0px))]">
      <div className="flex w-full max-w-[min(92vw,480px)] flex-col items-center gap-[clamp(0.75rem,3.5vmin,1.5rem)] text-center lg:max-w-[min(92vw,40rem)]">
        <div className="flex shrink-0 justify-center">
          <Image
            src="/images/not-found.webp"
            alt="404 — 페이지를 찾을 수 없음"
            width={210}
            height={499}
            className="h-auto w-75 object-contain object-center lg:w-125"
            priority
          />
        </div>
        <p className="text-xl lg:text-3xl font-medium leading-relaxed tracking-tight text-gray-600">
          페이지를 찾을 수 없습니다.
        </p>

        <Link
          href="/"
          className="text-primary text-sm font-medium underline underline-offset-4 hover:opacity-90"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </main>
  );
}

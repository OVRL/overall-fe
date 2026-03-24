import Link from "@/components/Link";

/** 마케팅 정보 수신 안내 (선택 동의 항목 상세) */
export default function MarketingNoticePage() {
  return (
    <div className="min-h-dvh bg-black text-Label-Primary pt-safe">
      <main className="px-4 py-6 md:py-10 md:max-w-layout md:mx-auto w-full">
        <div className="mb-8">
          <Link
            href="/privacy-consent"
            className="text-sm text-Label-AccentPrimary hover:opacity-90"
          >
            ← 약관 동의로
          </Link>
        </div>
        <article className="rounded-[1.25rem] border border-border-card bg-surface-card p-5 md:p-8 space-y-6">
          <h1 className="text-xl font-bold text-white">마케팅 정보 수신</h1>
          <p className="text-sm text-Label-Tertiary leading-relaxed">
            수신 채널, 빈도, 거부 방법 등을 법무 가이드에 맞게 작성해 주세요.
          </p>
        </article>
      </main>
    </div>
  );
}

import Link from "@/components/Link";

/** 이용약관 전문 (법무 검토 후 본문 교체) */
export default function TermsPage() {
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
          <h1 className="text-xl font-bold text-white">이용약관</h1>
          <p className="text-sm text-Label-Tertiary leading-relaxed">
            실제 약관 문구는 운영 정책에 맞게 등록해 주세요.
          </p>
        </article>
      </main>
    </div>
  );
}

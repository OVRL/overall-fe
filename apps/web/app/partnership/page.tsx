"use client";

import { useState, type FormEvent } from "react";
import Footer from "@/components/ui/Footer";
import Link from "next/link";
import { toast } from "sonner";

// 연락처 자동 포맷: 숫자만 추출 → 010-XXXX-XXXX
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

function isPhoneComplete(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}

const PARTNER_TYPES = [
  { id: "stadium", icon: "🏟️", label: "구장 제휴", desc: "풋살장 · 축구장 운영사" },
  { id: "brand", icon: "👕", label: "용품 브랜드", desc: "축구 용품 제조 · 유통사" },
  { id: "service", icon: "📱", label: "서비스 연동", desc: "스포츠 플랫폼 · 앱 서비스" },
];

function CheckIcon() {
  return (
    <svg className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function SpinIcon() {
  return (
    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default function PartnershipPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleType = (id: string) => {
    setSelectedTypes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const canSubmit =
    name.trim() &&
    isPhoneComplete(phone) &&
    agreePrivacy;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    const typeLabels = PARTNER_TYPES.filter(t => selectedTypes.has(t.id)).map(t => t.label);

    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email: `partnership+${Date.now()}@inquiry.ovr-log.com`,
          category: "partnership",
          title: `제휴 신청${typeLabels.length ? ` — ${typeLabels.join(", ")}` : ""}`,
          content: [
            `이름: ${name}`,
            `연락처: ${phone}`,
            `제휴 유형: ${typeLabels.length ? typeLabels.join(", ") : "미선택"}`,
            `마케팅 정보 수신 동의: ${agreeMarketing ? "동의" : "미동의"}`,
          ].join("\n"),
        }),
      });

      if (!res.ok) throw new Error("제출 실패");
      setSubmitted(true);
      toast.success("제휴 신청이 접수되었습니다.");
    } catch {
      toast.error("신청 접수에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-dvh flex-col bg-black">
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="mx-auto w-full max-w-md text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full"
                style={{ background: "radial-gradient(circle, rgba(34,197,94,0.15), transparent 70%)", border: "1px solid rgba(34,197,94,0.3)" }}>
                <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">신청이 완료되었습니다</h1>
              <p className="text-sm text-gray-500">
                제휴 신청이 접수되었습니다.<br />
                영업일 기준 1~3일 내에 연락드리겠습니다.
              </p>
            </div>
            <Link href="/"
              className="inline-flex items-center justify-center rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-green-500">
              홈으로 돌아가기
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-black">
      <main className="flex flex-1 flex-col items-center px-4 py-12 md:py-20">
        <div className="mx-auto w-full max-w-lg">
          <Link href="/"
            className="group mb-8 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-300">
            <svg className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            돌아가기
          </Link>

          {/* 헤더 */}
          <div className="mb-10">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-600/30 bg-green-600/10 px-3 py-1 text-xs font-semibold text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              파트너십 문의
            </span>
            <h1 className="mb-3 text-3xl font-black text-white md:text-4xl">제휴 신청</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Overall과 함께 더 큰 축구 생태계를 만들어 가실 파트너를 찾습니다.<br />
              아래 정보를 입력해 주시면 빠르게 연락드리겠습니다.
            </p>
          </div>

          {/* 제휴 유형 — 중복 선택 가능 */}
          <div className="mb-8">
            <p className="mb-3 text-sm font-medium text-gray-400">
              제휴 유형 <span className="text-gray-600 text-xs">(중복 선택 가능)</span>
            </p>
            <div className="grid grid-cols-3 gap-3">
              {PARTNER_TYPES.map((t) => {
                const active = selectedTypes.has(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleType(t.id)}
                    className={`relative flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all ${
                      active
                        ? "border-green-600/60 bg-green-600/10"
                        : "border-border-card bg-surface-secondary hover:border-gray-700"
                    }`}
                  >
                    {active && (
                      <div className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-green-600">
                        <CheckIcon />
                      </div>
                    )}
                    <span className="text-2xl">{t.icon}</span>
                    <div>
                      <p className={`text-xs font-bold ${active ? "text-green-400" : "text-gray-300"}`}>{t.label}</p>
                      <p className="text-[10px] text-gray-600 mt-0.5">{t.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 폼 */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* 이름 */}
            <fieldset className="flex flex-col gap-2">
              <label htmlFor="partner-name" className="text-sm font-medium text-Label-Secondary">
                이름 / 담당자 <span className="text-red-400">*</span>
              </label>
              <input
                id="partner-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름 또는 담당자명"
                className="rounded-xl border border-gray-900 bg-surface-secondary px-4 py-3 text-sm text-Label-Primary placeholder:text-gray-700 transition-colors focus:border-green-600 focus:outline-none"
              />
            </fieldset>

            {/* 연락처 */}
            <fieldset className="flex flex-col gap-2">
              <label htmlFor="partner-phone" className="text-sm font-medium text-Label-Secondary">
                연락처 <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="partner-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  placeholder="010-0000-0000"
                  maxLength={13}
                  className={`w-full rounded-xl border bg-surface-secondary px-4 py-3 text-sm text-Label-Primary placeholder:text-gray-700 transition-colors focus:outline-none ${
                    phone && !isPhoneComplete(phone)
                      ? "border-red-800 focus:border-red-600"
                      : "border-gray-900 focus:border-green-600"
                  }`}
                />
                {phone && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isPhoneComplete(phone) ? (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600">
                        <CheckIcon />
                      </div>
                    ) : (
                      <span className="text-[10px] text-red-500 font-bold">
                        {11 - phone.replace(/\D/g, "").length}자리 남음
                      </span>
                    )}
                  </div>
                )}
              </div>
              {phone && !isPhoneComplete(phone) && (
                <p className="text-xs text-red-500">연락처를 끝까지 입력해주세요.</p>
              )}
            </fieldset>

            {/* 약관 동의 */}
            <div className="space-y-3 rounded-2xl border border-border-card bg-surface-secondary p-5">
              <h3 className="text-sm font-semibold text-Label-Secondary mb-1">약관 동의</h3>

              <label htmlFor="partner-privacy" className="flex cursor-pointer items-start gap-3 group">
                <div className="relative mt-0.5 shrink-0">
                  <input id="partner-privacy" type="checkbox" checked={agreePrivacy}
                    onChange={(e) => setAgreePrivacy(e.target.checked)} className="sr-only" />
                  <div className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all ${
                    agreePrivacy ? "bg-green-600 border-green-600" : "border-gray-700 bg-surface-card group-hover:border-gray-500"
                  }`}>
                    {agreePrivacy && <CheckIcon />}
                  </div>
                </div>
                <div className="text-sm leading-relaxed">
                  <span className="text-Label-Primary font-medium">개인정보 제공 동의 </span>
                  <span className="text-red-400 text-xs font-semibold">(필수)</span>
                  <p className="mt-0.5 text-xs text-gray-600">
                    수집 항목: 이름, 연락처 · 목적: 제휴 상담 및 연락 · 보유기간: 상담 종료 후 1년
                  </p>
                </div>
              </label>

              <div className="h-px bg-border-card" />

              <label htmlFor="partner-marketing" className="flex cursor-pointer items-start gap-3 group">
                <div className="relative mt-0.5 shrink-0">
                  <input id="partner-marketing" type="checkbox" checked={agreeMarketing}
                    onChange={(e) => setAgreeMarketing(e.target.checked)} className="sr-only" />
                  <div className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all ${
                    agreeMarketing ? "bg-green-600 border-green-600" : "border-gray-700 bg-surface-card group-hover:border-gray-500"
                  }`}>
                    {agreeMarketing && <CheckIcon />}
                  </div>
                </div>
                <div className="text-sm leading-relaxed">
                  <span className="text-Label-Primary font-medium">마케팅 정보 수신 동의 </span>
                  <span className="text-gray-600 text-xs">(선택)</span>
                  <p className="mt-0.5 text-xs text-gray-600">
                    Overall의 새로운 기능, 이벤트, 파트너십 소식을 받아보실 수 있습니다.
                  </p>
                </div>
              </label>
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="mt-1 w-full rounded-xl bg-green-600 py-4 text-base font-bold text-black transition-all hover:bg-green-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2"><SpinIcon />제출 중...</span>
              ) : "제휴 신청하기"}
            </button>

            <p className="text-center text-xs text-gray-600">
              영업일 기준 1~3일 내에 입력하신 연락처로 연락드립니다.
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

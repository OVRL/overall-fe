"use client";

import { useState, useRef, type FormEvent, useEffect } from "react";
import Footer from "@/components/ui/Footer";
import { CATEGORY_LABELS, type InquiryCategory } from "@/lib/inquiry-store";
import { toast } from "sonner";

const categories = Object.entries(CATEGORY_LABELS) as [
  InquiryCategory,
  string,
][];

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

function CheckIcon() {
  return (
    <svg className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

const EMAIL_DOMAINS = ["naver.com", "gmail.com", "daum.net", "kakao.com", "hanmail.net", "nate.com", "outlook.com"];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState<InquiryCategory>("service");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 이메일 자동완성 상태
  const [showEmailSuggest, setShowEmailSuggest] = useState(false);
  const [suggestIndex, setSuggestIndex] = useState(0);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const suggestRef = useRef<HTMLDivElement>(null);

  const canSubmit =
    name.trim() && email.trim() && title.trim() && content.trim() && agreed;

  const filteredDomains = email.includes("@") 
    ? EMAIL_DOMAINS.filter(d => d.startsWith(email.split("@")[1]))
    : [];

  useEffect(() => {
    if (email.includes("@") && filteredDomains.length > 0) {
      setShowEmailSuggest(true);
    } else {
      setShowEmailSuggest(false);
    }
  }, [email, filteredDomains.length]);

  const handleEmailKeyDown = (e: React.KeyboardEvent) => {
    if (!showEmailSuggest) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSuggestIndex(prev => (prev + 1) % filteredDomains.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSuggestIndex(prev => (prev - 1 + filteredDomains.length) % filteredDomains.length);
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      selectDomain(filteredDomains[suggestIndex]);
    } else if (e.key === "Escape") {
      setShowEmailSuggest(false);
    }
  };

  const selectDomain = (domain: string) => {
    const [prefix] = email.split("@");
    setEmail(`${prefix}@${domain}`);
    setShowEmailSuggest(false);
    setSuggestIndex(0);
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, category, title, content }),
      });

      if (!res.ok) throw new Error("제출 실패");

      setSubmitted(true);
      toast.success("문의가 정상적으로 접수되었습니다.");
    } catch {
      toast.error("문의 접수에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-dvh flex-col bg-background">
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="mx-auto w-full max-w-lg text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-600/10">
                <svg
                  className="h-10 w-10 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h1 className="mb-3 text-2xl font-bold text-Label-Primary">
              문의가 접수되었습니다
            </h1>
            <p className="mb-8 text-sm text-gray-500">
              빠른 시일 내에 답변드리겠습니다.
              <br />
              입력하신 이메일로 답변이 발송됩니다.
            </p>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-Label-Fixed_black transition-colors hover:bg-green-700"
            >
              홈으로 돌아가기
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <main className="flex flex-1 flex-col items-center px-4 py-12 md:py-20">
        <div className="mx-auto w-full max-w-lg">
          {/* 뒤로가기 */}
          <a
            href="/"
            className="group mb-8 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-300"
          >
            <svg
              className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            돌아가기
          </a>

          {/* 헤더 */}
          <div className="mb-10">
            <h1 className="mb-2 text-2xl font-bold text-Label-Primary md:text-3xl">
              문의하기
            </h1>
            <p className="text-sm text-gray-500 md:text-base">
              궁금한 점이나 개선사항이 있으시면 언제든 문의해주세요.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* 이름 */}
            <fieldset className="flex flex-col gap-2">
              <label
                htmlFor="contact-name"
                className="text-sm font-medium text-Label-Secondary"
              >
                이름 <span className="text-red-400">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력해주세요"
                className="rounded-xl border border-gray-900 bg-surface-secondary px-4 py-3 text-sm text-Label-Primary placeholder:text-gray-700 transition-colors focus:border-green-600 focus:outline-none"
              />
            </fieldset>

            {/* 연락처 */}
            <fieldset className="flex flex-col gap-2">
              <label
                htmlFor="contact-phone"
                className="text-sm font-medium text-Label-Secondary"
              >
                연락처
              </label>
              <div className="relative">
                <input
                  id="contact-phone"
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
            </fieldset>

            {/* 이메일 */}
            <fieldset className="flex flex-col gap-2">
              <label
                htmlFor="contact-email"
                className="text-sm font-medium text-Label-Secondary"
              >
                이메일 <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  ref={emailInputRef}
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleEmailKeyDown}
                  onBlur={() => setTimeout(() => setShowEmailSuggest(false), 200)}
                  placeholder="example@email.com"
                  autoComplete="off"
                  className="w-full rounded-xl border border-gray-900 bg-surface-secondary px-4 py-3 text-sm text-Label-Primary placeholder:text-gray-700 transition-colors focus:border-green-600 focus:outline-none"
                />
                {showEmailSuggest && (
                  <div 
                    ref={suggestRef}
                    className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-xl border border-gray-800 bg-surface-secondary shadow-2xl"
                  >
                    {filteredDomains.map((domain, idx) => (
                      <button
                        key={domain}
                        type="button"
                        onClick={() => selectDomain(domain)}
                        onMouseEnter={() => setSuggestIndex(idx)}
                        className={`flex w-full items-center px-4 py-3 text-left text-sm transition-colors ${
                          idx === suggestIndex ? "bg-green-600/10 text-green-500" : "text-Label-Secondary hover:bg-gray-900"
                        }`}
                      >
                        <span className="truncate">
                          <span className="text-Label-Primary">{email.split("@")[0]}</span>
                          <span className="opacity-60">@{domain}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </fieldset>

            {/* 문의 유형 */}
            <fieldset className="flex flex-col gap-2">
              <label
                htmlFor="contact-category"
                className="text-sm font-medium text-Label-Secondary"
              >
                문의 유형
              </label>
              <div className="relative">
                <select
                  id="contact-category"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as InquiryCategory)
                  }
                  className="w-full rounded-xl border border-gray-900 bg-surface-secondary px-4 py-3 text-sm text-Label-Primary transition-colors focus:border-green-600 focus:outline-none appearance-none cursor-pointer"
                >
                  {categories.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </fieldset>

            {/* 제목 */}
            <fieldset className="flex flex-col gap-2">
              <label
                htmlFor="contact-title"
                className="text-sm font-medium text-Label-Secondary"
              >
                제목 <span className="text-red-400">*</span>
              </label>
              <input
                id="contact-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="문의 제목을 입력해주세요"
                className="rounded-xl border border-gray-900 bg-surface-secondary px-4 py-3 text-sm text-Label-Primary placeholder:text-gray-700 transition-colors focus:border-green-600 focus:outline-none"
              />
            </fieldset>

            {/* 내용 */}
            <fieldset className="flex flex-col gap-2">
              <label
                htmlFor="contact-content"
                className="text-sm font-medium text-Label-Secondary"
              >
                내용 <span className="text-red-400">*</span>
              </label>
              <textarea
                id="contact-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="문의 내용을 상세히 입력해주세요"
                rows={6}
                className="resize-none rounded-xl border border-gray-900 bg-surface-secondary px-4 py-3 text-sm text-Label-Primary placeholder:text-gray-700 transition-colors focus:border-green-600 focus:outline-none"
              />
            </fieldset>

            {/* 파일 첨부 */}
            <fieldset className="flex flex-col gap-2">
              <label className="text-sm font-medium text-Label-Secondary">
                파일 첨부
              </label>
              <div className="flex items-center justify-center rounded-xl border border-dashed border-gray-900 bg-surface-secondary px-4 py-6 transition-colors hover:border-gray-700">
                <div className="flex flex-col items-center gap-2 text-center">
                  <svg
                    className="h-8 w-8 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                    />
                  </svg>
                  <p className="text-xs text-gray-600">
                    이미지 또는 파일을 첨부해주세요 (추후 지원 예정)
                  </p>
                </div>
              </div>
            </fieldset>

            {/* 개인정보 동의 */}
            <div className="rounded-xl border border-gray-900 bg-surface-secondary p-4">
              <h3 className="mb-2 text-sm font-semibold text-Label-Secondary">
                개인정보 수집·이용 동의
              </h3>
              <ul className="mb-3 space-y-1 text-xs text-gray-600">
                <li>• 수집 항목: 이름, 연락처, 이메일</li>
                <li>• 수집 목적: 문의 접수 및 답변</li>
                <li>• 보유 기간: 문의 처리 후 1년</li>
              </ul>
              <label
                htmlFor="contact-agree"
                className="flex cursor-pointer items-center gap-2"
              >
                <input
                  id="contact-agree"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-700 bg-surface-secondary accent-green-600"
                />
                <span className="text-sm text-Label-Secondary">
                  개인정보 수집·이용에 동의합니다{" "}
                  <span className="text-red-400">*</span>
                </span>
              </label>
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="mt-2 w-full rounded-xl bg-green-600 py-4 text-base font-bold text-Label-Fixed_black transition-all hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? "제출 중..." : "문의하기"}
            </button>
          </form>

          {/* 안내 */}
          <div className="mt-6 rounded-xl bg-surface-secondary p-4">
            <p className="text-xs leading-relaxed text-gray-600">
              <strong className="text-gray-500">안내사항</strong>
              <br />
              • 평일 기준 1~3 영업일 이내에 답변드립니다.
              <br />
              • 입력하신 이메일로 답변이 발송됩니다.
              <br />• 긴급 문의는 contact@overall.com으로 연락 부탁드립니다.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

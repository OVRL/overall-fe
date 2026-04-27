"use client";

import { Fragment, useState, useEffect, useRef, useCallback } from "react";
import Link from "@/components/Link";
import Icon from "@/components/ui/Icon";
import logoOvr from "@/public/icons/logo_OVR_gray.svg";
import { cn } from "@/lib/utils";

// ─── BusinessInfoModal ───────────────────────────────────────────
function generateCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function BusinessInfoModal({ onClose }: { onClose: () => void }) {
  const [code] = useState(generateCode);
  const [input, setInput] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ESC 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  function handleVerify() {
    if (input === code) {
      setVerified(true);
      setError(false);
    } else {
      setError(true);
      setInput("");
      inputRef.current?.focus();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="사업자 정보 확인"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full sm:max-w-sm mx-4 sm:mx-auto bg-surface-secondary border border-border-card rounded-t-3xl sm:rounded-3xl px-6 py-7 space-y-5 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-Label-Primary">
            사업자 정보 확인
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors p-1 rounded-lg"
            aria-label="닫기"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {!verified ? (
          <>
            {/* 인증 안내 */}
            <p className="text-sm text-Label-Tertiary leading-relaxed">
              사업자 정보를 확인하려면 아래 숫자 4자리를 입력해주세요.
            </p>

            {/* 캡차 코드 */}
            <div className="flex items-center justify-center rounded-xl bg-black/40 border border-border-card py-5">
              <div className="flex gap-2">
                {code.split("").map((digit, i) => (
                  <span
                    key={i}
                    className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-card border border-border-card text-2xl font-mono font-bold text-green-400"
                    style={{
                      fontFamily: "'Courier New', monospace",
                      letterSpacing: "0.05em",
                      transform: `rotate(${(Math.random() - 0.5) * 8}deg)`,
                    }}
                  >
                    {digit}
                  </span>
                ))}
              </div>
            </div>

            {/* 입력 필드 */}
            <div className="space-y-2">
              <input
                ref={inputRef}
                type="number"
                maxLength={4}
                value={input}
                onChange={(e) => {
                  if (e.target.value.length <= 4) setInput(e.target.value);
                  setError(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleVerify();
                }}
                placeholder="숫자 4자리 입력"
                className={cn(
                  "w-full rounded-xl border bg-surface-card px-4 py-3 text-center text-lg font-mono text-Label-Primary placeholder:text-gray-700 tracking-widest focus:outline-none transition-colors",
                  error
                    ? "border-red-500 focus:border-red-400"
                    : "border-border-card focus:border-green-600",
                )}
              />
              {error && (
                <p className="text-xs text-red-400 text-center animate-shake">
                  숫자가 일치하지 않습니다. 다시 시도해주세요.
                </p>
              )}
            </div>

            <button
              onClick={handleVerify}
              disabled={input.length !== 4}
              className="w-full rounded-xl bg-green-600 py-3.5 text-sm font-bold text-black transition-all hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              확인
            </button>
          </>
        ) : (
          <>
            {/* 인증 완료 → 사업자 정보 표시 */}
            <div className="flex items-center gap-2 rounded-xl bg-green-600/10 border border-green-600/20 px-3 py-2">
              <svg
                className="h-4 w-4 text-green-500 shrink-0"
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
              <span className="text-xs text-green-500 font-medium">
                인증이 완료되었습니다
              </span>
            </div>

            <dl className="space-y-3 rounded-xl bg-black/30 border border-border-card p-4 text-sm">
              {[
                { label: "상호명", value: "오버롤" },
                { label: "대표자", value: "정태우" },
                {
                  label: "사업자등록번호",
                  value: "302-06-64464",
                },
                {
                  label: "통신판매업신고",
                  value: "제0000-서울-00000호",
                },
                {
                  label: "주소",
                  value:
                    "경기도 수원시 영통구 봉영로 1744번길 16 248동 1702호",
                },
                { label: "대표 이메일", value: "contact@overall.com" },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <dt className="text-xs text-Label-Tertiary">{label}</dt>
                  <dd className="text-sm text-Label-Primary font-medium">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <button
              onClick={onClose}
              className="w-full rounded-xl border border-border-card py-3 text-sm font-medium text-Label-Secondary hover:bg-surface-elevated transition-colors"
            >
              닫기
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Footer nav items ────────────────────────────────────────────
type NavItem =
  | { label: string; href: string; external?: false; action?: never }
  | { label: string; href?: never; external?: never; action: "bizInfo" };

const navItems: NavItem[] = [
  { label: "이용약관", href: "/terms" },
  { label: "개인정보 처리 방침", href: "/privacy-policy" },
  { label: "사업자 정보 확인", action: "bizInfo" },
  { label: "회사소개", href: "/about" },
  { label: "제휴 신청", href: "/partnership" },
  { label: "문의하기", href: "/contact" },
];

function NavLink({
  item,
  onBizInfo,
}: {
  item: NavItem;
  onBizInfo: () => void;
}) {
  const className =
    "text-sm font-semibold text-gray-500 hover:text-gray-300 transition-colors whitespace-nowrap px-2";

  if ("action" in item && item.action === "bizInfo") {
    return (
      <button onClick={onBizInfo} className={className} type="button">
        {item.label}
      </button>
    );
  }

  if ("href" in item && item.href) {
    return (
      <Link href={item.href} className={className}>
        {item.label}
      </Link>
    );
  }

  return null;
}

// ─── Footer ──────────────────────────────────────────────────────
export type FooterProps = {
  className?: string;
};

export default function Footer({ className }: FooterProps) {
  const [bizModalOpen, setBizModalOpen] = useState(false);
  const handleBizOpen = useCallback(() => setBizModalOpen(true), []);
  const handleBizClose = useCallback(() => setBizModalOpen(false), []);

  return (
    <>
      <footer
        className={cn(
          "w-full border-t border-border-card bg-surface-primary text-center",
          "py-10 md:py-12 px-4 md:px-6",
          className,
        )}
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-7.5">
          <div className="flex flex-col items-center">
            <Icon
              src={logoOvr}
              alt="OVR"
              className="h-11 w-auto md:h-14 text-gray-500"
              nofill
            />
            <p className="text-sm text-[#808080]">
              축구팀을 위한 올인원 관리 플랫폼
            </p>
          </div>

          <nav
            aria-label="푸터 링크"
            className="flex max-w-3xl flex-wrap items-center justify-center gap-y-2"
          >
            {navItems.map((item, index) => (
              <Fragment key={`${item.label}-${index}`}>
                {index > 0 ? (
                  <span
                    className="text-Label-Tertiary/45 select-none px-0.5 sm:px-1"
                    aria-hidden
                  >
                    |
                  </span>
                ) : null}
                <NavLink item={item} onBizInfo={handleBizOpen} />
              </Fragment>
            ))}
          </nav>

          <div className="flex w-full max-w-4xl flex-col gap-2 text-xs leading-normal text-gray-600">
            <p className="text-pretty">
              사업자등록번호: 302-06-64464
              <span
                className="mx-1.5 text-Label-Tertiary/40 max-sm:hidden"
                aria-hidden
              >
                |
              </span>
              <span className="max-sm:block max-sm:mt-1">대표: 정태우</span>
              <span
                className="mx-1.5 text-Label-Tertiary/40 max-sm:hidden"
                aria-hidden
              >
                |
              </span>
              <span className="max-sm:block max-sm:mt-1">
                통신판매업신고: 제0000-서울-00000호
              </span>
            </p>
            <p className="text-pretty">
              주소: 경기도 수원시 영통구 봉영로 1744번길 16 248동 1702호
              <span
                className="mx-1.5 text-Label-Tertiary/40 max-sm:hidden"
                aria-hidden
              >
                |
              </span>
              <span className="max-sm:block max-sm:mt-1">
                대표 이메일:{" "}
                <a
                  href="mailto:contact@overall.com"
                  className="text-Label-Secondary underline-offset-2 hover:underline"
                >
                  contact@overall.com
                </a>
              </span>
            </p>
          </div>

          <p className="text-xs text-gray-600">
            © 2026 오버롤 Corp. All rights reserved.
          </p>
        </div>
      </footer>

      {bizModalOpen && <BusinessInfoModal onClose={handleBizClose} />}
    </>
  );
}

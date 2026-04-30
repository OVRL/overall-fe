"use client";
import { useState } from "react";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Link from "@/components/Link";
import logoOvr from "@/public/icons/logo_OVR.svg";
import chevronRight from "@/public/icons/chevron_right.svg";
import { cn } from "@/lib/utils";
import { useBridgeRouter } from "@/hooks/bridge/useBridgeRouter";

/**
 * 약관·개인정보 동의 화면 (Figma OVR 약관 동의 스펙).
 * 필수 동의 후 회원가입 온보딩으로 이동합니다.
 * 소셜 미가입(콜백에서 `/privacy-consent`로 진입) 시에도 동일하며, 이때 sessionStorage 소셜 스냅샷은 온보딩에서 그대로 프리필·lockedFields에 사용됩니다.
 */
export default function PrivacyConsentClient() {
  const router = useBridgeRouter();
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [marketing, setMarketing] = useState(false);
  /** 전체 동의 체크는 필수·선택 세 항목이 모두 동의했을 때만 true (부분 선택 시 대시 표시 없음) */
  const allChecked = terms && privacy && marketing;

  const requiredOk = terms && privacy;

  const setAll = (value: boolean) => {
    setTerms(value);
    setPrivacy(value);
    setMarketing(value);
  };

  const toggleMaster = () => {
    setAll(!allChecked);
  };

  const rowCheckboxClass = cn(
    "size-6 shrink-0 rounded border-2 border-Fill_Quatiary",
    "accent-(--color-green-600) focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-Label-AccentPrimary/40 focus-visible:ring-offset-2",
    "focus-visible:ring-offset-[var(--color-surface-card)]",
  );

  return (
    <div className="flex h-full min-h-0 flex-col overflow-x-hidden bg-black text-Label-Primary">
      <main className="flex min-h-0 flex-1 flex-col justify-center px-4 py-8 md:py-12 w-full">
        <div
          className={cn(
            "w-full max-w-md mx-auto rounded-[1.25rem] border border-gray-1000",
            "bg-gray-1400 p-8 md:p-8 flex flex-col gap-y-10 shadow-card",
          )}
        >
          {/* 헤더: 로고 + 브랜드명 */}
          <header
            className="flex items-center gap-4"
            aria-label="Overall 오버롤"
          >
            <div
              className={cn(
                "flex size-20.5 shrink-0 items-center justify-center rounded-2xl",
                "bg-gray-1100",
              )}
            >
              <Icon src={logoOvr} alt="OVR" width={74} nofill />
            </div>
            <div className="flex flex-col min-w-0 gap-1">
              <span className="text-2xl font-bold text-white tracking-tight">
                Overall
              </span>
              <span className="text-sm text-[#99A1AF]">오버롤</span>
            </div>
          </header>

          {/* 전체 동의 */}
          <section className="">
            <label className="flex gap-3 items-start cursor-pointer select-none">
              <input
                type="checkbox"
                checked={allChecked}
                className={cn(rowCheckboxClass, "mt-0.5")}
                onChange={toggleMaster}
                aria-label="전체 동의"
              />
              <div className="flex flex-col gap-2 min-w-0">
                <span className="text-lg font-bold text-white">전체 동의</span>
                <p className="text-sm font-medium text-gray-700 leading-relaxed">
                  전체동의는 선택목적에 대한 동의를 포함하고 있으며, 선택목적에
                  대한 동의를 거부해도 서비스 이용이 가능합니다.
                </p>
              </div>
            </label>
          </section>

          {/* 개별 항목 */}
          <ul className="flex flex-col gap-y-4">
            <ConsentRow
              checked={privacy}
              onCheckedChange={setPrivacy}
              badge="필수"
              badgeVariant="required"
              label="개인정보 수집 및 이용"
              href="/privacy-policy"
              checkboxClass={rowCheckboxClass}
            />
            <ConsentRow
              checked={terms}
              onCheckedChange={setTerms}
              badge="필수"
              badgeVariant="required"
              label="이용약관"
              href="/terms"
              checkboxClass={rowCheckboxClass}
            />

            <ConsentRow
              checked={marketing}
              onCheckedChange={setMarketing}
              badge="선택"
              badgeVariant="optional"
              label="마케팅 정보 수신"
              href="/marketing-notice"
              checkboxClass={rowCheckboxClass}
            />
          </ul>

          <Button
            type="button"
            variant="ghost"
            size="xl"
            disabled={!requiredOk}
            onClick={() => {
              if (!requiredOk) return;
              router.push("/onboarding");
            }}
          >
            동의하기
          </Button>
          <p className="text-center text-xs text-gray-800">
            © Overall Corporation. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}

function ConsentRow({
  checked,
  onCheckedChange,
  badge,
  badgeVariant,
  label,
  href,
  checkboxClass,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  badge: string;
  badgeVariant: "required" | "optional";
  label: string;
  href: string;
  checkboxClass: string;
}) {
  return (
    <li className="list-none">
      <div className="flex items-center gap-3">
        <label className="flex flex-1 items-center gap-3 cursor-pointer min-w-0 select-none">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
            className={checkboxClass}
          />
          <span className="text-sm text-white leading-snug min-w-0">
            <span
              className={cn(
                "font-medium",
                badgeVariant === "required"
                  ? "text-[#B8FF12]"
                  : "text-gray-100",
              )}
            >
              [{badge}]
            </span>{" "}
            {label}
          </span>
        </label>
        <Link
          href={href}
          className="shrink-0 hover:bg-Fill_Quatiary/20 transition-colors text-gray-800 flex items-center"
          aria-label={`${label} 전문 보기`}
        >
          <Icon src={chevronRight} alt="" width={24} height={24} />
        </Link>
      </div>
    </li>
  );
}

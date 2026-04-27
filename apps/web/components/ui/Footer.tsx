import { Fragment } from "react";
import Link from "@/components/Link";
import Icon from "@/components/ui/Icon";
import logoOvr from "@/public/icons/logo_OVR_gray.svg";
import { cn } from "@/lib/utils";

type NavItem =
  | { label: string; href: string; external?: false }
  | { label: string; href: string; external: true };

const navItems: NavItem[] = [
  { label: "이용약관", href: "/terms" },
  { label: "개인정보 처리 방침", href: "/privacy-policy" },
  {
    label: "사업자 정보 확인",
    href: "http://www.ftc.go.kr/bizCommPop.do?wrkr_no=3020664464",
    external: true,
  },
  { label: "회사소개", href: "/" },
  { label: "고객센터", href: "/contact" },
  { label: "문의하기", href: "/contact" },
];

function NavLink({ item }: { item: NavItem }) {
  const className =
    "text-sm font-semibold text-gray-500 hover:text-gray-300 transition-colors whitespace-nowrap px-2";

  if (item.external) {
    const isMailto = item.href.startsWith("mailto:");
    return (
      <a
        href={item.href}
        className={className}
        {...(isMailto ? {} : { target: "_blank", rel: "noopener noreferrer" })}
      >
        {item.label}
      </a>
    );
  }

  return (
    <Link href={item.href} className={className}>
      {item.label}
    </Link>
  );
}

export type FooterProps = {
  className?: string;
};

export default function Footer({ className }: FooterProps) {
  return (
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
              <NavLink item={item} />
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
  );
}

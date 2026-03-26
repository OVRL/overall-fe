"use client";

import Link from "@/components/Link";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import exitIcon from "@/public/icons/exit.svg";

type LogoutButtonProps = {
  /** 클릭 후 실행할 콜백 (예: 햄버거 메뉴 닫기) */
  onClose?: () => void;
  className?: string;
};

/**
 * 백엔드 logout API 호출 후 세션을 클리어하고 / 로 이동하는 버튼.
 * GET /api/auth/logout?redirect=/ 로 이동하면 서버에서 logout 뮤테이션 호출 후 쿠키 삭제·리다이렉트가 수행됩니다.
 *
 * prefetch 비활성: Next.js Link 기본 prefetch가 햄버거 메뉴에 링크가 보이는 순간
 * GET /api/auth/logout을 백그라운드로 호출해, 로그아웃을 누르지 않아도 세션이 지워지는 문제가 생김.
 */
export function LogoutButton({ onClose, className }: LogoutButtonProps) {
  return (
    <Link
      href="/api/auth/logout?redirect=/"
      prefetch={false}
      onClick={onClose}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left transition-colors",
        "text-sm font-medium text-Label-Primary hover:bg-surface-elevated",
        className,
      )}
      aria-label="로그아웃"
    >
      <Icon src={exitIcon} alt="" width={24} height={24} nofill />
      <span>로그아웃</span>
    </Link>
  );
}

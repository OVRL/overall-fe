import Link from "next/link";
import React from "react";

const LoginSupportLinks = () => {
  return (
    <nav aria-label="계정 지원 메뉴">
      <ul className="flex items-center justify-center gap-x-2.75 text-xs text-Label-Tertiary h-12">
        <li>
          <button
            type="button"
            className="cursor-pointer hover:text-Label-AccentPrimary transition-colors"
          >
            아이디찾기
          </button>
        </li>
        <li aria-hidden="true" className="w-0.5 h-2 bg-Fill_Tertiary" />
        <li>
          <button
            type="button"
            className="cursor-pointer hover:text-Label-AccentPrimary transition-colors"
          >
            비밀번호찾기
          </button>
        </li>
        <li aria-hidden="true" className="w-0.5 h-2 bg-Fill_Tertiary" />
        <li>
          <Link
            href="/signup"
            className="cursor-pointer hover:text-Label-AccentPrimary transition-colors"
          >
            회원가입
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default LoginSupportLinks;

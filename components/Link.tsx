"use client";

import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { AnchorHTMLAttributes, MouseEvent, Ref } from "react";

/**
 * 프로젝트 전체에서 사용하는 공용 Link 컴포넌트입니다.
 *
 * - ssgoi/react 트랜지션 라이브러리를 사용하며 단일 웹뷰/Next.js 라우터를 사용하므로
 *   모든 환경(PC/Mobile/Native)에서 Next.js의 기능을 동일하게 사용합니다.
 */

type LinkProps = NextLinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps>;

const Link = ({
  href,
  replace,
  scroll,
  prefetch,
  children,
  onClick,
  ref,
  ...props
}: LinkProps & { ref?: Ref<HTMLAnchorElement> }) => {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
    // 추가적인 공통 클릭 로직을 넣을 수 있습니다.
  };

  return (
    <NextLink
      {...props}
      ref={ref}
      href={href}
      replace={replace}
      scroll={scroll}
      prefetch={prefetch}
      onClick={handleClick}
    >
      {children}
    </NextLink>
  );
};

export default Link;

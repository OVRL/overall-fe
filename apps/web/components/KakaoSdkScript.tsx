"use client";

import Script from "next/script";
import { env } from "@/lib/env";

/**
 * 루트 레이아웃에서 전역으로 Kakao JS SDK를 로드·초기화한다.
 * (서버 컴포넌트에는 onLoad 핸들러를 넘길 수 없어 클라이언트로 분리)
 * 공유·로그인 등 `window.Kakao` 를 쓰는 화면에서 사용한다.
 */
export function KakaoSdkScript() {
  if (!env.NEXT_PUBLIC_KAKAO_JS_KEY) {
    return null;
  }

  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
      integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={() => {
        if (typeof window === "undefined") return;
        const w = window as unknown as {
          Kakao?: { isInitialized: () => boolean; init: (key: string) => void };
        };
        if (w.Kakao && !w.Kakao.isInitialized()) {
          w.Kakao.init(env.NEXT_PUBLIC_KAKAO_JS_KEY);
        }
      }}
    />
  );
}

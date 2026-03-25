import "@testing-library/jest-dom";
import React from "react";

// lib/toast: Sonner·ToastView 없이 호출 여부만 검증 (테스트 파일별 spy/mock 중복 방지)
jest.mock("@/lib/toast", () => {
  const success = jest.fn();
  const error = jest.fn();
  const warning = jest.fn();
  const info = jest.fn();
  const loading = jest.fn();
  const promise = jest.fn();
  const dismiss = jest.fn();
  const custom = jest.fn();
  const toast = Object.assign(jest.fn(), {
    success,
    error,
    warning,
    info,
    loading,
    promise,
    dismiss,
    custom,
  });
  return { toast };
});

// 전역 컴포넌트/폰트 스텁 (테스트 파일별 중복 jest.mock 제거)
jest.mock("@/components/ui/ProfileAvatar", () => ({
  __esModule: true,
  default: (props: {
    src?: string;
    alt: string;
    className?: string;
  }) =>
    React.createElement("div", {
      "data-testid": "profile-avatar",
      "aria-label": props.alt,
      "data-src": props.src ?? "",
      className: props.className,
    }),
}));

// img + alt: getByAltText / getByRole("img", { name })와 호환
jest.mock("@/components/ui/Icon", () => ({
  __esModule: true,
  default: function MockIcon(props: {
    alt?: string;
    className?: string;
    style?: React.CSSProperties;
    width?: number;
    height?: number;
  }) {
    const alt = props.alt ?? "icon";
    return React.createElement("img", {
      "data-testid": "icon",
      alt,
      // 실제 Icon(span+role=img)과 같이 getByLabelText로 찾을 수 있도록 함
      "aria-label": alt,
      src: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      className: props.className,
      style: props.style,
      width: props.width,
      height: props.height,
    });
  },
}));

jest.mock("next/font/google", () => ({
  __esModule: true,
  Racing_Sans_One: () => ({ className: "racing-sans" }),
}));

// 1. IntersectionObserver Mock
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  root: null,
  rootMargin: "",
  thresholds: [],
  takeRecords: jest.fn(),
}));

// 2. URL.createObjectURL Mock
global.URL.createObjectURL = jest.fn(() => "blob:mock-url");

// 3. window.matchMedia Mock (jsdom에 없음, useMediaQuery 등에서 사용)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

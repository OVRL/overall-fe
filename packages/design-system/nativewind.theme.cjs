/**
 * NativeWind(Tailwind v3 런타임)용 theme.extend 색상.
 * 웹(Tailwind v4)은 shared-tokens.css의 @theme이 단일 소스이며, 여기 값은 동기화해야 합니다.
 */
module.exports = {
  extend: {
    colors: {
      surface: {
        primary: "oklch(0.13 0 0)",
        secondary: "oklch(0.16 0 0)",
        elevated: "oklch(0.22 0 0)",
        card: "oklch(0.213 0 0)",
      },
      border: {
        card: "oklch(0.27 0 0)",
      },
      gray: {
        90: "oklch(99.11% 0 89.9)",
        100: "oklch(97.94% 0.0013 286.4)",
        200: "oklch(95.81% 0 89.9)",
        300: "oklch(92.16% 0.0013 106.4)",
        400: "oklch(87.58% 0.0014 106.4)",
        500: "oklch(80.78% 0 89.9)",
        600: "oklch(72.28% 0.0012 17.2)",
        700: "oklch(63.01% 0 89.9)",
        800: "oklch(56.93% 0 89.9)",
        900: "oklch(26.45% 0 89.9)",
        1000: "oklch(36.39% 0 89.9)",
        1100: "oklch(24.59% 0.004 128.6)",
        1200: "oklch(18.63% 0.002 106.6)",
        1300: "oklch(6.72% 0 89.9)",
        1400: "oklch(16.38% 0 89.9)",
      },
      green: {
        600: "oklch(91.85% 0.2357 127.4)",
      },
    },
  },
};

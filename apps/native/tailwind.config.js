// NativeWind v4 패키지는 Metro에서 Tailwind v3 구성(nativewind/preset)을 로드합니다.
// 웹앱은 Tailwind v4 + @overall/design-system/styles/globals.web.css 를 사용합니다.
const designSystemTheme = require("@overall/design-system/nativewind.theme.cjs");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: designSystemTheme.extend,
  },
  plugins: [],
};

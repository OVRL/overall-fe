/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // 이 설정이 있어야 빌드 시 'out' 폴더가 생성됩니다.
  images: {
    unoptimized: true, // 정적 내보내기 시 Next.js 이미지 최적화 기능을 꺼야 에러가 안 납니다.
  },
  compiler: {
    relay: {
      src: "./",
      language: "typescript",
      artifactDirectory: "./__generated__",
    },
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["turbopack-inline-svg-loader"],
        as: "*.js",
        condition: {
          content: /^[\s\S]{0,4000}$/,
        },
      },
    },
  },
};

export default nextConfig;

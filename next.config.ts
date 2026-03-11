import { env } from "./lib/env";

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    relay: {
      src: "./",
      language: "typescript",
      artifactDirectory: "./__generated__",
    },
  },
  images: {
    qualities: [50, 75, 100],
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
  async rewrites() {
    return {
      // beforeFiles: 파일시스템(앱 라우트)보다 먼저 적용됨
      beforeFiles: [
        {
          source: "/graphql",
          destination: `${env.BACKEND_URL}/graphql`,
        },
      ],
      // afterFiles: app/api/graphql/route.ts 등이 먼저 매칭된 뒤, 나머지 /api/* 만 백엔드로 전달
      afterFiles: [
        {
          source: "/api/:path*",
          destination: `${env.BACKEND_URL}/api/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;

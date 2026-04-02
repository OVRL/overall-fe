import { env } from "./lib/env";

const assetCdn = new URL(
  env.NEXT_PUBLIC_ASSET_CDN_ORIGIN.replace(/\/$/, ""),
);

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
    formats: ["image/webp"],
    // next/image 최적화용 허용 출처 (서버→CloudFront 페치, 브라우저는 동일 출처로 수신 → rewrite·브라우저 CORS 불필요)
    remotePatterns: [
      {
        protocol: assetCdn.protocol === "https:" ? "https" : "http",
        hostname: assetCdn.hostname,
        port: assetCdn.port,
        pathname: "/**",
        search: "",
      },
    ],
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
      // afterFiles: Next.js API 라우트(/api/search, /api/graphql 등)는 제외하고, 백엔드 전용 경로만 프록시
      // /api/search/* 는 Next.js app/api/search/local/route.ts 등에서 처리(네이버 지역 검색 등)
      afterFiles: [
        {
          source: "/api/me/:path*",
          destination: `${env.BACKEND_URL}/api/me/:path*`,
        },
        {
          source: "/api/auth/:path*",
          destination: `${env.BACKEND_URL}/api/auth/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;

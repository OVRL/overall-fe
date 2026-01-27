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
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  async rewrites() {
    return [
      {
        source: "/graphql",
        destination: `${env.BACKEND_URL}/graphql`,
      },
      {
        source: "/api/:path*",
        destination: `${env.BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

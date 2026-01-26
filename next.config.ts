/** @type {import('next').NextConfig} */
const nextConfig = {
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
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL}/:path*`, 
      },
    ];
  },
};

export default nextConfig;

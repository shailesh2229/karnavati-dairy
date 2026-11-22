import type { NextConfig } from "next";

/**
 * GITHUB_PAGES=true builds a static site into /out for GitHub Pages
 * (served from https://<user>.github.io/<repo>, so PAGES_BASE_PATH="/<repo>").
 * Without it, the normal Next.js server build is used (local dev, other hosts).
 */
const pages = process.env.GITHUB_PAGES === "true";
const basePath = pages ? (process.env.PAGES_BASE_PATH ?? "") : "";

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  ...(pages
    ? {
        output: "export",
        trailingSlash: true,
        basePath,
        // Pages has no image optimiser: serve the files as they are, with the base path added
        images: { loader: "custom", loaderFile: "./src/lib/imageLoader.ts" },
      }
    : {
        images: {
          // YouTube thumbnails for Counter TV posters
          remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" }],
        },
        async redirects() {
          return [
            { source: "/about", destination: "/story", permanent: true },
            { source: "/contact", destination: "/story#contact", permanent: true },
            { source: "/cart", destination: "/hisaab", permanent: false },
            { source: "/products/:slug", destination: "/products#:slug", permanent: true },
          ];
        },
      }),
};

export default nextConfig;

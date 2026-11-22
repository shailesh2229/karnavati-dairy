import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;

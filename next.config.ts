import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

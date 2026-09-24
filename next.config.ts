import type { NextConfig } from "next";

// The admin dashboard is behind a login, but it should never be indexed, cached or framed either.
const ADMIN_HEADERS = [
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
  { key: "Cache-Control", value: "no-store" },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
];

const nextConfig: NextConfig = {
  // public/admin/ is a static page kept out of the app bundle; Next serves no directory
  // index, so /admin (where /admin/ redirects) is pointed at its index.html.
  async rewrites() {
    return [{ source: "/admin", destination: "/admin/index.html" }];
  },
  async headers() {
    return [
      { source: "/admin", headers: ADMIN_HEADERS },
      { source: "/admin/:path*", headers: ADMIN_HEADERS },
      {
        source: "/api/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

// Security headers for the public-facing site.
// Intentionally NOT applied to /studio routes — X-Frame-Options: DENY
// breaks the Sanity Studio UI, and the Studio manages its own CSP.
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
];

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io"
      }
    ]
  },
  async headers() {
    return [
      {
        // Apply strict security headers to all routes EXCEPT /studio
        source: "/((?!studio).*)",
        headers: securityHeaders
      }
    ];
  }
};

export default nextConfig;


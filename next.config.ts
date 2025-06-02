import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
   typescript: {
    // ⚠️ Dangerously allow production builds to successfully complete even if
    // your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Option 1: Use dangerouslyAllowSVG and unoptimized for all images
    unoptimized: true, // This will bypass the Image Optimization API completely

    // Option 2: If you still want some optimization but for any domain
    // domains: ['*'], // This doesn't actually work, but shown for clarity
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Match any https hostname
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '**', // Match any http hostname
        pathname: '/**',
      },
    ],
    // Allow SVG images as they are sometimes blocked
    dangerouslyAllowSVG: true,
    // Increase the content security policy if needed
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
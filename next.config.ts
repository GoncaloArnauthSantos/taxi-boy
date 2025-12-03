import type { NextConfig } from "next"

/**
 * Next.js Configuration
 * 
 * This file is automatically read by ALL Next.js commands:
 * - npm run dev (next dev) - Development server with hot reloading
 * - npm run build (next build) - Production build
 * - npm start (next start) - Production server
 * 
 * All settings here apply to all commands unless specified otherwise.
 */
const nextConfig: NextConfig = {
  /**
   * React Strict Mode
   * 
   * Applies to: ALL commands (dev, build, start)
   * 
   * Enables React's Strict Mode which:
   * - Helps identify potential problems in your app
   * - Highlights components with unsafe lifecycles
   * - Warns about legacy API usage
   * - Does NOT enable hot reloading (that's built into 'next dev')
   */
  reactStrictMode: true,
  
  /**
   * ESLint Configuration
   * 
   * Fail build on ESLint errors (not just warnings)
   * This ensures you catch errors before deploying
   */
  eslint: {
    // Fail build on ESLint errors
    ignoreDuringBuilds: false,
  },
  
  /**
   * TypeScript Configuration
   * 
   * Fail build on TypeScript errors
   */
  typescript: {
    // Fail build on TypeScript errors
    ignoreBuildErrors: false,
  },
  
  /**
   * Image Configuration
   * 
   * Configure image patterns to support local images and prevent memory issues
   */
  images: {
    remotePatterns: [
      // Prismic CMS images
      {
        protocol: 'https',
        hostname: 'images.prismic.io',
        pathname: '/**',
      },
      // Unsplash images (for placeholder/test images)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    // Allow SVG images
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Disable image optimization for missing images to prevent memory errors
    unoptimized: false,
  },
}

export default nextConfig

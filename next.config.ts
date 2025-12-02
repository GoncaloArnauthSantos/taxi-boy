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
   * Image Configuration
   * 
   * Configure image patterns to support local images and prevent memory issues
   */
  images: {
    remotePatterns: [],
    // Allow SVG images
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Disable image optimization for missing images to prevent memory errors
    unoptimized: false,
  },
}

export default nextConfig

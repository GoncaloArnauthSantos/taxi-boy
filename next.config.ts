import { withSentryConfig } from '@sentry/nextjs';
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

export default withSentryConfig(nextConfig, {
 // For all available options, see:
 // https://www.npmjs.com/package/@sentry/webpack-plugin#options

 org: "goncaloarnauth",

 project: "taxi-boy",

 // Only print logs for uploading source maps in CI
 silent: !process.env.CI,

 // For all available options, see:
 // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

 // Upload a larger set of source maps for prettier stack traces (increases build time)
 widenClientFileUpload: true,

 // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
 // This can increase your server load as well as your hosting bill.
 // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
 // side errors will fail.
 // tunnelRoute: "/monitoring",

 webpack: {
   // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
   // See the following for more information:
   // https://docs.sentry.io/product/crons/
   // https://vercel.com/docs/cron-jobs
   automaticVercelMonitors: true,

   // Tree-shaking options for reducing bundle size
   treeshake: {
     // Automatically tree-shake Sentry logger statements to reduce bundle size
     removeDebugLogging: true,
   },
 },
});

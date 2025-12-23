// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN;

const TRACES_SAMPLE_RATE =
  process.env.SENTRY_TRACES_SAMPLE_RATE !== undefined
    ? Number(process.env.SENTRY_TRACES_SAMPLE_RATE)
    : 1;

// Only initialize Sentry if DSN is provided
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,

    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,

    // For edge features we reuse the same sampling strategy.
    tracesSampleRate: TRACES_SAMPLE_RATE,

    // Keep PII behaviour aligned with server config.
    sendDefaultPii: true,
  });
}

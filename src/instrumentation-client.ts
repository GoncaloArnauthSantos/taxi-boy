// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

const TRACES_SAMPLE_RATE =
  process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE !== undefined
    ? Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE)
    : 1;

// Only initialize Sentry if DSN is provided
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,

    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,

    // Client-side tracing sampling (same env-driven strategy).
    tracesSampleRate: TRACES_SAMPLE_RATE,

    sendDefaultPii: true,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

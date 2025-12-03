# Prismic CMS Integration

This document explains how Prismic CMS is integrated into the project, including the architecture, structure, and implementation details.

## Architecture Overview

The CMS integration follows a modular, type-safe architecture that separates concerns and makes it easy to add new content types.

```
src/cms/
├── types.ts                    # TypeScript type definitions for CMS data
├── client.ts                   # Prismic client configuration
│
├── shared/                     # Shared utilities used across all types
│   ├── mappers.ts              # Generic mapper helpers (asText, asHTML, mapImage)
│   ├── logger.ts               # Centralized error logging
│   └── index.ts                # Re-exports for convenient imports
│
├── drivers/                    # Driver-specific implementation
│   ├── mapper.ts               # Maps Prismic Driver documents to Driver type
│   ├── api.ts                  # Server-side API functions for fetching drivers
│   └── index.ts                # Re-exports (import from "@/cms/drivers")
│
└── vehicles/                   # Vehicle-specific implementation
    ├── mapper.ts               # Maps Prismic Vehicle documents to Vehicle type
    ├── api.ts                  # Server-side API functions for fetching vehicles
    └── index.ts                # Re-exports (import from "@/cms/drivers")
```

## Core Concepts

### Type Safety

All Prismic data is mapped to TypeScript types defined in `src/cms/types.ts`. This ensures:
- Type safety throughout the application
- Clear contracts for what data is available
- Better IDE autocomplete and error detection

### Mapper Layer

Mappers (`mapper.ts` files) create an abstraction layer between Prismic's structure and our application types:

- **Benefits:**
  - If Prismic schema changes, only mappers need updating
  - Components don't need to know about Prismic internals
  - Easier testing and maintenance
  - Consistent data shape across the app

- **Shared mappers** (`shared/mappers.ts`) provide common utilities:
  - `asText()` - Extract plain text from Rich Text fields
  - `asHTML()` - Extract HTML from Rich Text fields
  - `mapImage()` - Map Prismic Image fields to our CMSImage type

### API Functions

API functions (`api.ts` files) are server-side only and provide:
- Type-safe data fetching from Prismic
- Automatic error handling with centralized logging
- `fetchLinks` optimization for related documents
- Consistent return types (`null` on error, empty arrays for lists)

**Example usage:**
```typescript
import { getFirstDriver } from "@/cms/drivers"

export default async function ContactUsWithDriver() {
  const driver = await getFirstDriver()
  return <ContactUs driver={driver} />
}
```

### Server Components Pattern

Data fetching happens in Server Components, which:
- Fetch data on the server (SSR/SSG)
- Pass data as props to Client Components
- Improve SEO and performance
- Reduce client-side JavaScript

**Example:**
```typescript
// Server Component (ContactUsWithDriver.tsx)
import { getFirstDriver } from "@/cms/drivers"

export default async function ContactUsWithDriver() {
  const driver = await getFirstDriver()
  return <ContactUs driver={driver} />
}

// Client Component (ContactUs.tsx)
"use client"
export default function ContactUs({ driver }: { driver: Driver | null }) {
  // Interactive UI that uses driver data
}
```

## Implementation Details

### fetchLinks Optimization

When fetching drivers, we use `fetchLinks` to include related vehicle documents in a single API call:

```typescript
const driverDocument = await client.getByID(id, {
  fetchLinks: [
    "vehicle.name",
    "vehicle.seats",
    "vehicle.description",
    "vehicle.image",
  ],
})
```

The mapper then checks if vehicles are already resolved (have `data` property) or need to be fetched separately:

```typescript
// If vehicle has 'data', it was resolved via fetchLinks - use it directly
if (vehicle && typeof vehicle === "object" && "data" in vehicle) {
  return mapVehicle(vehicle as prismic.PrismicDocument)
}
// Otherwise, fetch the vehicle by ID
```

This reduces API calls from N+1 to just 1.

### Error Handling

All API functions use centralized logging via `shared/logger.ts`:

- **Development:** Full error details logged to console
- **Production:** Structured logs ready for integration with services like Sentry
- **Consistent:** All errors include context (function name, IDs, etc.)

Errors are handled gracefully:
- API functions return `null` or empty arrays on error
- Mappers throw errors for data integrity issues (e.g., missing required photo)
- Components handle null data gracefully

### Client Configuration

The Prismic client (`client.ts`) is configured with:
- Environment variable validation
- Server-side only usage (no `NEXT_PUBLIC_` prefix)
- Clear error messages if configuration is missing

## Revalidation

Cache revalidation is handled via webhooks to ensure content updates appear immediately without requiring a rebuild or redeploy:

1. **Webhook endpoint** (`/api/revalidate`) receives updates from Prismic when content is published/unpublished
2. **Secret validation** ensures only Prismic can trigger revalidation
3. **Path-based revalidation** invalidates Next.js cache for all pages that use Prismic data

### How It Works

When content is published in Prismic:
1. Prismic sends a webhook POST request to `/api/revalidate`
2. The endpoint validates the secret token
3. Next.js cache is invalidated for all relevant pages:
   - Root layout (affects all pages)
   - Home page (`/`)
   - Tours listing page (`/tours`)
   - Tour detail pages (`/tours/[id]`)
4. Next request to any of these pages fetches fresh data from Prismic


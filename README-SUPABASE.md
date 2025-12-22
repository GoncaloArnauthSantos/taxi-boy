# Supabase Database Integration

This document explains how Supabase is integrated into the project for booking data persistence.

## Architecture

```
src/supabase/
├── database.ts                  # Supabase database client (for data operations)
├── bookings/
│   └── mapper.ts                 # Maps between DB (snake_case) and app (camelCase)
├── migrations/                  # SQL migration files
│   └── create_bookings_table.sql
└── auth/                        # Authentication clients (see README-AUTH.md)
    ├── server.ts                 # Server-side auth client
    ├── client.ts                 # Client-side auth client
    └── middleware.ts             # Middleware auth client
```

## Core Concepts

### Type Safety
All database data is mapped to TypeScript types in `src/domain/booking.ts`.

### Mapper Layer
Mappers convert between database format (`snake_case`) and application format (`camelCase`):
- `mapBookingToInsert()` - Booking → DB insert format
- `mapRowToBooking()` - DB row → Booking
- `mapBookingPatchToUpdate()` - Partial Booking → DB update format

### Database Client
The Supabase database client (`src/supabase/database.ts`) validates environment variables and creates the client instance for data operations. For authentication, see `src/supabase/auth/`.

## Database Schema

The `bookings` table stores all booking information with the following key fields:
- Client information (name, email, phone, country, language)
- Booking details (selected date, message, tour ID)
- Status and payment information
- Timestamps (`created_at`, `updated_at`, `deleted_at`)

See `src/supabase/migrations/create_bookings_table.sql` for the complete schema.

## Soft Delete

The application uses **soft delete**:
- When a booking is deleted, `deleted_at` is set instead of removing the record
- All queries automatically filter `WHERE deleted_at IS NULL`
- Bookings can be restored if needed

## API Functions

All database operations are in `src/app/api/bookings/store.ts`:

- `createBooking()` - Create a new booking
- `getBookingById()` - Get a single booking (excludes deleted)
- `getAllBookings()` - Get all bookings with optional filters
- `updateBooking()` - Update booking fields (excludes deleted)
- `deleteBooking()` - Soft delete a booking

## API Routes

- `GET /api/bookings` - List bookings (with filters)
- `GET /api/bookings/:id` - Get single booking
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Soft delete booking

## Setup

1. Create a Supabase project
2. Add environment variables to `.env.local`:
   ```env
   SUPABASE_URL=your-supabase-project-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
3. Run the migration in Supabase Dashboard SQL Editor:
   - Copy and execute `src/supabase/migrations/create_bookings_table.sql`

## Best Practices

- **Naming**: Database uses `snake_case`, application uses `camelCase`
- **Error Handling**: Centralized logging with `logError`
- **Type Safety**: All operations are fully typed
- **Performance**: Indexes on frequently queried columns

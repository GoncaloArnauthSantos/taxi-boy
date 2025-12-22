# Supabase Authentication Setup

This document explains how Supabase Auth is integrated for admin authentication.

## Architecture

```
src/supabase/
├── database.ts        # Database client (for data operations)
└── auth/
    ├── server.ts      # Server-side auth client (Server Components, API routes)
    ├── client.ts      # Client-side auth client (Client Components)
    └── middleware.ts  # Middleware auth client (Next.js middleware)

src/app/
├── middleware.ts      # Protects /admin routes
├── admin/
│   ├── login/page.tsx # Login page
│   └── page.tsx       # Protected admin page
└── api/auth/
    ├── login/route.ts  # Login API endpoint
    └── logout/route.ts # Logout API endpoint
```

## Setup Instructions

### 1. Configure Environment Variables

Add these to your `.env.local`:

```env
# Supabase (for database - already exists)
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key

# Supabase Auth (must be public for client-side auth)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Note:** Use the same values for both `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL` (and same for keys). The `NEXT_PUBLIC_` prefix makes them accessible in the browser for client-side authentication.

### 2. Create Admin User in Supabase

1. Go to your Supabase Dashboard → **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Enter:
   - **Email**: Your admin email (e.g., `admin@taxiboy.com`)
   - **Password**: A strong password
   - **Auto Confirm User**: ✅ Check this (no email verification needed)
4. Click **"Create user"**

### 3. Disable Email Verification (Optional)

Since you only need one admin account and don't want email verification:

1. Go to **Authentication** → **Settings** → **Auth Providers** → **Email**
2. Disable **"Confirm email"** (optional, but recommended for single admin)

### 4. Test the Login

1. Start your dev server: `npm run dev`
2. Navigate to `/admin` - you should be redirected to `/admin/login`
3. Enter the email and password you created in Supabase
4. You should be redirected to `/admin` after successful login

## How It Works

### Authentication Flow

1. **Login**: User enters credentials → `signInWithPassword()` → Supabase creates session → Cookie stored
2. **Protection**: Middleware checks session on every `/admin/*` request → Redirects to login if no session
3. **Logout**: `signOut()` → Clears session cookie → Redirects to login

### Client Types

- **Server Client** (`server.ts`): Used in Server Components and API routes. Handles cookies automatically.
- **Client Client** (`client.ts`): Used in Client Components. Manages browser-side auth state.
- **Middleware Client** (`middleware.ts`): Used in Next.js middleware. Refreshes sessions automatically.

### Route Protection

The middleware (`src/app/middleware.ts`) protects all `/admin/*` routes except `/admin/login`:
- If not authenticated → Redirect to `/admin/login`
- If authenticated and on `/admin/login` → Redirect to `/admin`
- If authenticated → Allow access

## Security Notes

- Sessions are stored in httpOnly cookies (secure by default)
- Passwords are hashed by Supabase (never stored in plain text)
- Middleware refreshes expired sessions automatically
- All `/admin` routes are protected server-side

## Future Enhancements

- Multiple admin users (already supported by Supabase Auth)
- Role-based access control (if needed)
- Password reset functionality (if needed)
- Two-factor authentication (if needed)


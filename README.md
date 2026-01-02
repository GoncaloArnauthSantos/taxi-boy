# 🚖 **TaxiBoy - Personalized Tour Booking Website**

A modern, type-safe web application for personalized tour booking in Portugal. Built with Next.js 15, TypeScript, and Prismic CMS for seamless content management.

## **Features**

- 🌍 **Interactive Tour Listings**: Browse and filter tours with beautiful layouts and engaging descriptions
- 📅 **Booking System**: Submit tour bookings with essential details (dates, number of people, contact information)
- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS v4
- 📱 **Responsive Design**: Fully responsive design optimized for all devices
- ⚡ **SEO Optimized**: Server-side rendering and static generation for optimal SEO
- 🔄 **CMS Integration**: Content managed through Prismic CMS with automatic revalidation
- 🚀 **Performance**: Optimized with Next.js App Router, Suspense, and static generation
- 🎯 **Mobile-First UX**: Optimized mobile experience with carousels, sticky navigation, and touch-friendly interactions

## **Tech Stack**

- **Framework**: [Next.js 15](https://nextjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **CMS**: [Prismic](https://prismic.io/) for headless content management
- **Database**: [Supabase](https://supabase.com/) for PostgreSQL database and real-time features
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with CSS-based configuration
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) built on Radix UI
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/) for fast and scalable hosting

## **Goals**

1. **Create a seamless user experience** for tourists to explore and book personalized tours in Portugal.
2. **Enhance developer skills** in modern web development technologies.
3. **Deploy a scalable, performant web application** with real-world functionality.
4. **Implement a complete booking system** with database persistence and admin management.

## **Getting Started**

### Prerequisites

- Node.js 20+ and npm (see `.nvmrc` for version)
- A Prismic repository (see [Prismic Setup](#prismic-setup))
- A Supabase project (see [Supabase Setup](#supabase-setup))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/GoncaloArnauthSantos/taxi-boy.git
   cd taxi-boy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory:
   ```env
   # Prismic CMS
   CMS_ENDPOINT=your-prismic-repository-endpoint
   CMS_REVALIDATE_SECRET=your-webhook-secret
   
   # Supabase Database & Auth
   SUPABASE_URL=your-supabase-project-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   
   # Email (Resend)
   RESEND_API_KEY=your-resend-api-key
   EMAIL_FROM=noreply@yourdomain.com
   DRIVER_EMAIL=driver@yourdomain.com
   
   # Cron Reminders (optional but recommended)
   CRON_SECRET=your-secure-random-string
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Visit the app at `http://localhost:3000`.

### Prismic Setup

This project uses Prismic CMS for content management. See [README-PRISMIC.md](./README-PRISMIC.md) for detailed setup instructions and architecture documentation.

**Quick setup:**
1. Create a Prismic repository
2. Configure the content types (Tour, Driver, Vehicle, Location, etc.)
3. Add your repository endpoint to `.env.local`
4. Configure webhooks for automatic cache revalidation

### Supabase Setup

This project uses Supabase for database persistence and authentication. See [README-SUPABASE.md](./README-SUPABASE.md) for database setup and [README-AUTH.md](./README-AUTH.md) for authentication setup.

**Quick setup:**
1. Create a Supabase project
2. Run the migrations in `src/supabase/migrations/` (see SQL files)
3. Add your Supabase URL and anon key to `.env.local` (both with and without `NEXT_PUBLIC_` prefix)
4. Create an admin user in Supabase Dashboard (Authentication → Users)
5. The booking system and admin authentication will automatically work

## **Project Structure**

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (bookings, auth, webhooks)
│   ├── admin/             # Admin pages (protected)
│   ├── tours/             # Tours pages
│   └── page.tsx           # Home page
├── cms/                    # Prismic CMS integration
│   ├── shared/            # Shared utilities
│   ├── [type]/            # CMS modules (drivers, tours, etc.)
│   └── types.ts           # Type definitions
├── supabase/               # Supabase integration
│   ├── database.ts        # Database client (for data operations)
│   ├── bookings/          # Booking mappers
│   ├── migrations/        # SQL migration files
│   └── auth/              # Authentication clients
│       ├── server.ts      # Server-side auth
│       ├── client.ts      # Client-side auth
│       └── middleware.ts  # Middleware auth
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   └── [feature]/         # Feature-specific components
├── domain/                 # Domain types (Booking, etc.)
├── api/                    # API client (frontend)
└── hooks/                  # Custom React hooks
```

## **Available Scripts**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run prebuild` - Run type-check and lint before build

## **CMS Integration**

The project uses a modular, type-safe architecture for Prismic CMS integration:

- **Type Safety**: All CMS data is mapped to TypeScript types
- **Modular Structure**: Each content type has its own module (mapper, API, types)
- **Error Handling**: Centralized logging with graceful error handling
- **Performance**: Optimized with `fetchLinks` and parallel data fetching
- **Revalidation**: Automatic cache revalidation via webhooks

For detailed information, see [README-PRISMIC.md](./README-PRISMIC.md).

## **Database Integration**

The project uses Supabase (PostgreSQL) for booking data persistence:

- **Type Safety**: All database data is mapped to TypeScript types
- **Modular Structure**: Mappers handle conversion between DB format (snake_case) and app format (camelCase)
- **Soft Delete**: Bookings are soft deleted (preserved in database) instead of hard deleted
- **Error Handling**: Centralized logging with graceful error handling
- **Performance**: Optimized with indexes and efficient queries

For detailed information, see [README-SUPABASE.md](./README-SUPABASE.md).

## **Performance Metrics**

The application is optimized for performance and accessibility, achieving excellent Lighthouse scores:

### **Desktop Performance**
| Metric | Score |
|--------|-------|
| **Performance** | 🟢 96 |
| **Accessibility** | 🟢 98 |
| **Best Practices** | 🟢 100 |
| **SEO** | 🟢 100 |

### **Mobile Performance**
| Metric | Score |
|--------|-------|
| **Performance** | 🟢 90 |
| **Accessibility** | 🟢 98 |
| **Best Practices** | 🟢 100 |
| **SEO** | 🟢 100 |

### **Optimizations Implemented**

- ✅ **Image Optimization**: Priority loading for LCP images with `fetchpriority="high"`, lazy loading for below-the-fold content
- ✅ **Font Optimization**: Preloaded fonts with `font-display: swap` for better FCP
- ✅ **Code Splitting**: Strategic lazy loading of heavy components (Calendar, Dialogs)
- ✅ **CSS Optimization**: Tailwind CSS v4 with automatic purging and minification
- ✅ **Mobile UX**: Optimized carousels, sticky navigation, touch-friendly interactions
- ✅ **SEO**: Dynamic sitemap, robots.txt, Open Graph tags, structured data (JSON-LD)

*Last updated: Performance audit using Google Lighthouse*

## **Recent Improvements**

### **Mobile UX Enhancements** (Latest)
- 🎨 Responsive banner with optimized font sizes for mobile
- 🎠 WhyChooseUs carousel for mobile devices
- 📱 Sticky filters positioned below header
- 🎯 Touch-friendly buttons with active states
- 🖼️ Image optimization with priority loading for LCP
- 📏 Compact footer layout for mobile

### **Performance Optimizations**
- ⚡ LCP image optimization with `fetchpriority="high"`
- 🖼️ Strategic image lazy loading
- 📦 Code splitting for heavy components
- 🎨 CSS optimization and tree-shaking


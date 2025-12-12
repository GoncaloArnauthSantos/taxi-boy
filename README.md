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

## **Tech Stack**

- **Framework**: [Next.js 15](https://nextjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **CMS**: [Prismic](https://prismic.io/) for headless content management
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with CSS-based configuration
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) built on Radix UI
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/) for fast and scalable hosting

## **Goals**

1. **Create a seamless user experience** for tourists to explore and book personalized tours in Portugal.
2. **Enhance developer skills** in modern web development technologies.
3. **Deploy a scalable, performant web application** with real-world functionality.

## **Getting Started**

### Prerequisites

- Node.js 18+ and npm
- A Prismic repository (see [Prismic Setup](#prismic-setup))

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
   CMS_ENDPOINT=your-prismic-repository-endpoint
   CMS_REVALIDATE_SECRET=your-webhook-secret
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

## **Project Structure**

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (webhooks)
│   ├── tours/             # Tours pages
│   └── page.tsx           # Home page
├── cms/                    # Prismic CMS integration
│   ├── shared/            # Shared utilities
│   ├── [type]/            # CMS modules (drivers, tours, etc.)
│   └── types.ts           # Type definitions
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   └── [feature]/         # Feature-specific components
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

## **Future Improvements**

- [ ] Add unit and end-to-end tests
- [ ] Implement email confirmation for bookings
- [ ] Add admin interface for booking management
- [ ] Implement Progressive Web App (PWA) features
- [ ] Add internationalization (i18n) support

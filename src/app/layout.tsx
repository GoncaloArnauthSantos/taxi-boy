// app/layout.tsx
import { Metadata, Viewport } from "next"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import { Inter } from "next/font/google"
import { getBaseUrl, generateOpenGraphMetadata, generateTwitterMetadata, defaultSiteMetadata } from "@/lib/seo"

//  Using Inter font for modern, clean typography
// font-display: swap ensures text is visible immediately with fallback font
const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

const baseUrl = getBaseUrl();
const ogMetadata = generateOpenGraphMetadata({});
const twitterMetadata = generateTwitterMetadata({});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: defaultSiteMetadata.title,
    template: `%s | ${defaultSiteMetadata.siteName}`,
  },
  description: defaultSiteMetadata.description,
  keywords: [
    "lisbon tours",
    "go lisbon tours",
    "lisbon taxi tours",
    "lisbon private tours",
    "lisbon custom tours",
    "portugal tours",
    "lisbon sightseeing",
    "lisbon day tours",
    "lisbon city tours",
    "sintra tours",
    "belem tours",
    "cascais tours",
  ],
  authors: [{ name: "Go Lisbon Tours" }],
  creator: "Go Lisbon Tours",
  publisher: "Go Lisbon Tours",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  openGraph: ogMetadata,
  twitter: twitterMetadata,
  alternates: {
    canonical: baseUrl,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent", // Full screen, hides Safari UI
    title: "TaxiBoy Admin",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  other: {
    // iOS - Full screen native experience
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "TaxiBoy Admin",
    // Android - Full screen native experience
    "mobile-web-app-capable": "yes",
    "theme-color": "#1e293b",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#1e293b",
};

const RootLayout = async ({children}: {
    children: React.ReactNode;
}) => {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="eSLaJC2wnK3WjXFdeYfO6CdiplgdbzYNjIEYmcoDF1c" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  )
}

export default RootLayout;
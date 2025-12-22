// app/layout.tsx
import { Metadata } from "next"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import { Inter } from "next/font/google"

//  Using Inter font for modern, clean typography
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Lisbon Taxi Tours - Premium Custom Tours",
  description: "Experience Lisbon with a multilingual driver offering personalized taxi tours around the city and surrounding areas",
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
}

const RootLayout = async ({children}: {
    children: React.ReactNode;
}) => {
  return (
    <html lang="en">
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
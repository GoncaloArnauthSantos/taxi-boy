// app/layout.tsx
import "./globals.css"
import MainHeader from "@/components/MainHeader"

export const metadata = {
  title: "TourBooking",
  description: "Explore and book amazing tours in Portugal",
}

export default function RootLayout({children}: {
    children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body>
        <MainHeader />
        <main className="py-6 m-6">{children}</main>
        <footer className="bg-secondary text-white p-4 fixed bottom-0 w-full">
          <div className="container text-center">
            <p>&copy; 2024 TourBooking. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}

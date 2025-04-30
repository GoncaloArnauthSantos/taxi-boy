"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function MainHeader() {
  const pathname = usePathname()
  const isNotHomePage = pathname !== "/"
  
  return (
    <header className="bg-primary text-white p-4">
      <div className="container text-center">
        <h1 className="text-xl font-bold">TourBooking</h1>
        { isNotHomePage && <Link href="./" className="text-black" >Back</Link>}
      </div>
    </header>
  )
}

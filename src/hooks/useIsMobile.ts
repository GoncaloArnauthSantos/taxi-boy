"use client"

import { useState, useEffect } from "react"

/**
 * Custom hook to detect if the current viewport is mobile
 * 
 * @param breakpoint - The breakpoint in pixels (default: 768px, matches Tailwind's 'md' breakpoint)
 * @returns boolean - true if viewport width is less than breakpoint
 * 
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)

    return () => {
      window.removeEventListener("resize", checkIsMobile)
    }
  }, [breakpoint])

  return isMobile
}


import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { MapPin, Home, Compass } from "lucide-react"

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <MapPin className="relative w-24 h-24 text-primary" strokeWidth={1.5} />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <h2 className="text-3xl font-semibold text-foreground">Lost in Lisbon?</h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Looks like you&apos;ve wandered off the beaten path. This page doesn&apos;t exist, but we know all the best routes to
            get you back on track.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2 bg-transparent">
            <Link href="/#tours">
              <Compass className="w-4 h-4" />
              Explore Tours
            </Link>
          </Button>
        </div>

        {/* Additional Help */}
        <div className="pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Need assistance? Contact us at{" "}
            <a href="mailto:info@lisbontaxitours.com" className="text-primary hover:underline font-medium">
              info@lisbontaxitours.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound;
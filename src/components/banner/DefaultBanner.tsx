import { Button } from "../ui/Button";
import Link from "next/link";
    
const DefaultBanner = () => {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-20 lg:py-32 relative z-10">
      <div className="max-w-3xl">
        <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-balance leading-tight">
          Discover Lisbon Like Never Before
        </h1>
        <p className="text-lg lg:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
          Experience authentic Portuguese culture with personalized taxi tours
          led by a multilingual local driver. Custom itineraries, hidden gems,
          and unforgettable memories.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            asChild
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Link href="/tours">Explore Tours</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
          >
            <Link href="/booking">Book Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DefaultBanner;


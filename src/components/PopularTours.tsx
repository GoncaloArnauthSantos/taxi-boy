"use client"

import Link from "next/link";
import { Button } from "./ui/Button";
import { TourCard } from "./TourCard";
import { tours } from "@/app/lib/tours";
import { useIsMobile } from "@/hooks/useIsMobile";


const PopularTours = () => {
  const isMobile = useIsMobile();
  const toursToShow = isMobile ? 3 : 6;

  return (
    <>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
            Our Popular Tours
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From historic landmarks to coastal escapes, choose the perfect tour
            for your Lisbon adventure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.slice(0, toursToShow).map((tour) => (
            <TourCard key={tour.id} {...tour} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline">
            <Link href="/tours">See More Tours</Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default PopularTours;

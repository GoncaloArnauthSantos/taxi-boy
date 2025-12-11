"use client";

import TourCard from "./TourCard";
import type { Tour } from "@/cms/types";
import { useIsMobile } from "@/hooks/useIsMobile";

type Props = {
  tours: Tour[];
};

const TourGrid = ({ tours }: Props) => {
  const isMobile = useIsMobile();
  const toursToShow = isMobile ? 3 : 6;

  if (tours.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {tours.slice(0, toursToShow).map((tour) => (
        <TourCard
          key={tour.id}
          id={tour.id}
          title={tour.title}
          description={tour.description}
          duration={tour.duration}
          price={tour.price}
          bannerImage={tour.bannerImage}
        />
      ))}
    </div>
  );
};

export default TourGrid;


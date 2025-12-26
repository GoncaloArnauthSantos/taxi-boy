"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { BannerEvent } from "@/cms/types";

type Props = {
  events: BannerEvent[];
};

const BannerCarousel = ({ events }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

   // Cleanup timeout on unmount
   useEffect(() => {
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, []);

  const pauseAndResumeAutoPlay = useCallback(() => {
    setIsAutoPlaying(false);

    // Clear any existing timeout
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
    }

    // Resume auto-play after 10 seconds
    autoPlayTimeoutRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
      autoPlayTimeoutRef.current = null;
    }, 10000);
  }, []);

  const goToSlide = useCallback(
    (index: number, pauseAutoPlay: boolean = false) => {
      if (index === currentIndex || isTransitioning) return;

      setIsTransitioning(true);
      setCurrentIndex(index);

      // If user manually navigated, pause auto-play and resume after 10 seconds
      if (pauseAutoPlay) {
        pauseAndResumeAutoPlay();
      }

      // Reset transitioning state after animation
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    },
    [currentIndex, isTransitioning, pauseAndResumeAutoPlay]
  );

  const goToNext = useCallback(() => {
    const newIndex = (currentIndex + 1) % events.length;
    goToSlide(newIndex);
  }, [currentIndex, events.length, goToSlide]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || events.length <= 1) return;

    const interval = setInterval(() => {
      goToNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, events.length, goToNext]);


  if (events.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {events.map((event, index) => {
          const imageUrl = event.image?.url || "/placeholder.svg";
          const imageAlt = event.image?.alt || event.title;
          const isActive = index === currentIndex;

          return (
            <div
              key={event.id}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0 opacity-40">
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  className="w-full h-full object-cover"
                  fill
                  priority={index === 0}
                  sizes="100vw"
                />
              </div>

              {/* Content */}
              <div className="container mx-auto px-4 lg:px-8 py-20 lg:py-32 relative z-10 h-full flex items-center">
                <div className="max-w-3xl">
                  <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-balance leading-tight">
                    {event.title}
                  </h1>
                  <p className="text-lg lg:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
                    {event.shortDescription || event.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      asChild
                      size="lg"
                      className="bg-accent/90 hover:bg-accent/70 text-accent-foreground"
                    >
                      <Link href="/contact">Contact Driver</Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      className="bg-primary/90 hover:bg-primary/70 text-primary-foreground"
                    >
                      <Link href="/tours">Explore Tours</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Indicators */}
      {events.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index, true)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentIndex
                  ? "w-8 bg-primary-foreground"
                  : "w-2 bg-primary-foreground/40 hover:bg-primary-foreground/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerCarousel;

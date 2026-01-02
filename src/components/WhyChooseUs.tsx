"use client";

import { useState, useEffect, useCallback } from "react";
import type { WhyChooseUs, ImageWithLabel } from "@/cms/types";
import { getIcon } from "@/lib/utils";

type Props = {
  content: WhyChooseUs | null;
};

const WhyChooseUs = ({ content }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { title, label, reasons = [] } = content || {};
  const reasonsLength = reasons?.length;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % reasonsLength);
  }, [reasonsLength]);

  // Auto-play functionality
  useEffect(() => {
    if (reasonsLength <= 1) return;

    const interval = setInterval(() => {
      goToNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [reasonsLength, goToNext]);

  if (!content) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 lg:px-8">
      <div className="text-center mb-8 md:mb-12 lg:mb-16">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-foreground">
          {title}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
          {label}
        </p>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8">
        {reasons.map((reason: ImageWithLabel) => {
          const IconComponent = getIcon(reason.iconName);

          return (
            <div className="text-center" key={reason.id}>
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                {IconComponent && (
                  <IconComponent className="w-8 h-8 text-accent-foreground" />
                )}
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">
                {reason.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {reason.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {reasons.map((reason: ImageWithLabel) => {
              const IconComponent = getIcon(reason.iconName);

              return (
                <div key={reason.id} className="min-w-full px-4 text-center">
                  <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {IconComponent && (
                      <IconComponent className="w-8 h-8 text-accent-foreground" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">
                    {reason.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {reason.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Indicators */}
        {reasonsLength > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {reasons.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted hover:bg-muted/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WhyChooseUs;

import Image from "next/image";
import Link from "next/link";
import { Clock, Euro } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Tour } from "@/cms/types";

type Props = {
  tour: Tour;
}

const Hero = ({ tour }: Props) => {
  const { title, duration, price, bannerImage, uid } = tour;
  return (
    <>
      <Image
        src={bannerImage?.url || "/placeholder.svg"}
        alt={bannerImage?.alt || title}
        className="w-full h-full object-cover"
        width={1000}
        height={500}
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 text-balance">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-white/90 mb-4 md:mb-0">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-base md:text-lg">{duration}h</span>
            </div>
            <div className="flex items-center gap-2">
              <Euro className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-base md:text-lg font-semibold">{price}</span>
            </div>
          </div>
          
          {/* Mobile Booking Button */}
          <div className="md:hidden mt-4">
            <Button
              asChild
              size="lg"
              className="w-full bg-accent hover:bg-accent/90 active:bg-accent/80 text-accent-foreground"
            >
              <Link href={`/booking?tour=${uid}`}>Book This Tour</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;

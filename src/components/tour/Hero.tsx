import Image from "next/image";
import { Clock, Euro } from "lucide-react";
import { Tour } from "@/app/lib/tours";

type Props = {
  tour: Tour;
}

const Hero = ({ tour }: Props) => {
  const { title, duration, price, bannerImage } = tour;
  return (
    <>
      <Image
        src={bannerImage || "/placeholder.svg"}
        alt={title}
        className="w-full h-full object-cover"
        width={1000}
        height={500}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
        <div className="container mx-auto">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 text-balance">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/90">
            <div className="flex items-center gap-2">
              §§
              <Clock className="w-5 h-5" />
              <span className="text-lg">{duration}h</span>
            </div>
            <div className="flex items-center gap-2">
              <Euro className="w-5 h-5" />
              <span className="text-lg font-semibold">{price}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;

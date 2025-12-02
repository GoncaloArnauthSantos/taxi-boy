import Image from "next/image";
import { Tour } from "@/app/lib/tours";

type Props = {
  tour: Tour;
}

const Gallery = ({ tour }: Props) => {
  const { images, title } = tour;
  
  return (
    <>
      <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-foreground">
        Gallery
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-video rounded-xl overflow-hidden"
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`${title} tour gallery image ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              width={500}
              height={300}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default Gallery;

import Image from "next/image";
import type { Tour } from "@/cms/types";

type Props = {
  tour: Tour;
}

const Gallery = ({ tour }: Props) => {
  const { images, title } = tour;
  
  if (images.length === 0) {
    return null;
  }
  
  return (
    <>
      <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-foreground">
        Gallery
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative aspect-video rounded-xl overflow-hidden"
          >
            <Image
              src={image.url || "/placeholder.svg"}
              alt={image.alt || `${title} tour gallery image ${image.id}`}
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
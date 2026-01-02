import Link from "next/link";
import { Button } from "./ui/Button";
import type { Tour } from "@/cms/types";
import type { PageSection } from "@/cms/types";
import TourGrid from "./TourGrid";

type Props = {
  content: PageSection | null;
  tours: Tour[];
};

const PopularTours = ({ content, tours }: Props) => {
  if (!content) {
    return null;
  }

  const { title, label } = content;

  return (
    <>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-foreground">
            {title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            {label}
          </p>
        </div>

        <TourGrid tours={tours} />

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

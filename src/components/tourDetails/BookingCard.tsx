import { Globe } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "../ui/Card";
import Link from "next/link";
import type { Tour } from "@/cms/types";

type Props = {
  tour: Tour;
  languages: string[];
};

const BookingCard = ({ tour, languages }: Props) => {
  const { price, duration } = tour;
  
  return (
    <Card className="sticky top-24 border-border">
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="text-sm text-muted-foreground mb-2">
            Tour Price
          </div>
          <div className="text-4xl font-bold text-foreground mb-1">
            €{price}
          </div>
          <div className="text-sm text-muted-foreground">
            {duration} hours
          </div>
        </div>

        <div className="mb-6 pb-6 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-muted-foreground" />
            <span className="font-semibold text-foreground">
              Languages Available
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {languages.map((lang, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>

        <Button
          asChild
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mb-3"
          size="lg"
        >
          <Link href={`/booking?tour=${tour.uid}`}>Book This Tour</Link>
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Questions?{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact us
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;

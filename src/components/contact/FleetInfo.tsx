import { Users } from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import Image from "next/image";
import { PageSection, Vehicle } from "@/cms/types";

type Props = {
  content: PageSection | null;
  vehicles: Vehicle[];
};

const FleetInfo = ({ content, vehicles }: Props) => {
  if (!content || !vehicles) {
    return null;
  }
  const { title, label } = content;
  
  return (
    <section className="border-t border-border/40 bg-muted/20 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-muted-foreground">{label}</p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.map(({ id, name, image, description, seats }) => (
            <Card key={id} className="overflow-hidden border-border/40">
              <CardContent className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold tracking-tight">{name}</h3>

                  <div className="mt-3 flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Up to {seats} passengers
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mt-4">
                    {description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FleetInfo;

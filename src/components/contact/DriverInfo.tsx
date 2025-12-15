import { Award } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Card, CardContent } from "../ui/Card";
import Image from "next/image";
import { Driver, PageSection } from "@/cms/types";

type Props = {
  content: PageSection | null;
  driver: Driver | null;
};

const DriverInfo = ({ content, driver }: Props) => {
  if(!content || !driver) {
    return null;
  }

  const {title, label} = content;
  const {name, description, photo, languages} = driver;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {label}
          </p>
        </div>

        <Card className="mx-auto max-w-4xl overflow-hidden border-border/40">
          <CardContent className="p-0">
            <div className="grid gap-8 md:grid-cols-5">
              {/* Driver image */}
              <div className="relative h-64 md:col-span-2 md:h-auto">
                <Image
                  src={photo.url || "/placeholder.svg"}
                  alt={name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Driver info */}
              <div className="flex flex-col justify-center p-6 md:col-span-3 md:p-8">
                <h3 className="text-2xl font-bold tracking-tight md:text-3xl">
                  {name}
                </h3>

                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="font-medium">10+ years experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {languages.map((language) => (
                      <Badge key={language} variant="outline">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>

                <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
                  {description}
                </p>

              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DriverInfo;

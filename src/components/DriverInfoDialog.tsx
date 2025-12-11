"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Users } from "lucide-react";
import Image from "next/image";
import type { Driver, Vehicle } from "@/cms/types";
import { getLanguageFlag } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driver: Driver;
};

const DriverInfoDialog = ({ open, onOpenChange, driver }: Props) => {
  const {
    name,
    label,
    description,
    photo: { url, alt },
    languages = [],
    vehicles = [],
  } = driver;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Meet Your Driver</DialogTitle>
          <DialogDescription className="sr-only">
            Information about {name}, including languages spoken and available vehicles.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-muted">
              {url ? (
                <Image
                  src={url}
                  alt={alt || name}
                  className="w-full h-full object-cover"
                  width={128}
                  height={128}
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Users className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold">{name}</h3>
              <p className="text-muted-foreground text-sm mt-1">{label}</p>
            </div>
          </div>

          <div>
            <div
              className="text-muted-foreground leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Languages Spoken</h4>
            <div className="flex flex-wrap gap-3 justify-center">
              {languages.map((language, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg"
                >
                  <span className="text-2xl">{getLanguageFlag(language)}</span>
                  <span className="text-sm font-medium">{language}</span>
              </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Available Vehicles</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {vehicles.map((vehicle: Vehicle, index: number) => {
                return (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="aspect-video bg-muted rounded-md overflow-hidden">
                      <Image
                        src={vehicle.image.url}
                        alt={vehicle.image.alt || vehicle.name}
                        className="w-full h-full object-cover"
                        width={400}
                        height={225}
                      />
              </div>

                <div className="flex items-center gap-2 justify-center">
                  <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">
                        {vehicle.seats} Seats
                      </span>
              </div>

                <p className="text-sm text-muted-foreground text-center">
                      {vehicle.description}
                </p>
              </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DriverInfoDialog;

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Calendar, User, Mail, Phone, MapPin, Clock, Euro } from "lucide-react";
import type { Booking } from "@/domain/booking";
import type { Tour } from "@/cms/types";
import { formatDateOnly } from "@/lib/utils";

type Props = {
  booking: Booking;
  tour: Tour;
};

/**
 * CheckoutDetails Component
 *
 * Displays booking and tour information in the checkout page.
 */
const CheckoutDetails = ({ booking, tour }: Props) => {
  const {
    clientName,
    clientEmail,
    clientPhone,
    clientPhoneCountryCode,
    clientCountry,
    clientLanguage,
    clientMessage,
    clientSelectedDate,
    price,
  } = booking;

  const { title, description, duration } = tour;

  const formattedDate = formatDateOnly(clientSelectedDate);

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-2xl">Booking Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">Date</p>
            <p className="text-muted-foreground text-sm">{formattedDate}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">Duration</p>
            <p className="text-muted-foreground text-sm">{duration} hours</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Euro className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">Total Price</p>
            <p className="text-2xl font-bold">€{price.toFixed(2)}</p>
          </div>
        </div>

        <div className="border-t pt-6 space-y-4">
          <h4 className="font-semibold">Contact Information</h4>

          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Name</p>
              <p className="text-muted-foreground text-sm">{clientName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Email</p>
              <p className="text-muted-foreground text-sm">{clientEmail}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Phone</p>
              <p className="text-muted-foreground text-sm">
                {clientPhoneCountryCode} {clientPhone}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Country</p>
              <p className="text-muted-foreground text-sm">{clientCountry}</p>
            </div>
          </div>

          {clientLanguage && (
            <div>
              <p className="font-medium">Preferred Language</p>
              <p className="text-muted-foreground text-sm">{clientLanguage}</p>
            </div>
          )}

          {clientMessage && (
            <div>
              <p className="font-medium">Additional Information</p>
              <p className="text-muted-foreground text-sm">{clientMessage}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutDetails;

"use client";

import { memo, useCallback, type KeyboardEvent } from "react";
import { MessageSquareMore } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BookingPaymentStatus, BookingStatus, type Booking } from "@/domain/booking";
import { toDateOnlyString } from "@/lib/utils";

type Props = {
  booking: Booking;
  onOpenDetails: (booking: Booking) => void;
};

const formatCardDate = (date: string) =>
  toDateOnlyString(date).slice(5).split("-").reverse().join("/");

const getPaymentBadgeClassName = (status: BookingPaymentStatus) => {
  if (status === BookingPaymentStatus.PAID) {
    return "bg-emerald-100 text-emerald-800 border-emerald-200";
  }
  if (status === BookingPaymentStatus.FAILED) {
    return "bg-red-100 text-red-800 border-red-200";
  }
  return "bg-amber-100 text-amber-800 border-amber-200";
};

const getCardBorderClassName = (status: BookingStatus) => {
  if (status === BookingStatus.CONFIRMED) {
    return "border-l-4 border-l-emerald-500";
  }
  if (status === BookingStatus.CANCELLED) {
    return "border-l-4 border-l-red-500";
  }
  return "border-l-4 border-l-amber-500";
};

const BookingCard = ({ booking, onOpenDetails }: Props) => {
  const {
    clientSelectedDate,
    paymentStatus,
    clientName,
    tourId,
    tourTitle,
    clientLanguage,
    clientMessage,
    status,
  } = booking;

  const handleOpen = useCallback(() => {
    onOpenDetails(booking);
  }, [booking, onOpenDetails]);

  const handleCardKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleOpen();
      }
    },
    [handleOpen]
  );

  return (
    <Card
      className={`cursor-pointer border-border p-3 transition-colors hover:bg-muted/40 lg:p-4 ${getCardBorderClassName(
        status
      )}`}
      onClick={handleOpen}
      onKeyDown={handleCardKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Open booking details for ${clientName}`}
    >
      {/* Keep the card compact to make scanning quick on mobile and desktop. */}
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <p className="text-sm font-semibold leading-none text-foreground">
              {formatCardDate(clientSelectedDate)}
            </p>
            <Badge className={getPaymentBadgeClassName(paymentStatus)}>
              {paymentStatus}
            </Badge>
          </div>

          <p className="truncate text-sm font-medium text-foreground">{clientName}</p>
          <p className="truncate text-xs text-muted-foreground">
            {tourTitle || tourId}
          </p>

          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="px-2 py-0.5 font-medium">
              {clientLanguage}
            </Badge>
            {/* Presence indicator only: details are shown in the side sheet. */}
            {clientMessage && (
              <span
                className="inline-flex items-center text-muted-foreground"
                title="Client added a message"
                aria-label="Client added a message"
              >
                <MessageSquareMore className="h-4 w-4" />
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default memo(BookingCard);

"use client";

import { useEffect, useState } from "react";
import { updateBooking } from "@/client/api/bookings";
import type { Booking } from "@/domain/booking";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import BookingDetailsFooter from "./booking-details/BookingDetailsFooter";
import BookingDetailsForm from "./booking-details/BookingDetailsForm";
import BookingDetailsHeader from "./booking-details/BookingDetailsHeader";
import BookingDetailsTourInfo from "./booking-details/BookingDetailsTourInfo";
import type { BookingDetailsDraft, SaveState } from "./booking-details/types";

type Props = {
  booking?: Booking;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookingSaved: (updated: Booking) => void;
};

const BookingDetails = ({
  booking,
  open,
  onOpenChange,
  onBookingSaved,
}: Props) => {
  const [draft, setDraft] = useState<BookingDetailsDraft | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  useEffect(() => {
    if (!booking || !open) {
      setDraft(null);
      return;
    }
    const { status, paymentStatus, paymentMethod, adminNotes } = booking;

    setDraft({
      status,
      paymentStatus,
      paymentMethod: paymentMethod ?? "",
      adminNotes: adminNotes ?? "",
    });
    setSaveState("idle");
  }, [open, booking]);

  useEffect(() => {
    if (!booking || !draft) return;
    const { status, paymentStatus, paymentMethod, adminNotes } = draft;

    if (
      status === booking.status &&
      paymentStatus === booking.paymentStatus &&
      (paymentMethod || null) === booking.paymentMethod &&
      String(adminNotes || "") === String(booking.adminNotes || "")
    ) {
      setSaveState("idle");
      return;
    }
    setSaveState("to-save");
  }, [draft, booking]);

  const handleSave = async () => {
    if (!booking || !draft) return;
    const { status, paymentStatus, paymentMethod, adminNotes } = draft;

    try {
      setSaveState("saving");
      const updated = await updateBooking(booking.id, {
        status,
        paymentStatus,
        paymentMethod: paymentMethod || undefined,
        adminNotes,
      });
      onBookingSaved(updated);
      setSaveState("idle");
    } catch {
      setSaveState("error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="inset-0 h-screen max-w-none translate-x-0 translate-y-0 rounded-none p-4 sm:inset-y-0 sm:left-auto sm:right-0 sm:h-screen sm:max-w-md sm:rounded-none">
        {booking && draft && (
          <>
            <BookingDetailsHeader booking={booking} />

            <div className="mt-2 space-y-4 pb-24">
              <BookingDetailsTourInfo booking={booking} />
              <BookingDetailsForm draft={draft} onDraftChange={setDraft} />
            </div>

            <BookingDetailsFooter
              booking={booking}
              saveState={saveState}
              onSave={handleSave}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetails;

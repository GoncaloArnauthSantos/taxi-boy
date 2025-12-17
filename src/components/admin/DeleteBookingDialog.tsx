"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import type { Booking } from "@/domain/booking";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
  onConfirm: () => void;
  loading?: boolean;
};

const DeleteBookingDialog = ({
  open,
  onOpenChange,
  booking,
  onConfirm,
  loading = false,
}: Props) => {
  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Booking</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this booking? This action cannot be
            undone. The booking will be soft deleted and hidden from the list.
          </DialogDescription>
        </DialogHeader>
        {booking && (
          <div className="py-4 space-y-2">
            <p className="text-sm font-medium">Booking Details:</p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <span className="font-medium">Client:</span> {booking.clientName}
              </p>
              <p>
                <span className="font-medium">Email:</span> {booking.clientEmail}
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {new Date(booking.clientSelectedDate).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Status:</span> {booking.status}
              </p>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBookingDialog;


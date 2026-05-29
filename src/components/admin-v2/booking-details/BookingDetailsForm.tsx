"use client";

import type {
  BookingPaymentMethod,
  BookingPaymentStatus,
  BookingStatus,
} from "@/domain/booking";
import { Textarea } from "@/components/ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  BOOKING_STATUS_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
} from "../constants";
import type { BookingDetailsDraft } from "./types";

type Props = {
  draft: BookingDetailsDraft;
  onDraftChange: (next: BookingDetailsDraft) => void;
};

const BookingDetailsForm = ({ draft, onDraftChange }: Props) => {
  return (
    <div className="grid gap-3">
      <div>
        <label className="text-xs font-semibold uppercase text-muted-foreground">
          Booking status
        </label>
        <Select
          value={draft.status}
          onValueChange={(value) =>
            onDraftChange({ ...draft, status: value as BookingStatus })
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BOOKING_STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase text-muted-foreground">
          Payment status
        </label>
        <Select
          value={draft.paymentStatus}
          onValueChange={(value) =>
            onDraftChange({
              ...draft,
              paymentStatus: value as BookingPaymentStatus,
            })
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAYMENT_STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase text-muted-foreground">
          Payment method
        </label>
        <Select
          value={draft.paymentMethod || "__none__"}
          onValueChange={(value) =>
            onDraftChange({
              ...draft,
              paymentMethod:
                value === "__none__" ? "" : (value as BookingPaymentMethod),
            })
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">Not set</SelectItem>
            {PAYMENT_METHOD_OPTIONS.map((method) => (
              <SelectItem key={method} value={method}>
                {method}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase text-muted-foreground">
          Internal notes
        </label>
        <Textarea
          value={draft.adminNotes}
          onChange={(event) =>
            onDraftChange({ ...draft, adminNotes: event.target.value })
          }
          className="mt-1"
          placeholder="Add private notes for admins/drivers"
        />
      </div>
    </div>
  );
};

export default BookingDetailsForm;

import { toDateOnlyString } from "@/lib/utils";

/**
 * Parses booking date input from API body to a Date instance when valid.
 * Supports YYYY-MM-DD and full ISO date strings.
 */
export const parseBookingDateInput = (value: unknown): Date | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  const dateOnly = toDateOnlyString(value);
  const parsedDate =
    /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? new Date(`${dateOnly}T00:00:00`)
      : new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return undefined;
  }

  return parsedDate;
};

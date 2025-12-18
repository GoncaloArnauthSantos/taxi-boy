/**
 * Booking Reminder Email Template (Client)
 *
 * HTML template for \"don't forget\" reminder email (day before the tour).
 */

import type { Booking } from "@/domain/booking";
import type { Tour } from "@/cms/types";

type Props = {
  booking: Booking;
  tour: Tour;
  bookingDate: string;
};

export const BookingReminderClientTemplate = ({
  booking,
  tour,
  bookingDate,
}: Props): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset=\"utf-8\">
        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
        <title>Tour Reminder</title>
      </head>
      <body style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;\">
        <h1 style=\"color: #2563eb;\">Your tour is tomorrow!</h1>
        
        <p>Hello ${booking.clientName},</p>
        
        <p>This is a friendly reminder that your tour is scheduled for <strong>${bookingDate}</strong>.</p>
        
        <div style=\"background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;\">
          <h2 style=\"margin-top: 0; color: #1f2937;\">Tour Details</h2>
          
          <p><strong>Tour:</strong> ${tour.title}</p>
          <p><strong>Date:</strong> ${bookingDate}</p>
          <p><strong>Status:</strong> ${booking.status}</p>
        </div>
        
        <p>Please make sure to be ready a bit earlier so everything can start on time.</p>
        
        <p>If you need to make any changes or have questions, please contact us by replying to this email.</p>
        
        <p>See you soon,<br>TaxiBoy Team</p>
      </body>
    </html>
  `;
};



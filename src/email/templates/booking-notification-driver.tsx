/**
 * Booking Notification Email Template (Driver)
 *
 * HTML template for driver booking notification email.
 */

import type { Booking } from "@/domain/booking";
import type { Tour } from "@/cms/types";

type Props = {
  booking: Booking;
  tour: Tour;
  bookingDate: string;
  price: string;
};

export const BookingNotificationDriverTemplate = ({
  booking,
  tour,
  bookingDate,
  price,
}: Props): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Booking Notification</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">New Booking Received</h1>
        
        <p>You have a new booking that requires your attention.</p>
        
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h2 style="margin-top: 0; color: #1f2937;">Tour Details</h2>
          <p><strong>Tour:</strong> ${tour.title}</p>
          <p><strong>Date:</strong> ${bookingDate}</p>
          <p><strong>Price:</strong> ${price}</p>
          <p><strong>Duration:</strong> ${tour.duration} hours</p>
        </div>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #1f2937;">Client Information</h2>
          
          <p><strong>Name:</strong> ${booking.clientName}</p>
          <p><strong>Email:</strong> ${booking.clientEmail}</p>
          <p><strong>Phone:</strong> ${booking.clientPhoneCountryCode} ${booking.clientPhone}</p>
          <p><strong>Country:</strong> ${booking.clientCountry}</p>
          <p><strong>Language:</strong> ${booking.clientLanguage}</p>
          ${
            booking.clientMessage
              ? `<p><strong>Message:</strong> ${booking.clientMessage}</p>`
              : ""
          }
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background-color: #eff6ff; border-radius: 8px;">
          <p style="margin: 0;"><strong>Booking ID:</strong> ${booking.id}</p>
          <p style="margin: 5px 0 0 0;"><strong>Status:</strong> ${booking.status}</p>
        </div>
        
        <p style="margin-top: 30px;">Please review this booking and confirm availability.</p>
        
        <p>Best regards,<br>TaxiBoy System</p>
      </body>
    </html>
  `;
};
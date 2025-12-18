/**
 * Booking Confirmation Email Template (Client)
 *
 * HTML template for client booking confirmation email.
 */

import type { Booking } from "@/domain/booking";
import type { Tour } from "@/cms/types";

type Props = {
  booking: Booking;
  tour: Tour;
  bookingDate: string;
  price: string;
};

export const BookingConfirmationClientTemplate = ({
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
        <title>Booking Confirmation</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">Booking Confirmed!</h1>
        
        <p>Hello ${booking.clientName},</p>
        
        <p>Thank you for your booking! We're excited to have you join us on this tour.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #1f2937;">Booking Details</h2>
          
          <p><strong>Tour:</strong> ${tour.title}</p>
          <p><strong>Date:</strong> ${bookingDate}</p>
          <p><strong>Price:</strong> ${price}</p>
          <p><strong>Status:</strong> ${booking.status}</p>
          ${
            booking.clientMessage
              ? `<p><strong>Your Message:</strong> ${booking.clientMessage}</p>`
              : ""
          }
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p><strong>Contact Information:</strong></p>
          <p>Email: ${booking.clientEmail}</p>
          <p>Phone: ${booking.clientPhoneCountryCode} ${booking.clientPhone}</p>
          <p>Country: ${booking.clientCountry}</p>
        </div>
        
        <p style="margin-top: 30px;">We'll be in touch soon with more details about your tour.</p>
        
        <p>Best regards,<br>TaxiBoy Team</p>
      </body>
    </html>
  `;
};
export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
}
export enum BookingPaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
}

export enum BookingPaymentMethod {
  BANK_TRANSFER = "bank_transfer",
  CARD = "card",
  CASH = "cash",
}

export type Booking = {
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string
  clientPhoneCountryCode: string
  clientCountry: string
  clientLanguage: string
  clientSelectedDate: string
  clientMessage: string | null
  tourId: string  
  createdAt: string
  updatedAt: string
  status: BookingStatus
  price: number
  paymentStatus: BookingPaymentStatus
  paymentMethod: BookingPaymentMethod | null
  stripeSessionId?: string | null
  stripePaymentIntentId?: string | null
  paidAt?: string | null
  deletedAt: string | null
}

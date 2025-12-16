
export type BookingStatus = "pending" | "confirmed" | "cancelled"
export type BookingPaymentStatus = "pending" | "paid" | "failed"
export type BookingPaymentMethod = "bank_transfer" | "card" | "cash"

export type Booking = {
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string
  clientPhoneCountryCode: string
  clientCountry: string
  clientLanguage: string
  clientSelectedDate: string
  clientMessage?: string
  tourId: string
  createdAt: string
  updatedAt: string
  status: BookingStatus
  price: number
  paymentStatus: BookingPaymentStatus
  paymentMethod?: BookingPaymentMethod
}

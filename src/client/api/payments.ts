type CreateCheckoutSessionResponse = {
  url: string;
};

type ApiErrorResponse = {
  error?: string;
  message?: string;
};

export class PaymentApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "PaymentApiError";
  }
}

/**
 * Creates a Stripe checkout session for an existing booking.
 */
export const createCheckoutSession = async (
  bookingId: string
): Promise<CreateCheckoutSessionResponse> => {
  const response = await fetch("/api/payments/create-checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookingId }),
  });

  const data = (await response.json()) as
    | CreateCheckoutSessionResponse
    | ApiErrorResponse;

  if (!response.ok) {
    throw new PaymentApiError(
      (data as ApiErrorResponse).message || (data as ApiErrorResponse).error || "Failed to create checkout session",
      response.status
    );
  }

  return data as CreateCheckoutSessionResponse;
};

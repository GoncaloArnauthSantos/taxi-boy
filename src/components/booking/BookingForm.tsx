"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { COUNTRY_CODES } from "@/constants";
import { cn } from "@/lib/utils";
import type { Tour } from "@/cms/types";
import FormSelect from "./FormSelect";
import FormDatePicker from "./FormDatePicker";
import { bookingFormSchema } from "@/app/api/bookings/schema";
import { createBooking, BookingApiError } from "@/client/api/bookings";
import { logError } from "@/cms/shared/logger";

type Props = {
  setSubmitted: (submitted: boolean) => void;
  tours: Tour[];
  languages: string[];
  unavailableDates: Date[];
};

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const BookingForm = ({ setSubmitted, tours, languages, unavailableDates }: Props) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    mode: "onSubmit", // Only validate on submit, not on change/blur
    defaultValues: {
      phonePhoneCountryCode: "+351",
      message: "",
      tourId: "",
      language: "",
    },
  });

  const onSubmit = async (formData: BookingFormValues) => {
    try {
      setSubmitError(null);
      await createBooking(formData);
      setSubmitted(true);
      reset();
    } catch (error) {
      logError("Error submitting booking", error, { formData: formData, function: "onSubmit" });
      
      const errorMessage =
        error instanceof BookingApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Failed to submit booking. Please try again.";
      
      setSubmitError(errorMessage);
    }
  };

  // Prepare options for selects
  const languageOptions = languages.map((lang) => ({
    value: lang,
    label: lang,
  }));

  const tourOptions = tours.map((tour) => ({
    value: tour.id,
    label: `${tour.title} - €${tour.price}`,
  }));

  const phonePhoneCountryCodeOptions = COUNTRY_CODES.map((item) => ({
    value: item.code,
    label: `${item.code} ${item.country}`,
  }));

  return (
    <Card className="border-border">
      <CardHeader className="space-y-1 pb-8">
        <CardTitle className="text-2xl">Booking Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="John Silva"
              {...register("name")}
              className={cn(errors.name && "border-destructive")}
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && (
              <p className="text-sm text-destructive" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register("email")}
                className={cn(errors.email && "border-destructive")}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <FormSelect
                  name="phonePhoneCountryCode"
                  control={control}
                  options={phonePhoneCountryCodeOptions}
                  error={errors.phonePhoneCountryCode?.message}
                  hideLabel
                  defaultValue="+351"
                  className="w-[140px]"
                />
                <div className="flex-1 space-y-2">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="912 345 678"
                    {...register("phoneNumber")}
                    className={cn(
                      "flex-1",
                      errors.phoneNumber && "border-destructive"
                    )}
                    aria-invalid={errors.phoneNumber ? "true" : "false"}
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-destructive" role="alert">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Country and Language */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">
                Country <span className="text-destructive">*</span>
              </Label>
              <Input
                id="country"
                placeholder="United States"
                {...register("country")}
                className={cn(errors.country && "border-destructive")}
                aria-invalid={errors.country ? "true" : "false"}
              />
              {errors.country && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.country.message}
                </p>
              )}
            </div>

            {/* Language Selection */}
            <FormSelect
              name="language"
              control={control}
              label="Preferred Language"
              placeholder="Select language"
              options={languageOptions}
              error={errors.language?.message}
              required
            />
          </div>

          {/* Tour Selection */}
          <FormSelect
            name="tourId"
            control={control}
            label="Select Tour"
            placeholder="Choose a tour"
            options={tourOptions}
            error={errors.tourId?.message}
            required
          />

          {/* Date Picker */}
          <FormDatePicker
            name="date"
            control={control}
            label="Preferred Date"
            error={errors.date?.message}
            required
            unavailableDates={unavailableDates}
          />

          {/* Additional Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Additional Information</Label>
            <Textarea
              id="message"
              placeholder="Any special requests or questions?"
              rows={4}
              {...register("message")}
              className={cn(errors.message && "border-destructive")}
              aria-invalid={errors.message ? "true" : "false"}
            />
            {errors.message && (
              <p className="text-sm text-destructive" role="alert">
                {errors.message.message}
              </p>
            )}
          </div>

          {submitError && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3">
              <p className="text-sm text-destructive" role="alert">
                {submitError}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <Button
              type="submit"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Booking..." : "Booking Request"}
            </Button>
          </div>

          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            By submitting this form, you agree to be contacted via email or
            WhatsApp to confirm your booking details.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;

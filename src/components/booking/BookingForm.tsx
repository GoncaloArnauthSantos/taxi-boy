"use client";

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

type Props = {
  setSubmitted: (submitted: boolean) => void;
  tours: Tour[];
  languages: string[];
};

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const BookingForm = ({ setSubmitted, tours, languages }: Props) => {
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
      countryCode: "+351",
      message: "",
      tour: "",
      language: "",
    },
  });

  const onSubmit = async (formData: BookingFormValues) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Here you would send data to your API
      // Example: await fetch('/api/bookings', { method: 'POST', body: JSON.stringify(formData) })
      void formData; // Will be used when API is integrated

      setSubmitted(true);
      reset();
    } catch (error) {
      // Handle error - you could add toast notification here
      // For now, we'll just prevent submission
      throw error;
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

  const countryCodeOptions = COUNTRY_CODES.map((item) => ({
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
                  name="countryCode"
                  control={control}
                  options={countryCodeOptions}
                  error={errors.countryCode?.message}
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
            name="tour"
            control={control}
            label="Select Tour"
            placeholder="Choose a tour"
            options={tourOptions}
            error={errors.tour?.message}
            required
          />

          {/* Date Picker */}
          <FormDatePicker
            name="date"
            control={control}
            label="Preferred Date"
            error={errors.date?.message}
            required
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

          <Button
            type="submit"
            className="w-full sm:w-auto mx-auto block bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Booking..." : "Booking Request"}
          </Button>

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

// Zod validation schema
const bookingFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  email: z.string().email("Please enter a valid email address"),
  countryCode: z.string().min(1, "Country code is required"),
  phoneNumber: z
    .string()
    .min(6, "Phone number must be at least 6 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(
      /^[\d\s\-\(\)]+$/,
      "Phone number can only contain digits, spaces, hyphens, and parentheses"
    ),
  country: z
    .string()
    .min(2, "Country name must be at least 2 characters")
    .max(100, "Country name must be less than 100 characters"),
  language: z.string().min(1, "Please select a preferred language"),
  tour: z.string().min(1, "Please select a tour"),
  date: z
    .date({
      message: "Please select a preferred date",
    })
    .refine(
      (date) => date >= new Date(new Date().setHours(0, 0, 0, 0)),
      "Date must be today or in the future"
    ),
  message: z
    .string()
    .max(1000, "Message must be less than 1000 characters")
    .optional(),
});

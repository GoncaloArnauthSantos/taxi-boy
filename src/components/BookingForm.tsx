"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { tours } from "@/app/lib/tours";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/Popover";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/Calendar";
import { COUNTRY_CODES, LANGUAGES } from "@/constants";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type Props = {
  setSubmitted: (submitted: boolean) => void;
};

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const BookingForm = ({ setSubmitted }: Props) => {
  const [calendarOpen, setCalendarOpen] = useState(false)

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
      tour: "", // Always provide default value for controlled components
      language: "", // Always provide default value for controlled components
      // date is optional, so we don't set a default (it will be undefined, which is fine for Date)
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

  const formatDate = (date: Date) => {
    return format(date, "EEEE, MMMM d, yyyy");
  };

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
                <Controller
                  name="countryCode"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || "+351"}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className={cn(
                          "w-[140px]",
                          errors.countryCode && "border-destructive"
                        )}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRY_CODES.map((item) => (
                          <SelectItem key={item.code} value={item.code}>
                            {item.code} {item.country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
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
              {errors.countryCode && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.countryCode.message}
                </p>
              )}
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
            <div className="space-y-2">
              <Label htmlFor="language">
                Preferred Language <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="language"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="language"
                      className={cn(errors.language && "border-destructive")}
                    >
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((language) => (
                        <SelectItem
                          key={language.code}
                          value={language.code}
                          className="cursor-pointer"
                        >
                          {language.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.language && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.language.message}
                </p>
              )}
            </div>
          </div>

          {/* Tour Selection */}
          <div className="space-y-2">
            <Label htmlFor="tour">
              Select Tour <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="tour"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="tour"
                    className={cn(errors.tour && "border-destructive")}
                  >
                    <SelectValue placeholder="Choose a tour" />
                  </SelectTrigger>
                  <SelectContent>
                    {tours.map((tour) => (
                      <SelectItem
                        key={tour.id}
                        value={tour.id}
                        className="cursor-pointer"
                      >
                        {tour.title} - €{tour.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.tour && (
              <p className="text-sm text-destructive" role="alert">
                {errors.tour.message}
              </p>
            )}
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label>
              Preferred Date <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal cursor-pointer",
                        !field.value && "text-muted-foreground",
                        errors.date && "border-destructive",
                        "hover:bg-accent transition-colors"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        formatDate(field.value)
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 shadow-lg" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={(date) => {
                        field.onChange(date || undefined)
                        // Close popover when date is selected
                        if (date) {
                          setCalendarOpen(false)
                        }
                      }}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.date && (
              <p className="text-sm text-destructive" role="alert">
                {errors.date.message}
              </p>
            )}
          </div>

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

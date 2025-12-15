"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/Button"
import { Calendar } from "@/components/ui/Calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover"
import { Label } from "@/components/ui/label"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form"

type Props<T extends FieldValues> = {
  name: FieldPath<T>
  control: Control<T>
  label: string
  error?: string
  required?: boolean
  className?: string
}

const FormDatePicker = <T extends FieldValues>({
  name,
  control,
  label,
  error,
  required = false,
  className,
}: Props<T>) => {
  const [calendarOpen, setCalendarOpen] = useState(false)

  const formatDate = useCallback((date: Date) => {
    return format(date, "EEEE, MMMM d, yyyy")
  }, [])

  const createDateSelectHandler = useCallback(
    (onChange: (value: Date | undefined) => void) => {
      return (date: Date | undefined) => {
        onChange(date || undefined)
        // Close popover when date is selected
        if (date) {
          setCalendarOpen(false)
        }
      }
    },
    []
  )

  const isDateDisabled = useCallback((date: Date) => {
    return date < new Date(new Date().setHours(0, 0, 0, 0))
  }, [])

  return (
    <div className={cn("space-y-2", className)}>
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const handleDateSelect = createDateSelectHandler(field.onChange)

          return (
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal cursor-pointer",
                    !field.value && "text-muted-foreground",
                    error && "border-destructive",
                    "hover:bg-accent transition-colors",
                    "focus-visible:ring-0 focus-visible:border-2"
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
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value || undefined}
                  onSelect={handleDateSelect}
                  disabled={isDateDisabled}
                />
              </PopoverContent>
            </Popover>
          )
        }}
      />
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default FormDatePicker


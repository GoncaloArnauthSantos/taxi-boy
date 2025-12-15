"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form"

type Props<T extends FieldValues> = {
  name: FieldPath<T>
  control: Control<T>
  label?: string
  placeholder?: string
  options: Array<{ value: string; label: string }>
  error?: string
  required?: boolean
  className?: string
  hideLabel?: boolean
  defaultValue?: string
}

const FormSelect = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  options,
  error,
  required = false,
  className,
  hideLabel = false,
  defaultValue = "",
}: Props<T>) => {
  return (
    <div className={cn(!hideLabel && "space-y-2", className)}>
      {!hideLabel && label && (
        <Label htmlFor={name}>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select value={field.value || defaultValue} onValueChange={field.onChange}>
            <SelectTrigger
              id={name}
              className={cn(error && "border-destructive")}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="cursor-pointer"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default FormSelect


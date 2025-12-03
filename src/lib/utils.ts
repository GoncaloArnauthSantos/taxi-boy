import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const LANGUAGE_FLAGS: Record<string, string> = {
  English: "🇬🇧",
  French: "🇫🇷",
  German: "🇩🇪",
  Portuguese: "🇵🇹",
  Spanish: "🇪🇸",
  Italian: "🇮🇹",
};

export function getLanguageFlag(language: string): string {
  return LANGUAGE_FLAGS[language] || "🌐";
}
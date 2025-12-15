import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Globe,
  Clock,
  Star,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

const LANGUAGE_FLAGS: Record<string, string> = {
  English: "🇬🇧",
  French: "🇫🇷",
  German: "🇩🇪",
  Portuguese: "🇵🇹",
  Spanish: "🇪🇸",
  Italian: "🇮🇹",
};

export const getLanguageFlag = (language: string): string => {
  return LANGUAGE_FLAGS[language] || "🌐";
};

/**
 * Icon name to Lucide icon component mapping
 */
const ICON_MAP: Record<string, LucideIcon> = {
  Globe,
  Clock,
  Star,
  MessageCircle,
};

/**
 * Get a Lucide icon component by name
 *
 * @param iconName - The name of the icon (must match a key in ICON_MAP)
 * @returns The icon component or null if not found
 */
export const getIcon = (iconName?: string): LucideIcon | null => {
  if (!iconName) return null;
  return ICON_MAP[iconName] || null;
};

/**
 * Build a mailto link with subject "Private tour request".
 */
export const buildMailtoLink = (email: string): string => {
  const emailSubject = "Private tour request";

  const params = new URLSearchParams();
  params.set("subject", emailSubject);

  return `mailto:${email}?${params.toString()}`;
};


export const phonePreview = (phone: string): string => {
  return `(${phone.slice(0, 4)}) ${phone.slice(4)}`;
};
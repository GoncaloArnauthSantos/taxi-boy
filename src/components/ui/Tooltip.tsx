import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  content: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
};

/**
 * Lightweight tooltip for simple hover/focus hints.
 * Uses CSS only, so it is easy to reuse without extra dependencies.
 */
const Tooltip = ({ content, children, disabled = false, className }: Props) => {
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <span className={cn("group relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-max max-w-xs -translate-x-1/2 rounded-md bg-foreground px-3 py-1.5 text-xs text-background opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-80 group-focus-within:opacity-80"
      >
        {content}
      </span>
    </span>
  );
};

export default Tooltip;


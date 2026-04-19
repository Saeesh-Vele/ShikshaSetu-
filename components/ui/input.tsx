import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Layout & sizing
        "flex h-10 w-full min-w-0",
        "rounded-[var(--radius-lg)]",
        "px-4 py-2",
        // Background — very subtle indigo tint
        "bg-[oklch(0.12_0.02_275)] border border-[var(--border)]",
        // Typography
        "text-[var(--text-sm)] text-foreground",
        "placeholder:text-muted-foreground/60",
        // File input
        "file:text-foreground file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        // Selection
        "selection:bg-primary/30 selection:text-foreground",
        // Shadow
        "shadow-[var(--shadow-xs)]",
        // Transition
        "transition-[color,box-shadow,border-color] duration-[var(--duration-fast)]",
        "outline-none",
        // Focus — indigo border + glow ring
        "focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_oklch(0.637_0.237_275_/_0.20)]",
        // Disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
        // Invalid
        "aria-invalid:border-destructive aria-invalid:shadow-[0_0_0_3px_oklch(0.60_0.25_30_/_0.20)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }

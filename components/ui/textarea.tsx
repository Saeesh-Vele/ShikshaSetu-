import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Layout
        "flex field-sizing-content min-h-[80px] w-full",
        "rounded-[var(--radius-lg)]",
        "px-4 py-3",
        // Background — subtle indigo tint matching Input
        "bg-[oklch(0.12_0.02_275)] border border-[var(--border)]",
        // Typography
        "text-[var(--text-sm)] text-foreground",
        "placeholder:text-muted-foreground/60",
        "leading-[var(--leading-relaxed)]",
        // Selection
        "selection:bg-primary/30 selection:text-foreground",
        // Shadow
        "shadow-[var(--shadow-xs)]",
        // Transition
        "transition-[color,box-shadow,border-color] duration-[var(--duration-fast)]",
        "outline-none resize-y",
        // Focus
        "focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_oklch(0.637_0.237_275_/_0.20)]",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-40",
        // Invalid
        "aria-invalid:border-destructive aria-invalid:shadow-[0_0_0_3px_oklch(0.60_0.25_30_/_0.20)]",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

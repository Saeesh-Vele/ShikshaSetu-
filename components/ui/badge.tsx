import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  [
    "inline-flex items-center justify-center gap-1",
    "rounded-[var(--radius-full)] border",
    "px-2.5 py-0.5",
    "text-xs font-semibold tracking-[var(--tracking-wide)]",
    "w-fit whitespace-nowrap shrink-0",
    "[&>svg]:size-3 [&>svg]:pointer-events-none",
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
    "transition-all duration-[var(--duration-fast)]",
    "overflow-hidden",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow-sm)]",
        secondary:
          "border-[var(--border)] bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline:
          "border-primary/50 text-primary bg-transparent",
        glow:
          "border-transparent bg-[var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]",
        muted:
          "border-[var(--border)] bg-muted text-muted-foreground",
        accent:
          "border-transparent bg-accent text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

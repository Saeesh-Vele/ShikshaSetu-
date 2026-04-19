import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-semibold tracking-wide select-none",
    "transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:opacity-40",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
    "aria-invalid:ring-destructive/30 aria-invalid:border-destructive",
    "active:scale-[0.97]",
  ].join(" "),
  {
    variants: {
      variant: {
        /* PRIMARY — vivid indigo gradient */
        default: [
          "[background:linear-gradient(135deg,oklch(0.637_0.237_275)_0%,oklch(0.65_0.25_290)_100%)]",
          "text-white border border-transparent",
          "shadow-[0_4px_16px_oklch(0.637_0.237_275_/_0.45)]",
          "hover:shadow-[0_6px_24px_oklch(0.637_0.237_275_/_0.65)] hover:brightness-110",
        ].join(" "),

        /* DESTRUCTIVE */
        destructive: [
          "bg-destructive text-white border border-transparent",
          "shadow-[0_2px_8px_oklch(0.60_0.25_30_/_0.4)]",
          "hover:bg-[var(--destructive-hover)] hover:shadow-[0_4px_16px_oklch(0.60_0.25_30_/_0.5)]",
        ].join(" "),

        /* OUTLINE — glass with indigo border */
        outline: [
          "[background:oklch(0.12_0.02_275_/_0.6)]",
          "backdrop-blur-md",
          "border border-[oklch(0.637_0.237_275_/_0.30)]",
          "text-foreground",
          "hover:[background:oklch(0.637_0.237_275_/_0.15)]",
          "hover:border-[oklch(0.637_0.237_275_/_0.55)]",
          "hover:shadow-[0_0_12px_oklch(0.637_0.237_275_/_0.25)]",
        ].join(" "),

        /* SECONDARY */
        secondary: [
          "bg-secondary text-secondary-foreground border border-[var(--border)]",
          "hover:bg-[var(--secondary-hover)] hover:border-[var(--border-strong)]",
          "shadow-[var(--shadow-xs)]",
        ].join(" "),

        /* GHOST */
        ghost: [
          "bg-transparent text-muted-foreground border border-transparent",
          "hover:[background:oklch(0.637_0.237_275_/_0.12)] hover:text-primary",
        ].join(" "),

        /* LINK */
        link: [
          "text-primary underline-offset-4 border-0 p-0 h-auto",
          "hover:underline hover:text-[var(--primary-hover)]",
        ].join(" "),

        /* GLASS — prominent glass button */
        glass: [
          "[background:oklch(0.14_0.025_275_/_0.7)]",
          "backdrop-blur-md",
          "border border-[oklch(0.637_0.237_275_/_0.25)]",
          "text-foreground shadow-[var(--shadow-md)]",
          "hover:shadow-[0_0_20px_oklch(0.637_0.237_275_/_0.30)]",
          "hover:border-[oklch(0.637_0.237_275_/_0.45)]",
        ].join(" "),
      },
      size: {
        xs:        "h-7 rounded-[var(--radius-md)] px-2.5 text-xs gap-1",
        sm:        "h-8 rounded-[var(--radius-md)] px-3 text-sm",
        default:   "h-10 rounded-[var(--radius-lg)] px-5 text-sm",
        lg:        "h-12 rounded-[var(--radius-lg)] px-7 text-base",
        xl:        "h-14 rounded-[var(--radius-xl)] px-8 text-base",
        icon:      "size-10 rounded-[var(--radius-lg)]",
        "icon-sm": "size-8 rounded-[var(--radius-md)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

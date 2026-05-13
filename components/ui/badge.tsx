import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#7C3AED]/20 text-purple-300 border-purple-500/30",
        secondary:
          "border-transparent bg-[#1F2937] text-gray-300 border-gray-600",
        destructive:
          "border-transparent bg-red-500/10 text-red-400 border-red-500/30",
        outline: "text-gray-300 border-[#1F2937]",
        success:
          "border-transparent bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        warning:
          "border-transparent bg-amber-500/10 text-amber-400 border-amber-500/30",
        info:
          "border-transparent bg-blue-500/10 text-blue-400 border-blue-500/30",
        purple:
          "border-transparent bg-purple-500/10 text-purple-400 border-purple-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

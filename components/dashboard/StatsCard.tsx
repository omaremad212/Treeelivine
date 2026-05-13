"use client"

import React from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn, formatCurrency, formatNumber } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: React.ReactNode
  iconBg?: string
  format?: "currency" | "number" | "raw"
  delay?: number
}

export function StatsCard({
  title,
  value,
  change,
  changeLabel = "vs last month",
  icon,
  iconBg = "bg-[#7C3AED]/15",
  format = "raw",
  delay = 0,
}: StatsCardProps) {
  const formattedValue = React.useMemo(() => {
    if (typeof value === "number") {
      if (format === "currency") return formatCurrency(value)
      if (format === "number") return formatNumber(value)
    }
    return value
  }, [value, format])

  const isPositive = change !== undefined && change > 0
  const isNegative = change !== undefined && change < 0
  const isNeutral = change !== undefined && change === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      <Card className="p-5 relative overflow-hidden group hover:border-[#7C3AED]/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#7C3AED]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-400 font-medium">{title}</p>
            <motion.p
              className="text-2xl font-bold text-white mt-1 tracking-tight"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: delay + 0.1 }}
            >
              {formattedValue}
            </motion.p>

            {change !== undefined && (
              <div className="flex items-center gap-1.5 mt-2">
                <div
                  className={cn(
                    "flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-semibold",
                    isPositive && "bg-emerald-500/10 text-emerald-400",
                    isNegative && "bg-red-500/10 text-red-400",
                    isNeutral && "bg-gray-500/10 text-gray-400"
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : isNegative ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : (
                    <Minus className="w-3 h-3" />
                  )}
                  <span>
                    {isPositive ? "+" : ""}
                    {change}%
                  </span>
                </div>
                <span className="text-xs text-gray-500">{changeLabel}</span>
              </div>
            )}
          </div>

          <div
            className={cn(
              "flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center",
              iconBg
            )}
          >
            {icon}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const topProducts = [
  {
    id: "1",
    name: "Premium ERP License",
    category: "Software",
    revenue: 84500,
    units: 45,
    percentage: 92,
  },
  {
    id: "2",
    name: "Cloud Storage Pro",
    category: "Services",
    revenue: 62800,
    units: 128,
    percentage: 78,
  },
  {
    id: "3",
    name: "Analytics Dashboard",
    category: "Software",
    revenue: 48200,
    units: 67,
    percentage: 65,
  },
  {
    id: "4",
    name: "API Integration Kit",
    category: "Developer Tools",
    revenue: 38900,
    units: 89,
    percentage: 52,
  },
  {
    id: "5",
    name: "Support Package",
    category: "Services",
    revenue: 29700,
    units: 203,
    percentage: 38,
  },
]

export function TopProducts() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Top Products</CardTitle>
          <p className="text-sm text-gray-400 mt-1">By revenue this month</p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/products" className="flex items-center gap-1">
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {topProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-[#7C3AED]/20 to-[#10B981]/20 border border-[#7C3AED]/20 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-purple-400">
                    #{index + 1}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate group-hover:text-purple-300 transition-colors">
                    {product.name}
                  </p>
                  <p className="text-[11px] text-gray-500">{product.category}</p>
                </div>
              </div>
              <div className="text-right ml-2 shrink-0">
                <p className="text-sm font-semibold text-white">
                  {formatCurrency(product.revenue)}
                </p>
                <p className="text-[11px] text-gray-500">{product.units} units</p>
              </div>
            </div>
            <Progress value={product.percentage} className="h-1.5" />
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}

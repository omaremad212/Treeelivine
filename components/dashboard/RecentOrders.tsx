"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const recentOrders = [
  {
    id: "1",
    orderNumber: "TL-12847",
    customer: "Acme Corporation",
    amount: 4250.00,
    status: "DELIVERED",
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    items: 5,
  },
  {
    id: "2",
    orderNumber: "TL-12846",
    customer: "TechStart Inc",
    amount: 1830.50,
    status: "PROCESSING",
    date: new Date(Date.now() - 5 * 60 * 60 * 1000),
    items: 3,
  },
  {
    id: "3",
    orderNumber: "TL-12845",
    customer: "Global Ventures",
    amount: 9120.00,
    status: "SHIPPED",
    date: new Date(Date.now() - 8 * 60 * 60 * 1000),
    items: 12,
  },
  {
    id: "4",
    orderNumber: "TL-12844",
    customer: "DataSystems LLC",
    amount: 550.75,
    status: "PENDING",
    date: new Date(Date.now() - 12 * 60 * 60 * 1000),
    items: 2,
  },
  {
    id: "5",
    orderNumber: "TL-12843",
    customer: "Nexus Partners",
    amount: 3400.00,
    status: "CANCELLED",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    items: 7,
  },
]

const statusLabel: Record<string, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
}

export function RecentOrders() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Recent Orders</CardTitle>
          <p className="text-sm text-gray-400 mt-1">Last 24 hours</p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/orders" className="flex items-center gap-1">
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-[#1F2937]/50">
          {recentOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 px-6 py-3.5 hover:bg-[#7C3AED]/5 transition-colors cursor-pointer group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">
                    {order.orderNumber}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor(order.status)}`}
                  >
                    {statusLabel[order.status]}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 truncate">
                  {order.customer} • {order.items} items
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-white">
                  {formatCurrency(order.amount)}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {formatDate(order.date)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

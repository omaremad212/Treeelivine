"use client"

import React from "react"
import { motion } from "framer-motion"
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Plus,
  FileText,
  TrendingUp,
  Zap,
} from "lucide-react"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { RevenueChart } from "@/components/dashboard/RevenueChart"
import { SalesChart } from "@/components/dashboard/SalesChart"
import { RecentOrders } from "@/components/dashboard/RecentOrders"
import { TopProducts } from "@/components/dashboard/TopProducts"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const quickActions = [
  { href: "/orders", label: "New Order", icon: Plus, color: "bg-[#7C3AED]/10 text-purple-400 border-purple-500/20" },
  { href: "/customers", label: "Add Customer", icon: Users, color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { href: "/products", label: "Add Product", icon: Package, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  { href: "/reports", label: "View Reports", icon: FileText, color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
]

export default function DashboardPage() {
  return (
    <div>
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">
            Welcome back! Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/reports">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/orders">
              <Plus className="w-4 h-4" />
              New Order
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Revenue"
          value={284521}
          format="currency"
          change={12.5}
          icon={<DollarSign className="w-5 h-5 text-purple-400" />}
          iconBg="bg-[#7C3AED]/15"
          delay={0}
        />
        <StatsCard
          title="Total Orders"
          value={1247}
          format="number"
          change={8.2}
          icon={<ShoppingCart className="w-5 h-5 text-blue-400" />}
          iconBg="bg-blue-500/15"
          delay={0.05}
        />
        <StatsCard
          title="Total Customers"
          value={4832}
          format="number"
          change={5.1}
          icon={<Users className="w-5 h-5 text-emerald-400" />}
          iconBg="bg-emerald-500/15"
          delay={0.1}
        />
        <StatsCard
          title="Products in Stock"
          value={312}
          format="number"
          change={-2.3}
          icon={<Package className="w-5 h-5 text-amber-400" />}
          iconBg="bg-amber-500/15"
          delay={0.15}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-2"
        >
          <RevenueChart />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <SalesChart />
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2"
        >
          <RecentOrders />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <TopProducts />
        </motion.div>
      </div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-base font-semibold text-white mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="hover:border-[#7C3AED]/30 transition-all duration-200 cursor-pointer group hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-900/10">
                <CardContent className="flex flex-col items-center gap-2 py-4 px-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${action.color} group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors text-center">
                    {action.label}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts"
import { PageHeader } from "@/components/shared/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"
import { Download, FileText, BarChart3, TrendingUp, Users } from "lucide-react"

const revenueData = [
  { month: "Jan", revenue: 185000, profit: 93000 },
  { month: "Feb", revenue: 210000, profit: 112000 },
  { month: "Mar", revenue: 198000, profit: 93000 },
  { month: "Apr", revenue: 245000, profit: 135000 },
  { month: "May", revenue: 228000, profit: 120000 },
  { month: "Jun", revenue: 267000, profit: 145000 },
  { month: "Jul", revenue: 289000, profit: 161000 },
  { month: "Aug", revenue: 312000, profit: 177000 },
  { month: "Sep", revenue: 278000, profit: 148000 },
  { month: "Oct", revenue: 334000, profit: 192000 },
  { month: "Nov", revenue: 298000, profit: 160000 },
  { month: "Dec", revenue: 356000, profit: 198000 },
]

const customerGrowthData = [
  { month: "Jan", customers: 3800 },
  { month: "Feb", customers: 3920 },
  { month: "Mar", customers: 4010 },
  { month: "Apr", customers: 4180 },
  { month: "May", customers: 4290 },
  { month: "Jun", customers: 4410 },
  { month: "Jul", customers: 4520 },
  { month: "Aug", customers: 4620 },
  { month: "Sep", customers: 4690 },
  { month: "Oct", customers: 4750 },
  { month: "Nov", customers: 4800 },
  { month: "Dec", customers: 4832 },
]

const productSalesData = [
  { product: "ERP License", sales: 45000, units: 45 },
  { product: "Cloud Storage", sales: 28000, units: 128 },
  { product: "Analytics", sales: 22000, units: 67 },
  { product: "API Kit", sales: 18000, units: 89 },
  { product: "Support Pkg", sales: 15000, units: 203 },
]

const reportTypes = [
  { id: "revenue", label: "Revenue Report", icon: TrendingUp, color: "text-purple-400" },
  { id: "orders", label: "Orders Report", icon: FileText, color: "text-blue-400" },
  { id: "customers", label: "Customer Report", icon: Users, color: "text-emerald-400" },
  { id: "products", label: "Product Report", icon: BarChart3, color: "text-amber-400" },
]

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState("revenue")

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Detailed business insights and performance metrics"
        actions={
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4" />
            Export All
          </Button>
        }
      />

      {/* Report type cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {reportTypes.map((report, i) => (
          <motion.button
            key={report.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedReport(report.id)}
            className={`p-4 rounded-xl border transition-all duration-200 text-left ${
              selectedReport === report.id
                ? "border-[#7C3AED] bg-[#7C3AED]/10"
                : "border-[#1F2937] bg-[#111827] hover:border-[#7C3AED]/30"
            }`}
          >
            <report.icon className={`w-5 h-5 ${report.color} mb-2`} />
            <p className="text-sm font-medium text-white">{report.label}</p>
          </motion.button>
        ))}
      </div>

      <Tabs value={selectedReport} onValueChange={setSelectedReport}>
        <TabsContent value="revenue">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Revenue & Profit Trend</CardTitle>
                  <p className="text-sm text-gray-400 mt-1">12-month overview</p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                    <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1a2030", border: "1px solid #2D3748", borderRadius: "8px" }}
                      formatter={(v) => [formatCurrency(Number(v)), ""]}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#7C3AED" strokeWidth={2} fill="url(#revGrad)" dot={false} />
                    <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} fill="url(#profGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Total Revenue", value: "$3.29M", change: "+12.5%" },
                { label: "Total Profit", value: "$1.73M", change: "+18.7%" },
                { label: "Avg. Monthly", value: "$274K", change: "+8.2%" },
              ].map((stat) => (
                <Card key={stat.label} className="p-5">
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <p className="text-sm text-emerald-400 mt-1">{stat.change} vs last year</p>
                </Card>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="customers">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
                <p className="text-sm text-gray-400">Total registered customers over time</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={customerGrowthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                    <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1a2030", border: "1px solid #2D3748", borderRadius: "8px" }}
                    />
                    <Line type="monotone" dataKey="customers" stroke="#10B981" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="products">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Top Products by Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productSalesData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="product" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1a2030", border: "1px solid #2D3748", borderRadius: "8px" }}
                      formatter={(v) => [formatCurrency(Number(v)), ""]}
                    />
                    <Bar dataKey="sales" fill="#7C3AED" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="orders">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader><CardTitle>Orders Overview</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Total Orders", value: "1,247", color: "text-white" },
                    { label: "Delivered", value: "847", color: "text-emerald-400" },
                    { label: "Processing", value: "203", color: "text-blue-400" },
                    { label: "Cancelled", value: "54", color: "text-red-400" },
                  ].map((stat) => (
                    <div key={stat.label} className="p-4 rounded-xl bg-[#1F2937]/50 border border-[#1F2937]">
                      <p className="text-xs text-gray-400">{stat.label}</p>
                      <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-400 text-center py-8">
                  Select a date range to view detailed order analytics.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts"
import { PageHeader } from "@/components/shared/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"
import { DollarSign, TrendingUp, TrendingDown, Plus } from "lucide-react"

const monthlyData = [
  { month: "Jan", income: 185000, expenses: 92000 },
  { month: "Feb", income: 210000, expenses: 98000 },
  { month: "Mar", income: 198000, expenses: 105000 },
  { month: "Apr", income: 245000, expenses: 110000 },
  { month: "May", income: 228000, expenses: 108000 },
  { month: "Jun", income: 267000, expenses: 122000 },
  { month: "Jul", income: 289000, expenses: 128000 },
  { month: "Aug", income: 312000, expenses: 135000 },
  { month: "Sep", income: 278000, expenses: 130000 },
  { month: "Oct", income: 334000, expenses: 142000 },
  { month: "Nov", income: 298000, expenses: 138000 },
  { month: "Dec", income: 356000, expenses: 158000 },
]

const categoryData = [
  { name: "Sales Revenue", value: 68, color: "#7C3AED" },
  { name: "Services", value: 22, color: "#10B981" },
  { name: "Subscriptions", value: 10, color: "#3B82F6" },
]

const transactions = [
  { id: "1", type: "INCOME", description: "Order TL-12847 - Acme Corp", amount: 4250, category: "Sales", date: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  { id: "2", type: "EXPENSE", description: "Software subscriptions", amount: -850, category: "Technology", date: new Date(Date.now() - 5 * 60 * 60 * 1000) },
  { id: "3", type: "INCOME", description: "Order TL-12846 - TechStart", amount: 1830.50, category: "Sales", date: new Date(Date.now() - 8 * 60 * 60 * 1000) },
  { id: "4", type: "EXPENSE", description: "Office rent - January", amount: -5200, category: "Operations", date: new Date(Date.now() - 12 * 60 * 60 * 1000) },
  { id: "5", type: "INCOME", description: "Support contract renewal", amount: 2400, category: "Services", date: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  { id: "6", type: "EXPENSE", description: "Marketing campaign", amount: -3200, category: "Marketing", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  { id: "7", type: "INCOME", description: "Order TL-12845 - Global Ventures", amount: 9120, category: "Sales", date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  { id: "8", type: "REFUND", description: "Refund for order TL-12840", amount: -1650, category: "Refunds", date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
]

export default function FinancePage() {
  const [periodFilter, setPeriodFilter] = useState("This Month")
  const periods = ["Today", "This Week", "This Month", "This Quarter", "This Year"]

  return (
    <div>
      <PageHeader
        title="Finance"
        subtitle="Revenue, expenses & transactions overview"
        actions={
          <div className="flex gap-2">
            <div className="flex bg-[#111827] border border-[#1F2937] rounded-lg p-1 gap-1">
              {periods.map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriodFilter(p)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    periodFilter === p
                      ? "bg-[#7C3AED] text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <Button size="sm">
              <Plus className="w-4 h-4" />
              Add Transaction
            </Button>
          </div>
        }
      />

      {/* Stats */}
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
          title="Total Expenses"
          value={128400}
          format="currency"
          change={-3.2}
          icon={<TrendingDown className="w-5 h-5 text-red-400" />}
          iconBg="bg-red-500/15"
          delay={0.05}
        />
        <StatsCard
          title="Net Profit"
          value={156121}
          format="currency"
          change={18.7}
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
          iconBg="bg-emerald-500/15"
          delay={0.1}
        />
        <StatsCard
          title="Pending Invoices"
          value={23450}
          format="currency"
          change={0}
          icon={<DollarSign className="w-5 h-5 text-amber-400" />}
          iconBg="bg-amber-500/15"
          delay={0.15}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expenses</CardTitle>
              <p className="text-sm text-gray-400">Monthly comparison</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a2030", border: "1px solid #2D3748", borderRadius: "8px" }}
                    labelStyle={{ color: "#F8FAFC" }}
                    itemStyle={{ color: "#9CA3AF" }}
                    formatter={(v) => [formatCurrency(Number(v)), ""]}
                  />
                  <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={24} />
                  <Bar dataKey="expenses" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <p className="text-sm text-gray-400">By category</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a2030", border: "1px solid #2D3748", borderRadius: "8px" }}
                    formatter={(v) => [`${v}%`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {categoryData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-400">{item.name}</span>
                    </div>
                    <span className="font-medium text-white">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[#1F2937]/50">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-[#7C3AED]/5 transition-colors">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    tx.type === "INCOME" ? "bg-emerald-500/10" :
                    tx.type === "EXPENSE" ? "bg-red-500/10" :
                    "bg-amber-500/10"
                  }`}>
                    {tx.type === "INCOME" ? (
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm truncate">{tx.description}</p>
                    <p className="text-xs text-gray-400">{tx.category} • {formatDate(tx.date)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-semibold ${tx.amount >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {tx.amount >= 0 ? "+" : ""}{formatCurrency(Math.abs(tx.amount))}
                    </p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${getStatusColor(tx.type)}`}>
                      {tx.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

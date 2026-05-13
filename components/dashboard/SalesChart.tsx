"use client"

import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { month: "Jan", sales: 245, target: 220 },
  { month: "Feb", sales: 312, target: 280 },
  { month: "Mar", sales: 289, target: 300 },
  { month: "Apr", sales: 367, target: 320 },
  { month: "May", sales: 341, target: 350 },
  { month: "Jun", sales: 398, target: 370 },
  { month: "Jul", sales: 421, target: 390 },
  { month: "Aug", sales: 445, target: 410 },
  { month: "Sep", sales: 378, target: 420 },
  { month: "Oct", sales: 489, target: 440 },
  { month: "Nov", sales: 412, target: 450 },
  { month: "Dec", sales: 534, target: 480 },
]

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a2030] border border-[#2D3748] rounded-xl p-3 shadow-xl">
        <p className="text-sm font-semibold text-white mb-2">{label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-xs">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-400 capitalize">{entry.name}:</span>
            <span className="text-white font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function SalesChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Monthly Sales</CardTitle>
        <p className="text-sm text-gray-400">Units sold vs target</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(124,58,237,0.05)" }} />
            <Bar dataKey="sales" fill="#7C3AED" radius={[4, 4, 0, 0]} maxBarSize={28}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.sales >= entry.target ? "#10B981" : "#7C3AED"}
                />
              ))}
            </Bar>
            <Bar dataKey="target" fill="#1F2937" radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-6 mt-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#10B981]" />
            Above target
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#7C3AED]" />
            Below target
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#1F2937]" />
            Target
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

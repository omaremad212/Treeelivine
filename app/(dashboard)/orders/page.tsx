"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Plus, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"
import Link from "next/link"

const mockOrders = [
  { id: "1", orderNumber: "TL-12847", customer: "Acme Corporation", status: "DELIVERED", total: 4250.00, items: 5, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  { id: "2", orderNumber: "TL-12846", customer: "TechStart Inc", status: "PROCESSING", total: 1830.50, items: 3, createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) },
  { id: "3", orderNumber: "TL-12845", customer: "Global Ventures", status: "SHIPPED", total: 9120.00, items: 12, createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000) },
  { id: "4", orderNumber: "TL-12844", customer: "DataSystems LLC", status: "PENDING", total: 550.75, items: 2, createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) },
  { id: "5", orderNumber: "TL-12843", customer: "Nexus Partners", status: "CANCELLED", total: 3400.00, items: 7, createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  { id: "6", orderNumber: "TL-12842", customer: "CloudSoft Solutions", status: "DELIVERED", total: 7800.00, items: 9, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  { id: "7", orderNumber: "TL-12841", customer: "Sunrise Retail", status: "DELIVERED", total: 2200.00, items: 4, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  { id: "8", orderNumber: "TL-12840", customer: "MedTech Labs", status: "REFUNDED", total: 1650.00, items: 2, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
  { id: "9", orderNumber: "TL-12839", customer: "Acme Corporation", status: "DELIVERED", total: 5300.00, items: 8, createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  { id: "10", orderNumber: "TL-12838", customer: "TechStart Inc", status: "PROCESSING", total: 920.00, items: 1, createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },
]

type OrderRow = typeof mockOrders[number]

const STATUS_OPTIONS = ["ALL", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"]

const columns: Column<OrderRow>[] = [
  {
    key: "orderNumber",
    header: "Order #",
    sortable: true,
    render: (value) => (
      <span className="font-mono font-semibold text-[#7C3AED]">{value as string}</span>
    ),
  },
  {
    key: "customer",
    header: "Customer",
    sortable: true,
    render: (value) => (
      <span className="font-medium text-white">{value as string}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (value) => (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(value as string)}`}>
        {value as string}
      </span>
    ),
  },
  {
    key: "items",
    header: "Items",
    sortable: true,
    render: (value) => <span className="text-gray-400">{value as number}</span>,
  },
  {
    key: "total",
    header: "Total",
    sortable: true,
    render: (value) => (
      <span className="font-bold text-white">{formatCurrency(value as number)}</span>
    ),
  },
  {
    key: "createdAt",
    header: "Date",
    sortable: true,
    render: (value) => (
      <span className="text-gray-400 text-sm">{formatDate(value as Date)}</span>
    ),
  },
]

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState("ALL")

  const filtered = statusFilter === "ALL"
    ? mockOrders
    : mockOrders.filter((o) => o.status === statusFilter)

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle={`${mockOrders.length} total orders`}
        actions={
          <Button size="sm">
            <Plus className="w-4 h-4" />
            New Order
          </Button>
        }
      />

      {/* Status filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-wrap gap-2 mb-4"
      >
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === status
                ? "bg-[#7C3AED] text-white"
                : "bg-[#111827] text-gray-400 border border-[#1F2937] hover:border-[#7C3AED]/30 hover:text-gray-200"
            }`}
          >
            {status}
            {status !== "ALL" && (
              <span className="ml-1.5 opacity-70">
                ({mockOrders.filter((o) => o.status === status).length})
              </span>
            )}
          </button>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DataTable
          data={filtered as unknown as Record<string, unknown>[]}
          columns={columns as unknown as Column<Record<string, unknown>>[]}
          searchable
          searchPlaceholder="Search orders..."
          searchKeys={["orderNumber", "customer"]}
          rowKey={(row) => row.id as string}
          actions={(row) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/orders/${row.id}`} className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Update Status
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 text-red-400 focus:text-red-400 focus:bg-red-500/10">
                  <Trash2 className="w-4 h-4" />
                  Cancel Order
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </motion.div>
    </div>
  )
}

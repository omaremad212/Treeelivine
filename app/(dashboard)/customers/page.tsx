"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Mail, Phone, Building2, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import type { Customer } from "@/types"
import Link from "next/link"

const mockCustomers: Customer[] = [
  { id: "1", name: "Acme Corporation", email: "billing@acme.com", phone: "+1 (555) 100-2000", company: "Acme Corp", city: "New York", country: "USA", status: "ACTIVE", totalOrders: 48, totalSpent: 127500, createdAt: new Date("2023-01-15"), updatedAt: new Date() },
  { id: "2", name: "TechStart Inc", email: "accounts@techstart.io", phone: "+1 (555) 200-3000", company: "TechStart Inc", city: "San Francisco", country: "USA", status: "ACTIVE", totalOrders: 23, totalSpent: 54200, createdAt: new Date("2023-03-22"), updatedAt: new Date() },
  { id: "3", name: "Global Ventures", email: "finance@globalventures.com", phone: "+44 20 7946 0958", company: "Global Ventures Ltd", city: "London", country: "UK", status: "ACTIVE", totalOrders: 67, totalSpent: 298700, createdAt: new Date("2022-11-08"), updatedAt: new Date() },
  { id: "4", name: "DataSystems LLC", email: "billing@datasystems.com", phone: "+1 (555) 400-5000", company: "DataSystems LLC", city: "Chicago", country: "USA", status: "INACTIVE", totalOrders: 12, totalSpent: 24800, createdAt: new Date("2023-05-30"), updatedAt: new Date() },
  { id: "5", name: "Nexus Partners", email: "ap@nexuspartners.net", phone: "+1 (555) 500-6000", company: "Nexus Partners", city: "Austin", country: "USA", status: "ACTIVE", totalOrders: 31, totalSpent: 88900, createdAt: new Date("2023-02-14"), updatedAt: new Date() },
  { id: "6", name: "CloudSoft Solutions", email: "finance@cloudsoft.io", phone: "+1 (555) 600-7000", company: "CloudSoft Solutions", city: "Seattle", country: "USA", status: "ACTIVE", totalOrders: 19, totalSpent: 41300, createdAt: new Date("2023-07-19"), updatedAt: new Date() },
  { id: "7", name: "MedTech Labs", email: "accounting@medtech.com", phone: "+1 (555) 700-8000", company: "MedTech Labs Inc", city: "Boston", country: "USA", status: "BLOCKED", totalOrders: 5, totalSpent: 8200, createdAt: new Date("2023-09-01"), updatedAt: new Date() },
  { id: "8", name: "Sunrise Retail", email: "orders@sunriseretail.com", phone: "+1 (555) 800-9000", company: "Sunrise Retail Co", city: "Miami", country: "USA", status: "ACTIVE", totalOrders: 92, totalSpent: 187600, createdAt: new Date("2022-08-20"), updatedAt: new Date() },
]

const columns: Column<Customer>[] = [
  {
    key: "name",
    header: "Customer",
    sortable: true,
    render: (_, row) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED]/30 to-[#10B981]/30 flex items-center justify-center text-xs font-bold text-purple-300 shrink-0">
          {(row.name as string).charAt(0)}
        </div>
        <div>
          <p className="font-medium text-white">{row.name as string}</p>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Mail className="w-3 h-3" />
            {row.email as string}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "company",
    header: "Company",
    sortable: true,
    render: (_, row) => (
      <div className="flex items-center gap-1.5 text-gray-300">
        <Building2 className="w-3.5 h-3.5 text-gray-500" />
        {(row.company as string) || "—"}
      </div>
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
    key: "totalOrders",
    header: "Orders",
    sortable: true,
    render: (value) => <span className="font-medium text-gray-300">{value as number}</span>,
  },
  {
    key: "totalSpent",
    header: "Total Spent",
    sortable: true,
    render: (value) => (
      <span className="font-semibold text-emerald-400">
        {formatCurrency(value as number)}
      </span>
    ),
  },
  {
    key: "createdAt",
    header: "Joined",
    sortable: true,
    render: (value) => (
      <span className="text-gray-400 text-sm">{formatDate(value as Date)}</span>
    ),
  },
]

export default function CustomersPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [customers, setCustomers] = useState(mockCustomers)
  const { toast } = useToast()

  const handleDelete = () => {
    if (deleteId) {
      setCustomers(customers.filter((c) => c.id !== deleteId))
      setDeleteId(null)
      toast({ title: "Customer deleted", variant: "destructive" })
    }
  }

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} total customers`}
        actions={
          <Button size="sm">
            <Plus className="w-4 h-4" />
            Add Customer
          </Button>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DataTable
          data={customers as unknown as Record<string, unknown>[]}
          columns={columns as unknown as Column<Record<string, unknown>>[]}
          searchable
          searchPlaceholder="Search customers..."
          searchKeys={["name", "email", "company", "city"]}
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
                  <Link href={`/customers/${row.id}`} className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 text-red-400 focus:text-red-400 focus:bg-red-500/10"
                  onClick={() => setDeleteId(row.id as string)}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </motion.div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Customer"
        description="Are you sure you want to delete this customer? This action cannot be undone and will remove all associated data."
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  )
}

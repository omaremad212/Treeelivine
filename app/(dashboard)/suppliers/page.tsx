"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Plus, MoreHorizontal, Eye, Edit, Trash2, Globe, Mail, Phone } from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

const mockSuppliers = [
  { id: "1", name: "TechSupply Co", email: "orders@techsupply.com", phone: "+1 (555) 100-2000", company: "TechSupply Corporation", city: "Austin", country: "USA", isActive: true, products: 24, createdAt: new Date("2022-01-15") },
  { id: "2", name: "Global Parts Inc", email: "supply@globalparts.com", phone: "+1 (555) 200-3000", company: "Global Parts Inc", city: "Chicago", country: "USA", isActive: true, products: 56, createdAt: new Date("2021-08-20") },
  { id: "3", name: "EuroTech Supplies", email: "accounts@eurotech.eu", phone: "+44 20 7946 1234", company: "EuroTech BV", city: "Amsterdam", country: "Netherlands", isActive: true, products: 18, createdAt: new Date("2022-04-10") },
  { id: "4", name: "Asian Components Ltd", email: "trade@asiancomp.asia", phone: "+852 3456 7890", company: "Asian Components Ltd", city: "Hong Kong", country: "China", isActive: false, products: 8, createdAt: new Date("2023-01-01") },
  { id: "5", name: "Pacific Distributors", email: "partners@pacdist.com", phone: "+1 (555) 500-6000", company: "Pacific Distributors LLC", city: "Los Angeles", country: "USA", isActive: true, products: 31, createdAt: new Date("2022-09-15") },
]

type SupplierRow = typeof mockSuppliers[number]

const columns: Column<SupplierRow>[] = [
  {
    key: "name",
    header: "Supplier",
    sortable: true,
    render: (_, row) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center text-sm font-bold text-emerald-400 shrink-0">
          {(row.name as string).charAt(0)}
        </div>
        <div>
          <p className="font-medium text-white">{row.name as string}</p>
          <p className="text-xs text-gray-400">{row.company as string}</p>
        </div>
      </div>
    ),
  },
  {
    key: "email",
    header: "Contact",
    render: (_, row) => (
      <div className="space-y-0.5">
        <div className="flex items-center gap-1.5 text-xs text-gray-300">
          <Mail className="w-3 h-3 text-gray-500" />
          {row.email as string}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Phone className="w-3 h-3 text-gray-500" />
          {row.phone as string}
        </div>
      </div>
    ),
  },
  {
    key: "city",
    header: "Location",
    sortable: true,
    render: (_, row) => (
      <div className="flex items-center gap-1.5 text-sm text-gray-300">
        <Globe className="w-3.5 h-3.5 text-gray-500" />
        {row.city as string}, {row.country as string}
      </div>
    ),
  },
  {
    key: "products",
    header: "Products",
    sortable: true,
    render: (value) => (
      <span className="font-medium text-purple-400">{value as number} products</span>
    ),
  },
  {
    key: "isActive",
    header: "Status",
    sortable: true,
    render: (value) => (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${value ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" : "text-gray-400 bg-gray-500/10 border-gray-500/30"}`}>
        {value ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    key: "createdAt",
    header: "Since",
    sortable: true,
    render: (value) => (
      <span className="text-gray-400 text-sm">{formatDate(value as Date)}</span>
    ),
  },
]

export default function SuppliersPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [suppliers, setSuppliers] = useState(mockSuppliers)
  const { toast } = useToast()

  const handleDelete = () => {
    if (deleteId) {
      setSuppliers(suppliers.filter((s) => s.id !== deleteId))
      setDeleteId(null)
      toast({ title: "Supplier deleted", variant: "destructive" })
    }
  }

  return (
    <div>
      <PageHeader
        title="Suppliers"
        subtitle={`${suppliers.length} suppliers`}
        actions={
          <Button size="sm">
            <Plus className="w-4 h-4" />
            Add Supplier
          </Button>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DataTable
          data={suppliers as unknown as Record<string, unknown>[]}
          columns={columns as unknown as Column<Record<string, unknown>>[]}
          searchable
          searchPlaceholder="Search suppliers..."
          searchKeys={["name", "company", "email", "city"]}
          rowKey={(row) => row.id as string}
          actions={(row) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  View
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
        title="Delete Supplier"
        description="Are you sure you want to delete this supplier?"
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  )
}

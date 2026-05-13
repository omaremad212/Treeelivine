"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Plus, MoreHorizontal, Eye, Edit, Trash2, Package, AlertTriangle, LayoutGrid, LayoutList } from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatCurrency, getStatusColor } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import type { Product } from "@/types"
import Link from "next/link"

const mockProducts: Product[] = [
  { id: "1", name: "Premium ERP License", sku: "ERP-001", description: "Full ERP system license", price: 4999, costPrice: 1200, stock: 999, minStock: 1, unit: "license", status: "ACTIVE", categoryId: "1", createdAt: new Date("2023-01-01"), updatedAt: new Date() },
  { id: "2", name: "Cloud Storage Pro (1TB)", sku: "CSP-1TB", description: "1TB cloud storage subscription", price: 299, costPrice: 45, stock: 500, minStock: 10, unit: "subscription", status: "ACTIVE", categoryId: "2", createdAt: new Date("2023-02-15"), updatedAt: new Date() },
  { id: "3", name: "Analytics Dashboard", sku: "AD-PRO", description: "Advanced analytics platform", price: 899, costPrice: 200, stock: 150, minStock: 5, unit: "license", status: "ACTIVE", categoryId: "1", createdAt: new Date("2023-03-20"), updatedAt: new Date() },
  { id: "4", name: "API Integration Kit", sku: "AIK-001", description: "Developer API toolkit", price: 499, costPrice: 80, stock: 7, minStock: 20, unit: "license", status: "ACTIVE", categoryId: "3", createdAt: new Date("2023-04-10"), updatedAt: new Date() },
  { id: "5", name: "Support Package - Basic", sku: "SP-BASIC", description: "Basic support 24/7", price: 199, costPrice: 40, stock: 100, minStock: 5, unit: "subscription", status: "ACTIVE", categoryId: "2", createdAt: new Date("2023-05-01"), updatedAt: new Date() },
  { id: "6", name: "Hardware Controller Unit", sku: "HCU-PRO", description: "Industrial controller", price: 2499, costPrice: 1100, stock: 3, minStock: 15, unit: "unit", status: "ACTIVE", categoryId: "4", createdAt: new Date("2023-06-15"), updatedAt: new Date() },
  { id: "7", name: "Training Module Bundle", sku: "TMB-5", description: "5-module training package", price: 349, costPrice: 60, stock: 50, minStock: 5, unit: "bundle", status: "ACTIVE", categoryId: "2", createdAt: new Date("2023-07-01"), updatedAt: new Date() },
  { id: "8", name: "Legacy System Adapter", sku: "LSA-V2", description: "Legacy integration adapter", price: 799, costPrice: 180, stock: 0, minStock: 10, unit: "unit", status: "OUT_OF_STOCK", categoryId: "3", createdAt: new Date("2023-08-10"), updatedAt: new Date() },
  { id: "9", name: "Mobile App License", sku: "MAL-001", description: "Mobile ERP access", price: 149, costPrice: 25, stock: 200, minStock: 10, unit: "license", status: "ACTIVE", categoryId: "1", createdAt: new Date("2023-09-05"), updatedAt: new Date() },
  { id: "10", name: "Custom Report Builder", sku: "CRB-ADV", description: "Advanced report builder", price: 649, costPrice: 120, stock: 80, minStock: 5, unit: "license", status: "INACTIVE", categoryId: "1", createdAt: new Date("2023-10-12"), updatedAt: new Date() },
]

const columns: Column<Product>[] = [
  {
    key: "name",
    header: "Product",
    sortable: true,
    render: (_, row) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#1F2937] flex items-center justify-center shrink-0">
          <Package className="w-4 h-4 text-gray-400" />
        </div>
        <div>
          <p className="font-medium text-white">{row.name as string}</p>
          <p className="text-xs text-gray-500">SKU: {row.sku as string}</p>
        </div>
      </div>
    ),
  },
  {
    key: "price",
    header: "Price",
    sortable: true,
    render: (value) => (
      <span className="font-semibold text-white">{formatCurrency(value as number)}</span>
    ),
  },
  {
    key: "costPrice",
    header: "Cost",
    sortable: true,
    render: (value) => (
      <span className="text-gray-400">{formatCurrency(value as number)}</span>
    ),
  },
  {
    key: "stock",
    header: "Stock",
    sortable: true,
    render: (value, row) => {
      const stock = value as number
      const min = row.minStock as number
      const isLow = stock > 0 && stock <= min
      const isOut = stock === 0
      return (
        <div className="flex items-center gap-2">
          <span className={`font-medium ${isOut ? "text-red-400" : isLow ? "text-amber-400" : "text-white"}`}>
            {stock}
          </span>
          {(isLow || isOut) && (
            <AlertTriangle className={`w-3.5 h-3.5 ${isOut ? "text-red-400" : "text-amber-400"}`} />
          )}
        </div>
      )
    },
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (value) => (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(value as string)}`}>
        {(value as string).replace("_", " ")}
      </span>
    ),
  },
  {
    key: "price",
    header: "Margin",
    render: (value, row) => {
      const margin = (((value as number) - (row.costPrice as number)) / (value as number)) * 100
      return (
        <span className="text-emerald-400 font-medium">{margin.toFixed(0)}%</span>
      )
    },
  },
]

export default function ProductsPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [products, setProducts] = useState(mockProducts)
  const [view, setView] = useState<"table" | "grid">("table")
  const { toast } = useToast()

  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.minStock).length
  const outOfStockCount = products.filter((p) => p.stock === 0).length

  const handleDelete = () => {
    if (deleteId) {
      setProducts(products.filter((p) => p.id !== deleteId))
      setDeleteId(null)
      toast({ title: "Product deleted", variant: "destructive" })
    }
  }

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle={`${products.length} total products`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setView("table")}
              className={view === "table" ? "text-[#7C3AED]" : ""}
            >
              <LayoutList className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setView("grid")}
              className={view === "grid" ? "text-[#7C3AED]" : ""}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </div>
        }
      />

      {/* Alerts */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-3 mb-4"
        >
          {outOfStockCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              <AlertTriangle className="w-4 h-4" />
              {outOfStockCount} out of stock
            </div>
          )}
          {lowStockCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              {lowStockCount} low stock
            </div>
          )}
        </motion.div>
      )}

      {view === "table" ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <DataTable
            data={products as unknown as Record<string, unknown>[]}
            columns={columns as unknown as Column<Record<string, unknown>>[]}
            searchable
            searchPlaceholder="Search products..."
            searchKeys={["name", "sku"]}
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
                    <Link href={`/products/${row.id}`} className="flex items-center gap-2">
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Card className="hover:border-[#7C3AED]/30 transition-all duration-200 cursor-pointer group">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#1F2937] flex items-center justify-center">
                      <Package className="w-5 h-5 text-gray-400" />
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getStatusColor(product.status)}`}>
                      {product.status.replace("_", " ")}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-0.5 group-hover:text-purple-300 transition-colors">{product.name}</h3>
                  <p className="text-xs text-gray-500 mb-3">SKU: {product.sku}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{formatCurrency(product.price)}</span>
                    <span className={`text-xs ${product.stock === 0 ? "text-red-400" : product.stock <= product.minStock ? "text-amber-400" : "text-gray-400"}`}>
                      {product.stock} in stock
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Product"
        description="Are you sure you want to delete this product?"
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  )
}

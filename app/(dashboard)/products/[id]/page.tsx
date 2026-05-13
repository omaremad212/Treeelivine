"use client"

import React from "react"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import { PageHeader } from "@/components/shared/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { formatCurrency, getStatusColor } from "@/lib/utils"
import { Package, Edit, TrendingUp, DollarSign, ShoppingCart, AlertTriangle } from "lucide-react"

const mockProduct = {
  id: "1",
  name: "Premium ERP License",
  sku: "ERP-001",
  description: "Full enterprise ERP system license with all modules including CRM, inventory, finance, and reporting.",
  price: 4999,
  costPrice: 1200,
  stock: 999,
  minStock: 1,
  unit: "license",
  status: "ACTIVE",
  category: { name: "Software" },
  supplier: { name: "Internal" },
}

export default function ProductDetailPage() {
  const params = useParams()
  const product = mockProduct
  const margin = ((product.price - product.costPrice) / product.price) * 100
  const stockPercentage = Math.min((product.stock / 100) * 100, 100)

  return (
    <div>
      <PageHeader
        title={product.name}
        subtitle={`SKU: ${product.sku}`}
        breadcrumb={[
          { label: "Products", href: "/products" },
          { label: product.name },
        ]}
        actions={
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4" />
            Edit Product
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-4"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-[#1F2937] flex items-center justify-center">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <CardTitle>{product.name}</CardTitle>
                  <p className="text-sm text-gray-400 mt-1">{product.description}</p>
                  <span className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(product.status)}`}>
                    {product.status}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-[#1F2937]/50">
                  <p className="text-xs text-gray-400 mb-1">Category</p>
                  <p className="font-medium text-white">{product.category?.name}</p>
                </div>
                <div className="p-3 rounded-lg bg-[#1F2937]/50">
                  <p className="text-xs text-gray-400 mb-1">Unit</p>
                  <p className="font-medium text-white">{product.unit}</p>
                </div>
                <div className="p-3 rounded-lg bg-[#1F2937]/50">
                  <p className="text-xs text-gray-400 mb-1">Min. Stock</p>
                  <p className="font-medium text-white">{product.minStock}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-gray-400">Sale Price</span>
              </div>
              <p className="text-xl font-bold text-white">{formatCurrency(product.price)}</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400">Cost Price</span>
              </div>
              <p className="text-xl font-bold text-gray-300">{formatCurrency(product.costPrice)}</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-400">Margin</span>
              </div>
              <p className="text-xl font-bold text-purple-400">{margin.toFixed(0)}%</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <ShoppingCart className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-400">In Stock</span>
              </div>
              <p className="text-xl font-bold text-white">{product.stock}</p>
            </Card>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Stock Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-white">{product.stock}</span>
                <span className="text-sm text-gray-400">{product.unit}</span>
              </div>
              <Progress value={stockPercentage} className="h-2 mb-2" />
              <p className="text-xs text-gray-400">
                Min. stock: {product.minStock} {product.unit}
              </p>
              {product.stock <= product.minStock && (
                <div className="mt-3 flex items-center gap-2 text-amber-400 text-xs">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Low stock warning
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Supplier</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white font-medium">{product.supplier?.name}</p>
              <Button variant="outline" size="sm" className="mt-3 w-full">
                View Supplier
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

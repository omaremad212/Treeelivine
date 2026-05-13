"use client"

import React from "react"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import { PageHeader } from "@/components/shared/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"
import { Printer, Download, Edit } from "lucide-react"

const mockOrder = {
  id: "1",
  orderNumber: "TL-12847",
  status: "DELIVERED",
  customer: { name: "Acme Corporation", email: "billing@acme.com", address: "123 Business Ave, New York, NY 10001" },
  items: [
    { id: "1", product: "Premium ERP License", sku: "ERP-001", qty: 2, unitPrice: 4999, subtotal: 9998 },
    { id: "2", product: "Analytics Dashboard", sku: "AD-PRO", qty: 1, unitPrice: 899, subtotal: 899 },
    { id: "3", product: "Support Package", sku: "SP-BASIC", qty: 3, unitPrice: 199, subtotal: 597 },
  ],
  subtotal: 11494,
  tax: 919.52,
  discount: 500,
  total: 11913.52,
  notes: "Priority delivery. Customer requires installation support.",
  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
}

export default function OrderDetailPage() {
  const params = useParams()
  const order = mockOrder

  return (
    <div>
      <PageHeader
        title={`Order ${order.orderNumber}`}
        subtitle={`Placed on ${formatDate(order.createdAt)}`}
        breadcrumb={[
          { label: "Orders", href: "/orders" },
          { label: order.orderNumber },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button size="sm">
              <Edit className="w-4 h-4" />
              Update
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-4"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order Items</CardTitle>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1F2937] bg-[#0D1117]">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Product</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Qty</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Unit Price</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-b border-[#1F2937]/50 hover:bg-[#7C3AED]/5">
                      <td className="px-6 py-4">
                        <p className="font-medium text-white">{item.product}</p>
                        <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-300">{item.qty}</td>
                      <td className="px-6 py-4 text-right text-gray-300">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-6 py-4 text-right font-semibold text-white">{formatCurrency(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="px-6 py-4 space-y-2 border-t border-[#1F2937]">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Tax (8%)</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-400">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-white text-base pt-2 border-t border-[#1F2937]">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {order.notes && (
            <Card>
              <CardHeader><CardTitle className="text-base">Notes</CardTitle></CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader><CardTitle className="text-base">Customer</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <p className="font-semibold text-white">{order.customer.name}</p>
              <p className="text-sm text-gray-400">{order.customer.email}</p>
              <p className="text-sm text-gray-400">{order.customer.address}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Order Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">Order Date</p>
                <p className="text-sm text-white font-medium mt-0.5">{formatDate(order.createdAt)}</p>
              </div>
              {order.paidAt && (
                <div>
                  <p className="text-xs text-gray-400">Paid At</p>
                  <p className="text-sm text-emerald-400 font-medium mt-0.5">{formatDate(order.paidAt)}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-400">Order Total</p>
                <p className="text-xl font-bold text-white mt-0.5">{formatCurrency(order.total)}</p>
              </div>
              <div className="pt-2 border-t border-[#1F2937]">
                <p className="text-xs text-gray-400 mb-2">Status</p>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

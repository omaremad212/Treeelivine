"use client"

import React from "react"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import { PageHeader } from "@/components/shared/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"
import { Mail, Phone, Building2, MapPin, Edit, ShoppingCart, DollarSign, Calendar } from "lucide-react"

const mockCustomers: Record<string, {
  id: string; name: string; email: string; phone: string; company: string;
  city: string; country: string; status: string; totalOrders: number;
  totalSpent: number; createdAt: Date; notes: string; address: string;
}> = {
  "1": {
    id: "1", name: "Acme Corporation", email: "billing@acme.com", phone: "+1 (555) 100-2000",
    company: "Acme Corp", city: "New York", country: "USA", status: "ACTIVE",
    totalOrders: 48, totalSpent: 127500, createdAt: new Date("2023-01-15"),
    notes: "Enterprise customer. Prefers quarterly invoicing.",
    address: "123 Business Ave, Suite 400",
  },
}

const recentOrdersForCustomer = [
  { id: "1", orderNumber: "TL-12847", total: 4250, status: "DELIVERED", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), items: 5 },
  { id: "2", orderNumber: "TL-12743", total: 8900, status: "PROCESSING", date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), items: 12 },
  { id: "3", orderNumber: "TL-12612", total: 3200, status: "DELIVERED", date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), items: 3 },
]

export default function CustomerDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const customer = mockCustomers[id] || mockCustomers["1"]

  return (
    <div>
      <PageHeader
        title={customer.name}
        subtitle="Customer profile & order history"
        breadcrumb={[
          { label: "Customers", href: "/customers" },
          { label: customer.name },
        ]}
        actions={
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4" />
            Edit Customer
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#10B981] flex items-center justify-center text-2xl font-bold text-white mb-3">
                  {customer.name.charAt(0)}
                </div>
                <h2 className="text-xl font-bold text-white">{customer.name}</h2>
                <p className="text-gray-400 text-sm">{customer.company}</p>
                <span className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(customer.status)}`}>
                  {customer.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-gray-300 truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-gray-300">{customer.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-gray-300">{customer.company}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-gray-300">{customer.city}, {customer.country}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-gray-300">Joined {formatDate(customer.createdAt)}</span>
                </div>
              </div>

              {customer.notes && (
                <div className="mt-4 p-3 rounded-lg bg-[#1F2937]/50 border border-[#1F2937]">
                  <p className="text-xs text-gray-400 font-medium mb-1">Notes</p>
                  <p className="text-sm text-gray-300">{customer.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats & Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2 space-y-4"
        >
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <ShoppingCart className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-400">Total Orders</span>
              </div>
              <p className="text-2xl font-bold text-white">{customer.totalOrders}</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-gray-400">Total Spent</span>
              </div>
              <p className="text-2xl font-bold text-emerald-400">
                {formatCurrency(customer.totalSpent)}
              </p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-400">Avg. Order</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(customer.totalSpent / customer.totalOrders)}
              </p>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[#1F2937]/50">
                {recentOrdersForCustomer.map((order) => (
                  <div key={order.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-[#7C3AED]/5 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{order.orderNumber}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{order.items} items • {formatDate(order.date)}</p>
                    </div>
                    <span className="font-semibold text-white">{formatCurrency(order.total)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

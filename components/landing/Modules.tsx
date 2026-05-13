"use client"

import { motion } from "framer-motion"
import {
  LayoutDashboard, Users, Package, ShoppingCart,
  Truck, DollarSign, BarChart3, UserCog, Settings,
} from "lucide-react"

const modules = [
  { icon: LayoutDashboard, label: "Dashboard",  desc: "Business overview & KPIs",     color: "#7C3AED", bg: "#f5f3ff" },
  { icon: Users,           label: "Customers",  desc: "CRM & client management",      color: "#3B82F6", bg: "#eff6ff" },
  { icon: Package,         label: "Products",   desc: "Inventory & SKU tracking",     color: "#10B981", bg: "#ecfdf5" },
  { icon: ShoppingCart,    label: "Orders",     desc: "Sales & invoice generation",   color: "#F59E0B", bg: "#fffbeb" },
  { icon: Truck,           label: "Suppliers",  desc: "Procurement management",       color: "#EF4444", bg: "#fef2f2" },
  { icon: DollarSign,      label: "Finance",    desc: "Revenue, expenses & reports",  color: "#8B5CF6", bg: "#f5f3ff" },
  { icon: BarChart3,       label: "Reports",    desc: "Analytics & export tools",     color: "#06B6D4", bg: "#ecfeff" },
  { icon: UserCog,         label: "Users",      desc: "Roles & access control",       color: "#EC4899", bg: "#fdf2f8" },
  { icon: Settings,        label: "Settings",   desc: "Company & profile config",     color: "#6B7280", bg: "#f9fafb" },
]

export default function Modules() {
  return (
    <section id="modules" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium mb-4"
          >
            Full ERP suite
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4"
          >
            All modules, one platform
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-lg text-gray-500 max-w-xl mx-auto"
          >
            Every tool your business needs is built in — no integrations, no extra fees.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {modules.map((m, i) => {
            const Icon = m.icon
            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group flex flex-col items-center text-center p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-lg transition-all duration-300 cursor-default"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200"
                  style={{ background: m.bg }}
                >
                  <Icon className="w-6 h-6" style={{ color: m.color }} />
                </div>
                <div className="font-semibold text-gray-900 text-sm mb-1">{m.label}</div>
                <div className="text-gray-400 text-xs leading-snug">{m.desc}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

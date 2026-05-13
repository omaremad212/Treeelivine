"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Truck,
  BarChart3,
  Shield,
  Bell,
} from "lucide-react"

const features = [
  {
    icon: Package,
    title: "Inventory Management",
    description:
      "Track stock in real time, set low-stock alerts, manage SKUs, categories, and product variants effortlessly.",
    color: "bg-purple-50 text-purple-600",
    border: "hover:border-purple-200",
  },
  {
    icon: ShoppingCart,
    title: "Sales & Orders",
    description:
      "Create orders, generate invoices, track order status, and analyse sales performance across periods.",
    color: "bg-blue-50 text-blue-600",
    border: "hover:border-blue-200",
  },
  {
    icon: Users,
    title: "CRM & Customers",
    description:
      "Manage customer profiles, purchase history, contact info, and segment your customer base with ease.",
    color: "bg-emerald-50 text-emerald-600",
    border: "hover:border-emerald-200",
  },
  {
    icon: DollarSign,
    title: "Finance Tracking",
    description:
      "Monitor revenue, expenses, transactions, and profit margins. Export financial reports in seconds.",
    color: "bg-amber-50 text-amber-600",
    border: "hover:border-amber-200",
  },
  {
    icon: Truck,
    title: "Supplier Management",
    description:
      "Maintain supplier directories, track supplier orders, evaluate performance, and manage procurement.",
    color: "bg-rose-50 text-rose-600",
    border: "hover:border-rose-200",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    description:
      "Powerful dashboards with charts, KPIs, and exportable reports covering every part of your business.",
    color: "bg-indigo-50 text-indigo-600",
    border: "hover:border-indigo-200",
  },
  {
    icon: Shield,
    title: "User Roles & Access",
    description:
      "Assign Admin, Manager, Accountant, or Staff roles. Fine-grained permissions keep data secure.",
    color: "bg-teal-50 text-teal-600",
    border: "hover:border-teal-200",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Real-time alerts for low stock, new orders, payment events, and system updates — never miss a beat.",
    color: "bg-fuchsia-50 text-fuchsia-600",
    border: "hover:border-fuchsia-200",
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Features() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-sm font-medium mb-4"
          >
            Built for modern businesses
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4"
          >
            Everything your business needs
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-lg text-gray-500 max-w-2xl mx-auto"
          >
            Eight powerful modules — one unified platform. Stop juggling spreadsheets and
            disconnected tools.
          </motion.p>
        </div>

        {/* Grid */}
        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {features.map((f) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                variants={item}
                className={`group p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-lg transition-all duration-300 cursor-default ${f.border}`}
              >
                <div className={`inline-flex p-3 rounded-xl ${f.color} mb-5`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-gray-900 font-semibold text-base mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

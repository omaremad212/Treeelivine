"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { CheckCircle, Zap } from "lucide-react"

const included = [
  "Dashboard with live analytics",
  "Customer & CRM management",
  "Product & inventory tracking",
  "Orders & invoice generation",
  "Supplier management",
  "Finance & expense tracking",
  "Reports & data export",
  "User roles & permissions",
  "Settings & customization",
  "Demo access — no card required",
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4"
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500"
          >
            Try the full system for free. No hidden fees.
          </motion.p>
        </div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="relative w-full max-w-lg"
          >
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-600 text-white text-xs font-bold shadow-lg shadow-purple-200">
                <Zap className="w-3 h-3" />
                Full Access Demo
              </div>
            </div>

            <div className="rounded-3xl border-2 border-purple-200 bg-white shadow-2xl shadow-purple-100/60 p-10 pt-12">
              <div className="text-center mb-8">
                <div className="text-lg font-bold text-gray-900 mb-1">Treelivine ERP Demo</div>
                <div className="flex items-end justify-center gap-1 mt-4">
                  <span className="text-5xl font-extrabold text-gray-900">FREE</span>
                </div>
                <div className="text-gray-400 text-sm mt-2">Full access — no credit card needed</div>
              </div>

              <ul className="space-y-3 mb-10">
                {included.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-3">
                <Link
                  href="/dashboard"
                  className="block w-full text-center px-6 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-base transition-all duration-200 shadow-lg shadow-purple-200 hover:-translate-y-0.5"
                >
                  Open Demo — Free
                </Link>
                <Link
                  href="/register"
                  className="block w-full text-center px-6 py-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 text-gray-700 font-semibold text-base transition-all duration-200 hover:-translate-y-0.5"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

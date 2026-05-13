"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Play, CheckCircle } from "lucide-react"

const highlights = [
  "No credit card required",
  "Full demo access",
  "All modules included",
]

export default function Hero() {
  return (
    <section className="relative pt-28 sm:pt-32 pb-20 overflow-hidden bg-white">
      {/* Subtle background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-[600px] h-[600px] rounded-full bg-purple-50 opacity-60 blur-3xl" />
        <div className="absolute top-40 -left-32 w-[500px] h-[500px] rounded-full bg-emerald-50 opacity-50 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-purple-50 opacity-40 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-200 bg-purple-50 text-purple-700 text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            Modern ERP Platform — Now Live
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6"
          >
            Run Your Entire{" "}
            <span className="purple-gradient-text">Business</span>
            <br />
            From One Powerful
            <br />
            <span className="purple-gradient-text">ERP Platform</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto mb-10"
          >
            Treelivine ERP helps businesses manage sales, inventory, finance,
            customers, suppliers, and reports from one modern dashboard.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4"
          >
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-base font-semibold transition-all duration-200 shadow-lg shadow-purple-200 hover:shadow-purple-300 hover:-translate-y-0.5"
            >
              Try Live Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border-2 border-gray-200 hover:border-purple-300 bg-white hover:bg-purple-50 text-gray-800 text-base font-semibold transition-all duration-200 hover:-translate-y-0.5"
            >
              Create Account
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm text-gray-400 mb-12"
          >
            Try the demo before creating an account. No signup required.
          </motion.p>

          {/* Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            {highlights.map((h) => (
              <div key={h} className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                {h}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Product Preview Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 relative"
        >
          {/* Glow under */}
          <div className="absolute inset-x-10 -bottom-6 h-24 bg-purple-200 opacity-30 blur-2xl rounded-full" />

          {/* Browser chrome wrapper */}
          <div className="relative rounded-2xl border border-gray-200 shadow-2xl shadow-gray-200/80 overflow-hidden bg-white">
            {/* Browser top bar */}
            <div className="flex items-center gap-2 px-4 h-10 bg-gray-50 border-b border-gray-100">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="h-6 rounded-md bg-gray-200 max-w-xs mx-auto flex items-center justify-center">
                  <span className="text-xs text-gray-400">app.treelivine.com/dashboard</span>
                </div>
              </div>
            </div>

            {/* Dashboard mockup */}
            <DashboardMockup />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function DashboardMockup() {
  return (
    <div className="flex h-[480px] bg-[#0D0F12] overflow-hidden">
      {/* Sidebar */}
      <div className="w-56 flex-shrink-0 bg-[#0B0F0B] border-r border-white/5 p-4 flex flex-col gap-1">
        <div className="flex items-center gap-2 px-2 py-3 mb-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
            <span className="text-white text-xs font-bold">T</span>
          </div>
          <span className="text-white text-sm font-bold">Treelivine</span>
        </div>
        {[
          { label: "Dashboard", active: true },
          { label: "Customers", active: false },
          { label: "Products", active: false },
          { label: "Orders", active: false },
          { label: "Finance", active: false },
          { label: "Reports", active: false },
          { label: "Settings", active: false },
        ].map((item) => (
          <div
            key={item.label}
            className={`px-3 py-2 rounded-lg text-xs font-medium ${
              item.active
                ? "bg-purple-600/20 text-purple-300 border border-purple-500/20"
                : "text-gray-500"
            }`}
          >
            {item.label}
          </div>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 p-5 overflow-hidden">
        {/* Header row */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-white text-base font-semibold">Good morning, Admin</div>
            <div className="text-gray-500 text-xs mt-0.5">Here's your business overview</div>
          </div>
          <div className="flex gap-2">
            <div className="w-28 h-7 rounded-lg bg-white/5 border border-white/10" />
            <div className="w-8 h-7 rounded-lg bg-purple-600/20 border border-purple-500/20" />
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: "Revenue", value: "$284,521", change: "+12.5%", color: "purple" },
            { label: "Orders", value: "1,247", change: "+8.2%", color: "blue" },
            { label: "Customers", value: "4,832", change: "+18.4%", color: "emerald" },
            { label: "Products", value: "312", change: "+4.1%", color: "amber" },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/8 rounded-xl p-3">
              <div className="text-gray-400 text-xs mb-2">{s.label}</div>
              <div className="text-white text-base font-bold">{s.value}</div>
              <div className={`text-xs mt-1 ${
                s.color === "purple" ? "text-purple-400" :
                s.color === "blue" ? "text-blue-400" :
                s.color === "emerald" ? "text-emerald-400" : "text-amber-400"
              }`}>{s.change}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {/* Revenue chart */}
          <div className="col-span-2 bg-white/5 border border-white/8 rounded-xl p-4">
            <div className="text-white text-xs font-semibold mb-3">Revenue Overview</div>
            <div className="flex items-end gap-1 h-20">
              {[40, 65, 48, 72, 55, 88, 62, 95, 70, 84, 76, 100].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${h}%`,
                    background: `linear-gradient(to top, #7C3AED, #a855f7)`,
                    opacity: i === 11 ? 1 : 0.4 + (i / 30),
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {["Jan","Mar","May","Jul","Sep","Nov"].map(m => (
                <span key={m} className="text-gray-600 text-[9px]">{m}</span>
              ))}
            </div>
          </div>

          {/* Pie placeholder */}
          <div className="bg-white/5 border border-white/8 rounded-xl p-4">
            <div className="text-white text-xs font-semibold mb-3">Sales Breakdown</div>
            <div className="flex items-center justify-center h-20">
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#1F2937" strokeWidth="5" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#7C3AED" strokeWidth="5"
                    strokeDasharray="60 40" strokeLinecap="round" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#10B981" strokeWidth="5"
                    strokeDasharray="25 75" strokeDashoffset="-60" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">62%</span>
                </div>
              </div>
            </div>
            <div className="space-y-1.5 mt-2">
              {[
                { label: "Products", pct: "60%", color: "#7C3AED" },
                { label: "Services", pct: "25%", color: "#10B981" },
                { label: "Other", pct: "15%", color: "#F59E0B" },
              ].map(r => (
                <div key={r.label} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                  <span className="text-gray-400 text-[9px] flex-1">{r.label}</span>
                  <span className="text-gray-300 text-[9px]">{r.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent orders mini */}
        <div className="bg-white/5 border border-white/8 rounded-xl p-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-white text-xs font-semibold">Recent Orders</span>
            <span className="text-purple-400 text-[9px]">View all</span>
          </div>
          <div className="space-y-2">
            {[
              { id: "#ORD-001", cust: "Ahmed Al-Rashid", amount: "$1,240", status: "Delivered" },
              { id: "#ORD-002", cust: "Sara Mitchell",    amount: "$850",  status: "Processing" },
              { id: "#ORD-003", cust: "James Cooper",     amount: "$2,100", status: "Pending" },
            ].map(o => (
              <div key={o.id} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                    <span className="text-purple-300 text-[8px] font-bold">{o.cust[0]}</span>
                  </div>
                  <div>
                    <div className="text-white text-[9px] font-medium">{o.cust}</div>
                    <div className="text-gray-500 text-[8px]">{o.id}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white text-[9px] font-semibold">{o.amount}</div>
                  <div className={`text-[8px] ${
                    o.status === "Delivered" ? "text-emerald-400" :
                    o.status === "Processing" ? "text-blue-400" : "text-amber-400"
                  }`}>{o.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

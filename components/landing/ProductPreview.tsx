"use client"

import { motion } from "framer-motion"
import { useState } from "react"

const screens = [
  { id: "dashboard",  label: "Dashboard" },
  { id: "sales",      label: "Sales Analytics" },
  { id: "inventory",  label: "Inventory" },
  { id: "customers",  label: "Customers" },
  { id: "finance",    label: "Finance" },
]

export default function ProductPreview() {
  const [active, setActive] = useState("dashboard")

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4"
          >
            See it in action
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-gray-500 max-w-xl mx-auto"
          >
            Explore every module before you sign up. The full experience is always one click away.
          </motion.p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {screens.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                active === s.id
                  ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Screen mockup */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-gray-200 shadow-2xl shadow-gray-200/60 overflow-hidden bg-white"
        >
          {/* Browser bar */}
          <div className="flex items-center gap-2 px-4 h-10 bg-gray-50 border-b border-gray-100">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="flex-1 mx-4 max-w-xs mx-auto">
              <div className="h-5 rounded bg-gray-200 flex items-center justify-center px-3">
                <span className="text-[10px] text-gray-400">
                  app.treelivine.com/{active}
                </span>
              </div>
            </div>
          </div>

          {/* Mockup content */}
          <div className="bg-[#0D0F12]">
            {active === "dashboard"  && <ScreenDashboard />}
            {active === "sales"      && <ScreenSales />}
            {active === "inventory"  && <ScreenInventory />}
            {active === "customers"  && <ScreenCustomers />}
            {active === "finance"    && <ScreenFinance />}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ── Individual screen mockups ─────────────────────────────────── */

function ScreenDashboard() {
  return (
    <div className="p-6 space-y-5 h-[440px] overflow-hidden">
      <div className="text-white text-sm font-semibold">Overview — May 2026</div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { l: "Total Revenue", v: "$284,521", c: "+12.5%", col: "#7C3AED" },
          { l: "Orders",        v: "1,247",    c: "+8.2%",  col: "#3B82F6" },
          { l: "Customers",     v: "4,832",    c: "+18.4%", col: "#10B981" },
          { l: "In Stock",      v: "312",      c: "+4.1%",  col: "#F59E0B" },
        ].map((s) => (
          <div key={s.l} className="bg-white/5 border border-white/8 rounded-xl p-4">
            <div className="text-gray-400 text-xs mb-2">{s.l}</div>
            <div className="text-white font-bold text-lg">{s.v}</div>
            <div className="text-xs mt-1" style={{ color: s.col }}>{s.c}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 bg-white/5 border border-white/8 rounded-xl p-4 h-44">
          <div className="text-white text-xs font-semibold mb-3">Revenue vs Expenses</div>
          <div className="flex items-end gap-2 h-28">
            {[60,72,55,88,65,92,74,100,80,90,76,95].map((h,i) => (
              <div key={i} className="flex-1 flex flex-col gap-0.5 items-center justify-end h-full">
                <div className="w-full rounded-t-sm" style={{ height:`${h}%`, background:"#7C3AED", opacity: 0.7+(i/40) }} />
                <div className="w-full rounded-t-sm" style={{ height:`${h*0.45}%`, background:"#10B981", opacity: 0.6 }} />
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-2 bg-white/5 border border-white/8 rounded-xl p-4 h-44">
          <div className="text-white text-xs font-semibold mb-3">Top Products</div>
          <div className="space-y-3">
            {[
              { n: "Laptop Pro X",   s: 89 },
              { n: "Office Chair",   s: 72 },
              { n: "Standing Desk",  s: 61 },
              { n: "Monitor 4K",     s: 48 },
            ].map((p) => (
              <div key={p.n} className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-300">{p.n}</span>
                  <span className="text-purple-400">{p.s}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width:`${p.s}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ScreenSales() {
  return (
    <div className="p-6 h-[440px] overflow-hidden space-y-5">
      <div className="flex items-center justify-between">
        <div className="text-white text-sm font-semibold">Sales Analytics</div>
        <div className="flex gap-2">
          {["Week","Month","Year"].map((p,i) => (
            <div key={p} className={`px-3 py-1 rounded-lg text-[10px] font-medium ${i===1 ? "bg-purple-600 text-white" : "bg-white/5 text-gray-400"}`}>{p}</div>
          ))}
        </div>
      </div>
      {/* Big area chart */}
      <div className="bg-white/5 border border-white/8 rounded-xl p-5 h-56">
        <div className="text-gray-400 text-xs mb-4">Monthly Revenue ($)</div>
        <div className="relative h-36">
          <svg viewBox="0 0 600 120" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,100 C50,85 100,70 150,60 C200,50 250,40 300,30 C350,20 400,15 450,18 C500,21 550,10 600,5 L600,120 L0,120Z" fill="url(#sg)" />
            <path d="M0,100 C50,85 100,70 150,60 C200,50 250,40 300,30 C350,20 400,15 450,18 C500,21 550,10 600,5" fill="none" stroke="#7C3AED" strokeWidth="2.5" />
          </svg>
        </div>
        <div className="flex justify-between mt-1">
          {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(m => (
            <span key={m} className="text-gray-600 text-[9px]">{m}</span>
          ))}
        </div>
      </div>
      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { l:"Total Sales",   v:"$284,521", chg:"+12.5%" },
          { l:"Avg Order",     v:"$228",     chg:"+3.1%" },
          { l:"Conversion",    v:"3.8%",     chg:"+0.5%" },
        ].map(s => (
          <div key={s.l} className="bg-white/5 border border-white/8 rounded-xl p-3">
            <div className="text-gray-400 text-[10px] mb-1">{s.l}</div>
            <div className="text-white font-bold text-base">{s.v}</div>
            <div className="text-emerald-400 text-[10px] mt-0.5">{s.chg}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ScreenInventory() {
  const rows = [
    { sku:"TRV-001", name:"Laptop Pro X",    cat:"Electronics", stock:143, min:20, price:"$1,299", status:"Active" },
    { sku:"TRV-002", name:"Office Chair",    cat:"Furniture",   stock:8,   min:15, price:"$399",   status:"Low Stock" },
    { sku:"TRV-003", name:"Standing Desk",   cat:"Furniture",   stock:52,  min:10, price:"$649",   status:"Active" },
    { sku:"TRV-004", name:"Monitor 4K",      cat:"Electronics", stock:0,   min:5,  price:"$799",   status:"Out of Stock" },
    { sku:"TRV-005", name:"Wireless Mouse",  cat:"Accessories", stock:230, min:30, price:"$59",    status:"Active" },
  ]
  return (
    <div className="p-6 h-[440px] overflow-hidden space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-white text-sm font-semibold">Products & Inventory</div>
        <div className="flex gap-2">
          <div className="bg-white/5 border border-white/10 rounded-lg px-3 h-7 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-500" />
            <span className="text-gray-400 text-[10px]">Search products…</span>
          </div>
          <div className="bg-purple-600 rounded-lg px-3 h-7 flex items-center">
            <span className="text-white text-[10px] font-semibold">+ Add Product</span>
          </div>
        </div>
      </div>
      <div className="bg-white/5 border border-white/8 rounded-xl overflow-hidden">
        <table className="w-full text-[10px]">
          <thead>
            <tr className="border-b border-white/8">
              {["SKU","Product","Category","Stock","Min","Price","Status"].map(h => (
                <th key={h} className="text-left text-gray-500 font-semibold px-3 py-2.5 uppercase tracking-wider text-[9px]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i) => (
              <tr key={r.sku} className={i%2===0 ? "bg-white/2" : ""}>
                <td className="px-3 py-2.5 text-gray-400 font-mono">{r.sku}</td>
                <td className="px-3 py-2.5 text-white font-medium">{r.name}</td>
                <td className="px-3 py-2.5 text-gray-400">{r.cat}</td>
                <td className="px-3 py-2.5">
                  <span className={r.stock === 0 ? "text-red-400" : r.stock < r.min ? "text-amber-400" : "text-white"}>{r.stock}</span>
                </td>
                <td className="px-3 py-2.5 text-gray-500">{r.min}</td>
                <td className="px-3 py-2.5 text-white">{r.price}</td>
                <td className="px-3 py-2.5">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${
                    r.status==="Active" ? "bg-emerald-500/15 text-emerald-400" :
                    r.status==="Low Stock" ? "bg-amber-500/15 text-amber-400" :
                    "bg-red-500/15 text-red-400"
                  }`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-gray-500 text-[10px]">
        <span>Showing 1–5 of 312 products</span>
        <div className="flex gap-1">
          {[1,2,3,"…",31].map(p => (
            <div key={String(p)} className={`w-6 h-6 flex items-center justify-center rounded ${p===1 ? "bg-purple-600 text-white" : "bg-white/5 text-gray-400"}`}>{p}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ScreenCustomers() {
  const customers = [
    { name:"Ahmed Al-Rashid", email:"ahmed@company.sa",   orders:24, spent:"$18,240", status:"Active" },
    { name:"Sara Mitchell",   email:"sara@techcorp.com",  orders:16, spent:"$9,850",  status:"Active" },
    { name:"James Cooper",    email:"james@global.io",    orders:31, spent:"$28,100", status:"Active" },
    { name:"Layla Hassan",    email:"layla@ventures.ae",  orders:7,  spent:"$3,200",  status:"Inactive" },
    { name:"Chris Anderson",  email:"chris@startup.co",   orders:19, spent:"$14,700", status:"Active" },
  ]
  return (
    <div className="p-6 h-[440px] overflow-hidden space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-white text-sm font-semibold">Customer Management</div>
        <div className="bg-purple-600 rounded-lg px-3 h-7 flex items-center">
          <span className="text-white text-[10px] font-semibold">+ Add Customer</span>
        </div>
      </div>
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3">
        {[{l:"Total Customers",v:"4,832",c:"text-purple-400"},{l:"Active",v:"4,201",c:"text-emerald-400"},{l:"Avg. LTV",v:"$3,740",c:"text-blue-400"}].map(s=>(
          <div key={s.l} className="bg-white/5 border border-white/8 rounded-xl p-3">
            <div className="text-gray-400 text-[10px]">{s.l}</div>
            <div className={`text-base font-bold mt-1 ${s.c}`}>{s.v}</div>
          </div>
        ))}
      </div>
      <div className="bg-white/5 border border-white/8 rounded-xl overflow-hidden">
        <table className="w-full text-[10px]">
          <thead>
            <tr className="border-b border-white/8">
              {["Customer","Email","Orders","Total Spent","Status"].map(h => (
                <th key={h} className="text-left text-gray-500 font-semibold px-3 py-2.5 uppercase tracking-wider text-[9px]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.map((c,i) => (
              <tr key={c.email} className={i%2===0 ? "bg-white/2" : ""}>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-500/25 flex items-center justify-center text-purple-300 font-bold text-[9px]">{c.name[0]}</div>
                    <span className="text-white font-medium">{c.name}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-gray-400">{c.email}</td>
                <td className="px-3 py-2.5 text-white">{c.orders}</td>
                <td className="px-3 py-2.5 text-emerald-400 font-semibold">{c.spent}</td>
                <td className="px-3 py-2.5">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${c.status==="Active" ? "bg-emerald-500/15 text-emerald-400" : "bg-gray-500/15 text-gray-400"}`}>{c.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ScreenFinance() {
  return (
    <div className="p-6 h-[440px] overflow-hidden space-y-5">
      <div className="text-white text-sm font-semibold">Financial Overview — May 2026</div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { l:"Total Revenue",  v:"$284,521", c:"text-emerald-400", chg:"+12.5%" },
          { l:"Total Expenses", v:"$98,340",  c:"text-red-400",     chg:"+4.2%" },
          { l:"Net Profit",     v:"$186,181", c:"text-purple-400",  chg:"+18.7%" },
        ].map(s => (
          <div key={s.l} className="bg-white/5 border border-white/8 rounded-xl p-4">
            <div className="text-gray-400 text-xs mb-2">{s.l}</div>
            <div className={`text-xl font-bold ${s.c}`}>{s.v}</div>
            <div className="text-gray-500 text-[10px] mt-1">{s.chg} this month</div>
          </div>
        ))}
      </div>
      <div className="bg-white/5 border border-white/8 rounded-xl p-4 h-48">
        <div className="text-white text-xs font-semibold mb-3">Revenue vs Expenses (6 months)</div>
        <div className="flex items-end gap-3 h-28">
          {[
            { rev:60, exp:30 },
            { rev:72, exp:35 },
            { rev:65, exp:28 },
            { rev:85, exp:40 },
            { rev:80, exp:38 },
            { rev:100, exp:45 },
          ].map((m,i) => (
            <div key={i} className="flex-1 flex gap-1 items-end h-full">
              <div className="flex-1 rounded-t" style={{height:`${m.rev}%`, background:"#10B981", opacity:0.8}} />
              <div className="flex-1 rounded-t" style={{height:`${m.exp}%`, background:"#EF4444", opacity:0.7}} />
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400"><div className="w-2 h-2 rounded-full bg-emerald-500"/>Revenue</div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400"><div className="w-2 h-2 rounded-full bg-red-500"/>Expenses</div>
        </div>
      </div>
    </div>
  )
}

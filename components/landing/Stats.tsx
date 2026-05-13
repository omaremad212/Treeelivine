"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const stats = [
  { value: "2,500+", label: "Transactions Managed",  color: "text-purple-600" },
  { value: "99.9%",  label: "Platform Uptime",       color: "text-emerald-600" },
  { value: "5 sec",  label: "Average Setup Time",    color: "text-blue-600" },
  { value: "24 / 7", label: "Business Access",       color: "text-amber-600" },
]

export default function Stats() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section className="py-16 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl lg:text-4xl font-extrabold text-white mb-2 tabular-nums">
                {s.value}
              </div>
              <div className="text-purple-200 text-sm font-medium">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

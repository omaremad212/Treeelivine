"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const testimonials = [
  {
    name:    "Ahmed Al-Rashid",
    role:    "Operations Director",
    company: "Gulf Trade Co.",
    avatar:  "A",
    color:   "bg-purple-100 text-purple-700",
    stars:   5,
    quote:
      "Treelivine replaced three separate tools we were using. The inventory alerts alone saved us thousands in overstock costs. The dashboard is incredibly intuitive.",
  },
  {
    name:    "Sara Mitchell",
    role:    "CEO",
    company: "Mitchell Retail Group",
    avatar:  "S",
    color:   "bg-blue-100 text-blue-700",
    stars:   5,
    quote:
      "The finance module gives us real-time P&L visibility we never had before. Setup was instant and the demo mode let us evaluate everything risk-free.",
  },
  {
    name:    "James Cooper",
    role:    "Supply Chain Manager",
    company: "Cooper Logistics",
    avatar:  "J",
    color:   "bg-emerald-100 text-emerald-700",
    stars:   5,
    quote:
      "Supplier management and order tracking in one place is a game changer. The role-based access keeps our teams focused on what they need and nothing else.",
  },
]

export default function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-sm font-medium mb-4"
          >
            ★ Trusted by businesses
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4"
          >
            What our users say
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:border-purple-100 transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.stars }).map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-gray-600 text-sm leading-relaxed flex-1 mb-6">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base ${t.color}`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-gray-900 font-semibold text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs">{t.role} · {t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

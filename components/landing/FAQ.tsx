"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    q: "Can I try the system before signing up?",
    a: "Yes — absolutely. Visit the demo directly using the credentials on this page (admin@treelivine.com / admin123). No account or credit card required. You get full admin access to explore all 9 modules.",
  },
  {
    q: "Does it work on mobile and tablet?",
    a: "Treelivine ERP is fully responsive. The sidebar collapses on smaller screens, tables reflow, and every module is usable on smartphones and tablets without any loss of functionality.",
  },
  {
    q: "Can I manage inventory and sales together?",
    a: "Yes. The Products module and Orders module are fully integrated. When an order is placed, stock is automatically updated. Low-stock alerts notify you before you run out.",
  },
  {
    q: "Is this ready for real business deployment?",
    a: "The frontend and API structure are production-ready. To connect a real database, add your PostgreSQL DATABASE_URL to the environment variables and run Prisma migrations. Full deployment instructions are in the README.",
  },
  {
    q: "Can it be connected to a real database?",
    a: "Yes. The system uses Prisma ORM with a PostgreSQL schema already defined. Set your DATABASE_URL, run `npx prisma migrate deploy`, seed your data, and the system connects automatically.",
  },
  {
    q: "What roles are available in the system?",
    a: "Four roles are built in: Admin (full access), Manager (all modules except user management), Accountant (finance & reports only), and Staff (orders & inventory). Permissions are enforced on both the frontend and API level.",
  },
]

function FAQItem({ faq, i }: { faq: typeof faqs[number]; i: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: i * 0.06 }}
      className="border border-gray-100 rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-50 pt-4 bg-white">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  return (
    <section id="faq" className="py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4"
          >
            Frequently asked questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500"
          >
            Everything you need to know about Treelivine ERP.
          </motion.p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={faq.q} faq={faq} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Copy, Check } from "lucide-react"
import { useState } from "react"

function CopyField({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="flex items-center justify-between bg-white/10 border border-white/20 rounded-lg px-4 py-3">
      <span className="text-white font-mono text-sm">{value}</span>
      <button onClick={copy} className="ml-3 text-white/60 hover:text-white transition-colors">
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  )
}

export default function DemoCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#0D0F12] via-[#1a0d35] to-[#0D0F12]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left — text */}
            <div className="p-10 lg:p-14">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-sm font-medium mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                Live Demo Available
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl lg:text-4xl font-extrabold text-white mb-4 leading-tight"
              >
                Explore Treelivine ERP
                <br />
                <span className="purple-gradient-text">before creating an account</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="text-gray-400 text-base mb-8 leading-relaxed"
              >
                Use the demo credentials to test the full dashboard experience.
                Browse all modules, view live charts, and explore every feature — no signup needed.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-3"
              >
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all duration-200 hover:-translate-y-0.5"
                >
                  Open Demo
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 hover:border-white/40 text-white font-semibold transition-all duration-200 hover:-translate-y-0.5"
                >
                  Login
                </Link>
              </motion.div>
            </div>

            {/* Right — credentials card */}
            <div className="flex items-center justify-center p-10 lg:p-14 border-t lg:border-t-0 lg:border-l border-white/10">
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 }}
                className="w-full max-w-sm"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-sm font-semibold">Demo Credentials</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2 block">
                      Email Address
                    </label>
                    <CopyField value="admin@treelivine.com" />
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2 block">
                      Password
                    </label>
                    <CopyField value="admin123" />
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-emerald-300 text-sm">
                    Full admin access — all 9 modules unlocked for demo exploration.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

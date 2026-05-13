"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, Menu, X } from "lucide-react"

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Modules",  href: "#modules" },
  { label: "Pricing",  href: "#pricing" },
  { label: "FAQ",      href: "#faq" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-md">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold text-gray-900">
              Tree<span className="text-purple-600">livine</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors px-3 py-2"
            >
              Login
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors"
            >
              Try Demo
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors shadow-sm shadow-purple-200"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <div className="pt-3 space-y-2 border-t border-gray-100 mt-2">
                <Link
                  href="/login"
                  className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 text-sm font-semibold text-white bg-gray-900 rounded-lg text-center"
                >
                  Try Demo
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 text-sm font-semibold text-white bg-purple-600 rounded-lg text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

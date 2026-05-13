"use client"

import React from "react"
import { motion } from "framer-motion"

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  breadcrumb?: Array<{ label: string; href?: string }>
}

export function PageHeader({ title, subtitle, actions, breadcrumb }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
    >
      <div>
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
            {breadcrumb.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span>/</span>}
                {item.href ? (
                  <a
                    href={item.href}
                    className="hover:text-gray-300 transition-colors"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="text-gray-400">{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </motion.div>
  )
}

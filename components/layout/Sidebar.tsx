"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Truck,
  DollarSign,
  BarChart3,
  Settings,
  UserCog,
  Zap,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ChevronDown,
  Building2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  badge?: number
  children?: NavItem[]
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    title: "Main",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Management",
    items: [
      { href: "/customers", label: "Customers", icon: Users },
      { href: "/products", label: "Products", icon: Package },
      { href: "/orders", label: "Orders", icon: ShoppingCart, badge: 5 },
      { href: "/suppliers", label: "Suppliers", icon: Truck },
    ],
  },
  {
    title: "Finance",
    items: [
      { href: "/finance", label: "Finance", icon: DollarSign },
      { href: "/reports", label: "Reports", icon: BarChart3 },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/users", label: "Users", icon: UserCog },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
]

interface SidebarProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
  }
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(navGroups.map((g) => g.title))
  )

  const toggleGroup = (title: string) => {
    const next = new Set(expandedGroups)
    if (next.has(title)) {
      next.delete(title)
    } else {
      next.add(title)
    }
    setExpandedGroups(next)
  }

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative flex flex-col h-screen bg-[#0B0F0B] border-r border-[#1a2a1a] overflow-hidden shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-[#1a2a1a] shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#10B981] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col overflow-hidden"
              >
                <span className="text-[15px] font-bold text-white leading-tight tracking-tight">
                  Treelivine
                </span>
                <span className="text-[10px] text-emerald-400 font-medium tracking-widest uppercase">
                  ERP System
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        <motion.button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "ml-auto flex-shrink-0 w-6 h-6 rounded-full bg-[#1a2a1a] border border-[#2a3a2a] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#2a3a2a] transition-colors",
            collapsed && "ml-auto"
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-2">
            {!collapsed && (
              <button
                onClick={() => toggleGroup(group.title)}
                className="flex items-center gap-1 w-full px-2 py-1 mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-500 hover:text-gray-400 transition-colors"
              >
                <span>{group.title}</span>
                <ChevronDown
                  className={cn(
                    "ml-auto w-3 h-3 transition-transform",
                    expandedGroups.has(group.title) ? "rotate-0" : "-rotate-90"
                  )}
                />
              </button>
            )}
            <AnimatePresence initial={false}>
              {(collapsed || expandedGroups.has(group.title)) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden space-y-0.5"
                >
                  {group.items.map((item) => {
                    const active = isActive(item.href)
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                      >
                        <motion.div
                          className={cn(
                            "relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group",
                            active
                              ? "bg-[#7C3AED]/15 text-white border border-[#7C3AED]/30"
                              : "text-gray-400 hover:bg-[#1a2a1a] hover:text-gray-200",
                            collapsed && "justify-center px-0"
                          )}
                          whileTap={{ scale: 0.97 }}
                        >
                          {active && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#7C3AED] rounded-full"
                            />
                          )}
                          <div
                            className={cn(
                              "flex-shrink-0 w-5 h-5 flex items-center justify-center",
                              active ? "text-[#7C3AED]" : ""
                            )}
                          >
                            <Icon className="w-4.5 h-4.5" />
                          </div>
                          <AnimatePresence>
                            {!collapsed && (
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-sm font-medium flex-1 truncate"
                              >
                                {item.label}
                              </motion.span>
                            )}
                          </AnimatePresence>
                          {!collapsed && item.badge && (
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#7C3AED] text-white text-[10px] font-bold flex items-center justify-center">
                              {item.badge}
                            </span>
                          )}
                        </motion.div>
                      </Link>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-[#1a2a1a] p-3 shrink-0">
        <div
          className={cn(
            "flex items-center gap-3 p-2 rounded-lg hover:bg-[#1a2a1a] transition-colors cursor-pointer",
            collapsed && "justify-center"
          )}
        >
          <Avatar className="w-8 h-8 flex-shrink-0">
            {user?.image && <AvatarImage src={user.image} />}
            <AvatarFallback className="text-xs">
              {getInitials(user?.name || "U")}
            </AvatarFallback>
          </Avatar>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-[11px] text-gray-500 truncate">
                  {user?.email || ""}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!collapsed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex-shrink-0 p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  )
}

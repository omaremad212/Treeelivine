"use client"

import React, { useState } from "react"
import { signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bell,
  Search,
  Settings,
  LogOut,
  User,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  ShoppingCart,
  X,
  Command,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getInitials, formatRelativeTime } from "@/lib/utils"
import Link from "next/link"

interface Notification {
  id: string
  title: string
  message: string
  type: "success" | "warning" | "info" | "error"
  time: Date
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Order Received",
    message: "Order #TL-12847 from Acme Corp",
    type: "info",
    time: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
  },
  {
    id: "2",
    title: "Low Stock Alert",
    message: "Product 'Premium Widget' is below minimum stock",
    type: "warning",
    time: new Date(Date.now() - 15 * 60 * 1000),
    read: false,
  },
  {
    id: "3",
    title: "Payment Received",
    message: "$4,250 payment confirmed from TechStart Inc",
    type: "success",
    time: new Date(Date.now() - 60 * 60 * 1000),
    read: false,
  },
  {
    id: "4",
    title: "Invoice Overdue",
    message: "Invoice #INV-8821 is 5 days overdue",
    type: "error",
    time: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: true,
  },
]

interface HeaderProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
    isDemo?: boolean
  }
}

export function Header({ user }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)
  const [searchFocused, setSearchFocused] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const notificationIcon = {
    success: <CheckCircle className="w-4 h-4 text-emerald-400" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-400" />,
    info: <ShoppingCart className="w-4 h-4 text-blue-400" />,
    error: <AlertCircle className="w-4 h-4 text-red-400" />,
  }

  return (
    <header className="h-16 border-b border-[#1F2937] bg-[#0D0F12]/95 backdrop-blur-sm flex items-center px-6 gap-4 shrink-0 sticky top-0 z-30">
      {/* Search */}
      <div className="flex-1 max-w-lg">
        <div
          className={`relative flex items-center transition-all duration-200 ${
            searchFocused ? "ring-2 ring-[#7C3AED]/30 rounded-lg" : ""
          }`}
        >
          <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search anything..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full h-9 pl-9 pr-12 bg-[#111827] border border-[#1F2937] rounded-lg text-sm text-[#F8FAFC] placeholder:text-gray-500 focus:outline-none focus:border-[#7C3AED]/50 transition-all"
          />
          <div className="absolute right-3 flex items-center gap-1">
            <kbd className="hidden sm:flex h-5 select-none items-center gap-1 rounded border border-[#374151] bg-[#1F2937] px-1.5 font-mono text-[10px] text-gray-400">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowUserMenu(false)
            }}
            className="relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#7C3AED] text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 bg-[#111827] border border-[#1F2937] rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50"
              >
                <div className="flex items-center justify-between p-4 border-b border-[#1F2937]">
                  <div>
                    <h3 className="font-semibold text-white">Notifications</h3>
                    <p className="text-xs text-gray-400">{unreadCount} unread</p>
                  </div>
                  <div className="flex gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs text-[#7C3AED] hover:text-purple-300 transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-gray-400 hover:text-gray-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`flex gap-3 p-4 border-b border-[#1F2937]/50 hover:bg-[#1F2937]/30 cursor-pointer transition-colors ${
                        !notif.read ? "bg-[#7C3AED]/5" : ""
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {notificationIcon[notif.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white truncate">
                            {notif.title}
                          </p>
                          {!notif.read && (
                            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          {notif.message}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1">
                          {formatRelativeTime(notif.time)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-[#1F2937]">
                  <Link
                    href="/notifications"
                    className="block text-center text-xs text-[#7C3AED] hover:text-purple-300 transition-colors"
                    onClick={() => setShowNotifications(false)}
                  >
                    View all notifications
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu)
              setShowNotifications(false)
            }}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#1F2937] transition-colors"
          >
            <Avatar className="w-7 h-7">
              {user?.image && <AvatarImage src={user.image} />}
              <AvatarFallback className="text-xs">
                {getInitials(user?.name || "U")}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-white leading-none">
                {user?.name || "User"}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {user?.role || "Staff"}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden md:block" />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-52 bg-[#111827] border border-[#1F2937] rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50"
              >
                <div className="p-3 border-b border-[#1F2937]">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  <span className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#7C3AED]/20 text-purple-300 border border-purple-500/30">
                    {user?.role || "Staff"}
                  </span>
                </div>
                <div className="p-1">
                  <Link
                    href="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#1F2937] rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#1F2937] rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Overlay to close dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false)
            setShowUserMenu(false)
          }}
        />
      )}
    </header>
  )
}

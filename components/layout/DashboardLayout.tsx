"use client"

import React from "react"
import Link from "next/link"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { Toaster } from "@/components/ui/toaster"
import { Zap } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
  user?: {
    name?:   string | null
    email?:  string | null
    image?:  string | null
    role?:   string
    isDemo?: boolean
  }
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const isDemo = user?.isDemo ?? false

  return (
    <div className="flex flex-col h-screen bg-[#0D0F12] overflow-hidden">
      {/* Demo mode banner */}
      {isDemo && (
        <div className="flex-shrink-0 bg-gradient-to-r from-purple-700 via-purple-600 to-purple-700 text-white text-xs font-medium py-2 px-4 flex items-center justify-between z-50">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5" />
            <span>
              You are viewing the <strong>Demo Mode</strong> — all data is simulated.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className="bg-white text-purple-700 font-semibold px-3 py-0.5 rounded-full text-xs hover:bg-purple-50 transition-colors"
            >
              Create Account
            </Link>
            <Link
              href="/login"
              className="text-purple-200 hover:text-white transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      )}

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar user={user} />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Header user={user} />
          <main className="flex-1 overflow-y-auto">
            <div className="p-6 min-h-full">
              {children}
            </div>
          </main>
        </div>
      </div>

      <Toaster />
    </div>
  )
}

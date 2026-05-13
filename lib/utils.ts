import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num)
}

export function formatDate(date: Date | string, format?: string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d)
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d)
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 60) return "just now"
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(d)
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + "..."
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function generateOrderNumber(): string {
  const prefix = "TL"
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Number((((current - previous) / previous) * 100).toFixed(1))
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>
  return function (...args: Parameters<T>) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    ACTIVE: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    INACTIVE: "text-gray-400 bg-gray-400/10 border-gray-400/30",
    PENDING: "text-amber-400 bg-amber-400/10 border-amber-400/30",
    PROCESSING: "text-blue-400 bg-blue-400/10 border-blue-400/30",
    SHIPPED: "text-purple-400 bg-purple-400/10 border-purple-400/30",
    DELIVERED: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    CANCELLED: "text-red-400 bg-red-400/10 border-red-400/30",
    REFUNDED: "text-orange-400 bg-orange-400/10 border-orange-400/30",
    BLOCKED: "text-red-400 bg-red-400/10 border-red-400/30",
    OUT_OF_STOCK: "text-red-400 bg-red-400/10 border-red-400/30",
    DISCONTINUED: "text-gray-400 bg-gray-400/10 border-gray-400/30",
    INCOME: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    EXPENSE: "text-red-400 bg-red-400/10 border-red-400/30",
    TRANSFER: "text-blue-400 bg-blue-400/10 border-blue-400/30",
    REFUND: "text-orange-400 bg-orange-400/10 border-orange-400/30",
    ADMIN: "text-purple-400 bg-purple-400/10 border-purple-400/30",
    MANAGER: "text-blue-400 bg-blue-400/10 border-blue-400/30",
    ACCOUNTANT: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",
    STAFF: "text-gray-400 bg-gray-400/10 border-gray-400/30",
  }
  return map[status] || "text-gray-400 bg-gray-400/10 border-gray-400/30"
}

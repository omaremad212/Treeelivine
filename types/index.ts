export type Role = "ADMIN" | "MANAGER" | "ACCOUNTANT" | "STAFF"
export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED"
export type TransactionType = "INCOME" | "EXPENSE" | "REFUND" | "TRANSFER"
export type ProductStatus = "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK" | "DISCONTINUED"
export type CustomerStatus = "ACTIVE" | "INACTIVE" | "BLOCKED"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string | null
  phone?: string | null
  department?: string | null
  isActive: boolean
  lastLogin?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface Customer {
  id: string
  name: string
  email: string
  phone?: string | null
  company?: string | null
  address?: string | null
  city?: string | null
  country?: string | null
  status: CustomerStatus
  totalOrders: number
  totalSpent: number
  notes?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  description?: string | null
  slug: string
  createdAt: Date
  updatedAt: Date
  _count?: { products: number }
}

export interface Product {
  id: string
  name: string
  sku: string
  description?: string | null
  price: number
  costPrice: number
  stock: number
  minStock: number
  unit: string
  status: ProductStatus
  image?: string | null
  categoryId?: string | null
  supplierId?: string | null
  category?: Category | null
  supplier?: Supplier | null
  createdAt: Date
  updatedAt: Date
}

export interface Supplier {
  id: string
  name: string
  email: string
  phone?: string | null
  company?: string | null
  address?: string | null
  city?: string | null
  country?: string | null
  website?: string | null
  notes?: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  _count?: { products: number }
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  unitPrice: number
  subtotal: number
  product?: Product
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  userId: string
  status: OrderStatus
  subtotal: number
  tax: number
  discount: number
  total: number
  notes?: string | null
  shippingAddr?: string | null
  paidAt?: Date | null
  createdAt: Date
  updatedAt: Date
  customer?: Customer
  user?: User
  items?: OrderItem[]
}

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  description: string
  category?: string | null
  reference?: string | null
  date: Date
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: string
  isRead: boolean
  link?: string | null
  createdAt: Date
}

export interface File {
  id: string
  name: string
  url: string
  size: number
  mimeType: string
  entityType?: string | null
  entityId?: string | null
  uploadedBy?: string | null
  createdAt: Date
}

export interface DashboardStats {
  totalRevenue: number
  revenueChange: number
  totalOrders: number
  ordersChange: number
  totalCustomers: number
  customersChange: number
  totalProducts: number
  productsChange: number
}

export interface RevenueDataPoint {
  month: string
  revenue: number
  expenses: number
  profit: number
}

export interface SalesDataPoint {
  month: string
  sales: number
  orders: number
}

export interface TopProduct {
  id: string
  name: string
  sales: number
  revenue: number
  percentage: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Extend NextAuth session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: string
      department?: string
      image?: string | null
    }
  }

  interface User {
    id: string
    role?: string
    department?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    department?: string
  }
}

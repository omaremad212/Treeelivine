import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
})

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  role: z.enum(["ADMIN", "MANAGER", "ACCOUNTANT", "STAFF"]).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "BLOCKED"]).optional(),
  notes: z.string().optional(),
})

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  sku: z.string().min(2, "SKU must be at least 2 characters"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  costPrice: z.number().min(0, "Cost price must be positive"),
  stock: z.number().int().min(0, "Stock must be non-negative"),
  minStock: z.number().int().min(0, "Min stock must be non-negative"),
  unit: z.string().min(1, "Unit is required"),
  status: z.enum(["ACTIVE", "INACTIVE", "OUT_OF_STOCK", "DISCONTINUED"]).optional(),
  categoryId: z.string().optional(),
  supplierId: z.string().optional(),
})

export const orderSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"]).optional(),
  tax: z.number().min(0).optional(),
  discount: z.number().min(0).optional(),
  notes: z.string().optional(),
  shippingAddr: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1),
    unitPrice: z.number().min(0),
  })).min(1, "Order must have at least one item"),
})

export const supplierSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  notes: z.string().optional(),
})

export const transactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE", "REFUND", "TRANSFER"]),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  description: z.string().min(2, "Description is required"),
  category: z.string().optional(),
  reference: z.string().optional(),
  date: z.string().optional(),
})

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  role: z.enum(["ADMIN", "MANAGER", "ACCOUNTANT", "STAFF"]),
  phone: z.string().optional(),
  department: z.string().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type CustomerInput = z.infer<typeof customerSchema>
export type ProductInput = z.infer<typeof productSchema>
export type OrderInput = z.infer<typeof orderSchema>
export type SupplierInput = z.infer<typeof supplierSchema>
export type TransactionInput = z.infer<typeof transactionSchema>
export type UserInput = z.infer<typeof userSchema>

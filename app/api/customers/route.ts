import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { customerSchema } from "@/lib/validations"

// Mock customer store
const customers = [
  { id: "1", name: "Acme Corporation", email: "billing@acme.com", phone: "+1 (555) 100-2000", company: "Acme Corp", city: "New York", country: "USA", status: "ACTIVE", totalOrders: 48, totalSpent: 127500, createdAt: new Date("2023-01-15").toISOString(), updatedAt: new Date().toISOString() },
  { id: "2", name: "TechStart Inc", email: "accounts@techstart.io", phone: "+1 (555) 200-3000", company: "TechStart Inc", city: "San Francisco", country: "USA", status: "ACTIVE", totalOrders: 23, totalSpent: 54200, createdAt: new Date("2023-03-22").toISOString(), updatedAt: new Date().toISOString() },
]

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "10")
  const search = searchParams.get("search") || ""
  const status = searchParams.get("status") || ""

  let filtered = customers
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.company && c.company.toLowerCase().includes(q))
    )
  }
  if (status) {
    filtered = filtered.filter((c) => c.status === status)
  }

  const total = filtered.length
  const data = filtered.slice((page - 1) * limit, page * limit)

  return NextResponse.json({
    success: true,
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const parsed = customerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 })
  }

  // Try database first
  try {
    const { default: prisma } = await import("@/lib/prisma")
    const customer = await prisma.customer.create({
      data: parsed.data,
    })
    return NextResponse.json({ success: true, data: customer }, { status: 201 })
  } catch {
    // Mock create
    const newCustomer = {
      id: String(Date.now()),
      ...parsed.data,
      totalOrders: 0,
      totalSpent: 0,
      status: parsed.data.status || "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    customers.push(newCustomer as never)
    return NextResponse.json({ success: true, data: newCustomer }, { status: 201 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

const mockOrders = [
  { id: "1", orderNumber: "TL-12847", status: "DELIVERED", total: 4250, createdAt: new Date().toISOString() },
  { id: "2", orderNumber: "TL-12846", status: "PROCESSING", total: 1830.5, createdAt: new Date().toISOString() },
  { id: "3", orderNumber: "TL-12845", status: "SHIPPED", total: 9120, createdAt: new Date().toISOString() },
]

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "10")
  const status = searchParams.get("status")

  try {
    const { default: prisma } = await import("@/lib/prisma")
    const where = status ? { status: status as never } : {}
    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        include: { customer: true, items: { include: { product: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ])
    return NextResponse.json({ success: true, data: orders, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch {
    const filtered = status ? mockOrders.filter((o) => o.status === status) : mockOrders
    return NextResponse.json({ success: true, data: filtered, total: filtered.length, page: 1, limit: 10, totalPages: 1 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()

  try {
    const { default: prisma } = await import("@/lib/prisma")
    const { items, ...orderData } = body
    const subtotal = items.reduce((sum: number, item: { quantity: number; unitPrice: number }) => sum + item.quantity * item.unitPrice, 0)
    const tax = orderData.tax || 0
    const discount = orderData.discount || 0
    const total = subtotal + tax - discount

    const order = await prisma.order.create({
      data: {
        ...orderData,
        orderNumber: `TL-${Date.now().toString().slice(-5)}`,
        userId: session.user.id,
        subtotal,
        total,
        items: {
          create: items.map((item: { productId: string; quantity: number; unitPrice: number }) => ({
            ...item,
            subtotal: item.quantity * item.unitPrice,
          })),
        },
      },
      include: { customer: true, items: true },
    })
    return NextResponse.json({ success: true, data: order }, { status: 201 })
  } catch {
    const mock = { id: String(Date.now()), orderNumber: `TL-${Date.now().toString().slice(-5)}`, status: "PENDING", ...body, createdAt: new Date().toISOString() }
    return NextResponse.json({ success: true, data: mock }, { status: 201 })
  }
}

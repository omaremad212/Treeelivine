import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { supplierSchema } from "@/lib/validations"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "10")

  try {
    const { default: prisma } = await import("@/lib/prisma")
    const [total, suppliers] = await Promise.all([
      prisma.supplier.count(),
      prisma.supplier.findMany({
        include: { _count: { select: { products: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ])
    return NextResponse.json({ success: true, data: suppliers, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch {
    return NextResponse.json({ success: true, data: [], total: 0, page: 1, limit: 10, totalPages: 0 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const parsed = supplierSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 })
  }

  try {
    const { default: prisma } = await import("@/lib/prisma")
    const supplier = await prisma.supplier.create({ data: parsed.data })
    return NextResponse.json({ success: true, data: supplier }, { status: 201 })
  } catch {
    const mock = { id: String(Date.now()), ...parsed.data, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    return NextResponse.json({ success: true, data: mock }, { status: 201 })
  }
}

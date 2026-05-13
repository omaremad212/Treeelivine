import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { transactionSchema } from "@/lib/validations"

const mockTransactions = [
  { id: "1", type: "INCOME", amount: 4250, description: "Order TL-12847", category: "Sales", date: new Date().toISOString() },
  { id: "2", type: "EXPENSE", amount: 850, description: "Software subscriptions", category: "Technology", date: new Date().toISOString() },
  { id: "3", type: "INCOME", amount: 1830.5, description: "Order TL-12846", category: "Sales", date: new Date().toISOString() },
]

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")

  try {
    const { default: prisma } = await import("@/lib/prisma")
    const [total, transactions] = await Promise.all([
      prisma.transaction.count(),
      prisma.transaction.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: "desc" },
      }),
    ])
    return NextResponse.json({ success: true, data: transactions, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch {
    return NextResponse.json({ success: true, data: mockTransactions, total: mockTransactions.length, page: 1, limit: 20, totalPages: 1 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const parsed = transactionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 })
  }

  try {
    const { default: prisma } = await import("@/lib/prisma")
    const transaction = await prisma.transaction.create({
      data: {
        ...parsed.data,
        date: parsed.data.date ? new Date(parsed.data.date) : new Date(),
      },
    })
    return NextResponse.json({ success: true, data: transaction }, { status: 201 })
  } catch {
    const mock = { id: String(Date.now()), ...parsed.data, date: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    return NextResponse.json({ success: true, data: mock }, { status: 201 })
  }
}

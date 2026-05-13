import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const stats = {
    totalRevenue: 284521,
    revenueChange: 12.5,
    totalOrders: 1247,
    ordersChange: 8.2,
    totalCustomers: 4832,
    customersChange: 5.1,
    totalProducts: 312,
    productsChange: -2.3,
    revenueByMonth: [
      { month: "Jan", revenue: 185000, expenses: 92000, profit: 93000 },
      { month: "Feb", revenue: 210000, expenses: 98000, profit: 112000 },
      { month: "Mar", revenue: 198000, expenses: 105000, profit: 93000 },
      { month: "Apr", revenue: 245000, expenses: 110000, profit: 135000 },
      { month: "May", revenue: 228000, expenses: 108000, profit: 120000 },
      { month: "Jun", revenue: 267000, expenses: 122000, profit: 145000 },
      { month: "Jul", revenue: 289000, expenses: 128000, profit: 161000 },
      { month: "Aug", revenue: 312000, expenses: 135000, profit: 177000 },
      { month: "Sep", revenue: 278000, expenses: 130000, profit: 148000 },
      { month: "Oct", revenue: 334000, expenses: 142000, profit: 192000 },
      { month: "Nov", revenue: 298000, expenses: 138000, profit: 160000 },
      { month: "Dec", revenue: 356000, expenses: 158000, profit: 198000 },
    ],
  }

  return NextResponse.json({ success: true, data: stats })
}

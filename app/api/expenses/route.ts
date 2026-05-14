import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Expense from '@/models/Expense'
import { syncRecurringSalaryExpenses } from '@/lib/salary-sync'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'finance.read')) return forbiddenResponse()
  await connectDB()
  await syncRecurringSalaryExpenses()
  const { searchParams } = new URL(req.url)
  const query: any = {}
  const category = searchParams.get('category')
  const month = searchParams.get('month')
  const employeeId = searchParams.get('employeeId')
  if (category) query.category = category
  if (employeeId) query.employeeId = employeeId
  if (month) {
    const [y, m] = month.split('-').map(Number)
    query.date = { $gte: new Date(y, m - 1, 1), $lt: new Date(y, m, 1) }
  }
  const expenses = await Expense.find(query)
    .populate('employeeId', 'name email internalRole')
    .sort({ date: -1 })
  return NextResponse.json({ success: true, data: expenses })
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'finance.write')) return forbiddenResponse()
  await connectDB()
  const data = await req.json()
  if (!data.amount || !data.category) {
    return NextResponse.json({ success: false, message: 'Amount and category are required' }, { status: 400 })
  }
  const expense = await Expense.create(data)
  return NextResponse.json({ success: true, data: expense }, { status: 201 })
}

import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Expense from '@/models/Expense'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'finance.read')) return forbiddenResponse()
  await connectDB()
  const templates = await Expense.find({ isRecurringSalary: true })
    .populate('employeeId', 'name email internalRole')
    .sort({ createdAt: -1 })
  return NextResponse.json({ success: true, data: templates })
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'finance.write')) return forbiddenResponse()
  await connectDB()
  const data = await req.json()
  if (!data.employeeId || !data.amount) {
    return NextResponse.json({ success: false, message: 'Employee and amount required' }, { status: 400 })
  }
  const now = new Date()
  const template = await Expense.create({
    ...data,
    category: 'salary',
    isRecurringSalary: true,
    salaryNextDueDate: data.salaryNextDueDate || new Date(now.getFullYear(), now.getMonth() + 1, 1),
    date: now,
  })
  return NextResponse.json({ success: true, data: template }, { status: 201 })
}

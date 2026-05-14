import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Invoice from '@/models/Invoice'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'finance.read')) return forbiddenResponse()
  await connectDB()
  const { searchParams } = new URL(req.url)
  const query: any = {}
  const status = searchParams.get('status')
  const customerId = searchParams.get('customerId')
  const projectId = searchParams.get('projectId')
  if (status) query.status = status
  if (customerId) query.customerId = customerId
  if (projectId) query.projectId = projectId
  const invoices = await Invoice.find(query)
    .populate('customerId', 'name email company')
    .populate('projectId', 'name')
    .sort({ createdAt: -1 })
  return NextResponse.json({ success: true, data: invoices })
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'finance.write')) return forbiddenResponse()
  await connectDB()
  const data = await req.json()
  if (!data.customerId) return NextResponse.json({ success: false, message: 'Customer is required' }, { status: 400 })
  const invoice = await Invoice.create(data)
  return NextResponse.json({ success: true, data: invoice }, { status: 201 })
}

import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, unauthorizedResponse } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Customer from '@/models/Customer'
import Project from '@/models/Project'
import Invoice from '@/models/Invoice'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if ((user as any).role !== 'client') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }
  await connectDB()
  const customer = await Customer.findOne({ user: (user as any)._id })
  if (!customer) return NextResponse.json({ success: false, message: 'No customer record found' }, { status: 404 })
  const [projects, invoices] = await Promise.all([
    Project.find({ customerId: customer._id }).sort({ updatedAt: -1 }),
    Invoice.find({ customerId: customer._id }).sort({ createdAt: -1 }),
  ])
  return NextResponse.json({ success: true, data: { customer, projects, invoices } })
}

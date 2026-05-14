import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Customer from '@/models/Customer'
import Employee from '@/models/Employee'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'crm.read')) return forbiddenResponse()

  await connectDB()
  const { searchParams } = new URL(req.url)
  const query: any = {}
  const search = searchParams.get('search')
  const status = searchParams.get('status')
  const priority = searchParams.get('priority')

  if (search) query.$or = [{ name: new RegExp(search,'i') }, { company: new RegExp(search,'i') }, { email: new RegExp(search,'i') }]
  if (status) query.status = status
  if (priority) query.priority = priority

  if ((user as any).role === 'team') {
    const emp = await Employee.findOne({ user: (user as any)._id })
    if (emp) query.assignedTo = emp._id
  }

  const customers = await Customer.find(query).populate('assignedTo','name email internalRole').populate('user','email isActive').sort({ updatedAt: -1 })
  return NextResponse.json({ success: true, data: customers })
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'crm.write')) return forbiddenResponse()

  await connectDB()
  const { force, ...data } = await req.json()
  if (!data.name) return NextResponse.json({ success: false, message: 'Name is required' }, { status: 400 })
  if (!data.phone && !data.email) return NextResponse.json({ success: false, message: 'Phone or email required' }, { status: 400 })

  if (!force) {
    const dupQuery: any[] = []
    if (data.email) dupQuery.push({ email: data.email })
    if (data.phone) dupQuery.push({ phone: data.phone })
    if (data.company) dupQuery.push({ company: data.company })
    if (dupQuery.length) {
      const dups = await Customer.find({ $or: dupQuery })
      if (dups.length) return NextResponse.json({ success: false, message: 'Possible duplicate', duplicates: dups }, { status: 409 })
    }
  }

  const customer = await Customer.create(data)
  return NextResponse.json({ success: true, data: customer }, { status: 201 })
}

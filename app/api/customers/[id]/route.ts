import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Customer from '@/models/Customer'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'crm.read')) return forbiddenResponse()
  await connectDB()
  const customer = await Customer.findById(params.id).populate('assignedTo','name email').populate('user','email isActive role')
  if (!customer) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true, data: customer })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'crm.write')) return forbiddenResponse()
  await connectDB()
  const data = await req.json()
  const customer = await Customer.findByIdAndUpdate(params.id, data, { new: true, runValidators: true })
  if (!customer) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true, data: customer })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'crm.write')) return forbiddenResponse()
  await connectDB()
  await Customer.findByIdAndDelete(params.id)
  return NextResponse.json({ success: true })
}

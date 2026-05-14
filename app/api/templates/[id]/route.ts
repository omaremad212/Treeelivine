import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Template from '@/models/Template'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'templates.read')) return forbiddenResponse()
  await connectDB()
  const template = await Template.findByIdAndUpdate(params.id, { $inc: { usageCount: 1 } }, { new: true })
  if (!template) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true, data: template })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'templates.write')) return forbiddenResponse()
  await connectDB()
  const template = await Template.findByIdAndUpdate(params.id, await req.json(), { new: true })
  if (!template) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true, data: template })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'templates.write')) return forbiddenResponse()
  await connectDB()
  await Template.findByIdAndDelete(params.id)
  return NextResponse.json({ success: true })
}

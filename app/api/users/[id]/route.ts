import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'settings.read') && (user as any)._id.toString() !== params.id) return forbiddenResponse()
  await connectDB()
  const found = await User.findById(params.id).select('-password')
  if (!found) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true, data: found })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  const isSelf = (user as any)._id.toString() === params.id
  if (!isSelf && !hasPermission(user, 'settings.write')) return forbiddenResponse()
  await connectDB()
  const { password, role, effectivePermissions, ...data } = await req.json()
  const update: any = { ...data }
  if (password) update.password = await bcrypt.hash(password, 10)
  if (hasPermission(user, 'settings.write')) {
    if (role) update.role = role
    if (effectivePermissions) update.effectivePermissions = effectivePermissions
  }
  const found = await User.findByIdAndUpdate(params.id, update, { new: true }).select('-password')
  if (!found) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true, data: found })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'settings.write')) return forbiddenResponse()
  await connectDB()
  await User.findByIdAndDelete(params.id)
  return NextResponse.json({ success: true })
}

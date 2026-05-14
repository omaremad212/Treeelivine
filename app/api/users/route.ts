import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'settings.read')) return forbiddenResponse()
  await connectDB()
  const users = await User.find({}).select('-password').sort({ createdAt: -1 })
  return NextResponse.json({ success: true, data: users })
}

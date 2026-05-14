import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Setting from '@/models/Setting'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  await connectDB()
  const settings = await Setting.getOrCreate()
  return NextResponse.json({ success: true, data: settings.currencies || [] })
}

export async function PUT(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'settings.write')) return forbiddenResponse()
  await connectDB()
  const { currencies } = await req.json()
  const settings = await Setting.getOrCreate()
  settings.currencies = currencies
  await settings.save()
  return NextResponse.json({ success: true, data: settings.currencies })
}

import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Template from '@/models/Template'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'templates.read')) return forbiddenResponse()
  await connectDB()
  const { searchParams } = new URL(req.url)
  const query: any = {}
  const search = searchParams.get('search')
  const category = searchParams.get('category')
  const type = searchParams.get('type')
  if (search) query.$or = [{ name: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }]
  if (category) query.category = category
  if (type) query.type = type
  const templates = await Template.find(query).sort({ usageCount: -1, name: 1 })
  return NextResponse.json({ success: true, data: templates })
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'templates.write')) return forbiddenResponse()
  await connectDB()
  const data = await req.json()
  if (!data.name) return NextResponse.json({ success: false, message: 'Name is required' }, { status: 400 })
  const template = await Template.create({ ...data, createdBy: (user as any)._id })
  return NextResponse.json({ success: true, data: template }, { status: 201 })
}

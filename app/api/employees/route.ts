import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Employee from '@/models/Employee'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'team.read')) return forbiddenResponse()
  await connectDB()
  const { searchParams } = new URL(req.url)
  const query: any = {}
  const search = searchParams.get('search')
  const internalRole = searchParams.get('internalRole')
  if (search) query.$or = [{ name: new RegExp(search,'i') }, { email: new RegExp(search,'i') }]
  if (internalRole) query.internalRole = internalRole
  const employees = await Employee.find(query).populate('user','email isActive role').sort({ name: 1 })
  return NextResponse.json({ success: true, data: employees })
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'team.write')) return forbiddenResponse()
  await connectDB()
  const emp = await Employee.create(await req.json())
  return NextResponse.json({ success: true, data: emp }, { status: 201 })
}

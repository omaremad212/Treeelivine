import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Project from '@/models/Project'
import Employee from '@/models/Employee'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'projects.read')) return forbiddenResponse()
  await connectDB()
  const { searchParams } = new URL(req.url)
  const query: any = {}
  const search = searchParams.get('search')
  const status = searchParams.get('status')
  if (search) query.$or = [{ name: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }]
  if (status) query.status = status
  if ((user as any).role === 'team') {
    const emp = await Employee.findOne({ user: (user as any)._id })
    if (emp) query.assignedEmployeeIds = emp._id
  }
  const projects = await Project.find(query)
    .populate('customerId', 'name email company')
    .populate('assignedEmployeeIds', 'name email internalRole')
    .sort({ updatedAt: -1 })
  return NextResponse.json({ success: true, data: projects })
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'projects.write')) return forbiddenResponse()
  await connectDB()
  const data = await req.json()
  if (!data.name) return NextResponse.json({ success: false, message: 'Name is required' }, { status: 400 })
  const project = await Project.create(data)
  return NextResponse.json({ success: true, data: project }, { status: 201 })
}

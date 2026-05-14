import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Task from '@/models/Task'
import Employee from '@/models/Employee'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'tasks.read')) return forbiddenResponse()
  await connectDB()
  const { searchParams } = new URL(req.url)
  const query: any = {}
  const search = searchParams.get('search')
  const status = searchParams.get('status')
  const projectId = searchParams.get('projectId')
  const assigneeId = searchParams.get('assigneeId')
  if (search) query.$or = [{ title: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }]
  if (status) query.status = status
  if (projectId) query.projectId = projectId
  if (assigneeId) query.currentAssigneeId = assigneeId
  if ((user as any).role === 'team') {
    const emp = await Employee.findOne({ user: (user as any)._id })
    if (emp) query.currentAssigneeId = emp._id
  }
  const tasks = await Task.find(query)
    .populate('projectId', 'name')
    .populate('currentAssigneeId', 'name email internalRole')
    .sort({ dueDate: 1, createdAt: -1 })
  return NextResponse.json({ success: true, data: tasks })
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'tasks.write')) return forbiddenResponse()
  await connectDB()
  const data = await req.json()
  if (!data.title) return NextResponse.json({ success: false, message: 'Title is required' }, { status: 400 })
  const task = await Task.create({ ...data, history: [{ action: 'created', by: (user as any)._id, at: new Date() }] })
  return NextResponse.json({ success: true, data: task }, { status: 201 })
}

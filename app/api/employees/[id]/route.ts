import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Employee from '@/models/Employee'
import Task from '@/models/Task'
import Project from '@/models/Project'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'team.read')) return forbiddenResponse()
  await connectDB()
  const emp = await Employee.findById(params.id).populate('user','email isActive role')
  if (!emp) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
  const [taskCount, projectCount, overdueTasks] = await Promise.all([
    Task.countDocuments({ currentAssigneeId: emp._id, status: { $nin: ['completed','cancelled'] } }),
    Project.countDocuments({ assignedEmployeeIds: emp._id, status: 'active' }),
    Task.countDocuments({ currentAssigneeId: emp._id, dueDate: { $lt: new Date() }, status: { $nin: ['completed','cancelled'] } }),
  ])
  return NextResponse.json({ success: true, data: emp, stats: { taskCount, projectCount, overdueTasks } })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'team.write')) return forbiddenResponse()
  await connectDB()
  const emp = await Employee.findByIdAndUpdate(params.id, await req.json(), { new: true })
  if (!emp) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true, data: emp })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'team.write')) return forbiddenResponse()
  await connectDB()
  await Employee.findByIdAndDelete(params.id)
  return NextResponse.json({ success: true })
}

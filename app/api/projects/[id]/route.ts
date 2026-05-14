import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Project from '@/models/Project'
import Task from '@/models/Task'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'projects.read')) return forbiddenResponse()
  await connectDB()
  const project = await Project.findById(params.id)
    .populate('customerId', 'name email company')
    .populate('assignedEmployeeIds', 'name email internalRole')
  if (!project) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
  const tasks = await Task.find({ projectId: params.id })
    .populate('currentAssigneeId', 'name email')
    .sort({ createdAt: -1 })
  return NextResponse.json({ success: true, data: project, tasks })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'projects.write')) return forbiddenResponse()
  await connectDB()
  const project = await Project.findByIdAndUpdate(params.id, await req.json(), { new: true, runValidators: true })
  if (!project) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true, data: project })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'projects.write')) return forbiddenResponse()
  await connectDB()
  await Project.findByIdAndDelete(params.id)
  await Task.deleteMany({ projectId: params.id })
  return NextResponse.json({ success: true })
}

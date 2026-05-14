import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Task from '@/models/Task'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'tasks.read')) return forbiddenResponse()
  await connectDB()
  const task = await Task.findById(params.id)
    .populate('projectId', 'name')
    .populate('currentAssigneeId', 'name email internalRole')
  if (!task) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true, data: task })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'tasks.write')) return forbiddenResponse()
  await connectDB()
  const data = await req.json()
  const task = await Task.findByIdAndUpdate(
    params.id,
    { ...data, $push: { history: { action: 'updated', by: (user as any)._id, at: new Date() } } },
    { new: true }
  )
  if (!task) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true, data: task })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'tasks.write')) return forbiddenResponse()
  await connectDB()
  await Task.findByIdAndDelete(params.id)
  return NextResponse.json({ success: true })
}

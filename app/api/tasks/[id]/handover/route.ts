import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Task from '@/models/Task'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'tasks.write')) return forbiddenResponse()
  await connectDB()
  const { newAssigneeId, note } = await req.json()
  if (!newAssigneeId) return NextResponse.json({ success: false, message: 'newAssigneeId is required' }, { status: 400 })
  const task = await Task.findById(params.id)
  if (!task) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
  const prev = task.currentAssigneeId
  task.currentAssigneeId = newAssigneeId
  task.history = task.history || []
  task.history.push({ action: 'handover', by: (user as any)._id, from: prev, to: newAssigneeId, note, at: new Date() })
  await task.save()
  return NextResponse.json({ success: true, data: task })
}

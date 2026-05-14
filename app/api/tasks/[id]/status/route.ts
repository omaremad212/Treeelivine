import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, unauthorizedResponse } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Task from '@/models/Task'
import Employee from '@/models/Employee'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  await connectDB()
  const { status } = await req.json()
  const validStatuses = ['pending', 'in_progress', 'in_review', 'completed', 'cancelled']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 })
  }
  const task = await Task.findById(params.id)
  if (!task) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
  if ((user as any).role === 'team') {
    const emp = await Employee.findOne({ user: (user as any)._id })
    if (!emp || task.currentAssigneeId?.toString() !== emp._id.toString()) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }
  }
  task.status = status
  task.history = task.history || []
  task.history.push({ action: `status:${status}`, by: (user as any)._id, at: new Date() })
  if (status === 'completed') task.completedAt = new Date()
  await task.save()
  return NextResponse.json({ success: true, data: task })
}

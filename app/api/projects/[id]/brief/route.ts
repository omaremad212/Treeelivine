import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Project from '@/models/Project'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  await connectDB()
  const project = await Project.findById(params.id).select('brief briefStatus briefComments name customerId')
    .populate('customerId', 'name email')
  if (!project) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true, data: project })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  await connectDB()
  const { brief, briefStatus, action } = await req.json()
  const update: any = {}
  if (brief !== undefined) update.brief = brief
  if (briefStatus) update.briefStatus = briefStatus
  if (action === 'approve') {
    if (!hasPermission(user, 'projects.write')) return forbiddenResponse()
    update.briefStatus = 'approved'
    update.briefApprovedAt = new Date()
    update.briefApprovedBy = (user as any)._id
  }
  if (action === 'reject') {
    if (!hasPermission(user, 'projects.write')) return forbiddenResponse()
    update.briefStatus = 'rejected'
  }
  const project = await Project.findByIdAndUpdate(params.id, update, { new: true })
  if (!project) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true, data: project })
}

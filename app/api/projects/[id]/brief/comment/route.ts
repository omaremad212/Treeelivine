import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, unauthorizedResponse } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Project from '@/models/Project'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  await connectDB()
  const { text } = await req.json()
  if (!text?.trim()) return NextResponse.json({ success: false, message: 'Comment text required' }, { status: 400 })
  const project = await Project.findByIdAndUpdate(
    params.id,
    { $push: { briefComments: { authorId: (user as any)._id, authorName: (user as any).name || (user as any).email, text, createdAt: new Date() } } },
    { new: true }
  )
  if (!project) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true, data: project.briefComments })
}

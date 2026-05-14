import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, unauthorizedResponse } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Template from '@/models/Template'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  await connectDB()
  const source = await Template.findById(params.id)
  if (!source) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
  const recommendations = await Template.find({
    _id: { $ne: source._id },
    $or: [{ category: source.category }, { type: source.type }],
  }).limit(5).sort({ usageCount: -1 })
  return NextResponse.json({ success: true, data: recommendations })
}

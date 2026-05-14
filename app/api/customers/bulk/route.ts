import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Customer from '@/models/Customer'

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'crm.write')) return forbiddenResponse()
  await connectDB()
  const { ids, action, value } = await req.json()
  if (!ids?.length) return NextResponse.json({ success: false, message: 'No IDs' }, { status: 400 })
  let update: any = {}
  if (action === 'status') update = { status: value }
  else if (action === 'assignedTo') update = { assignedTo: value }
  else if (action === 'archive') update = { archivedAt: new Date(), archivedBy: (user as any)._id }
  await Customer.updateMany({ _id: { $in: ids } }, update)
  return NextResponse.json({ success: true })
}

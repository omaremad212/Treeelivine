import { getAuthUser } from '@/lib/auth'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return Response.json({ success: false })
  return Response.json({ success: true, user })
}

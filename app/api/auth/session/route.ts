import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user) return NextResponse.json({ success: false, message: 'No session' }, { status: 401 })
    const { password: _, ...safeUser } = user as any
    return NextResponse.json({ success: true, user: safeUser })
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 })
  }
}

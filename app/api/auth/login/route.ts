import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabase } from '@/lib/supabase'
import { signToken, cookieOptions, getEffectivePermissions } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return Response.json({ success: false, message: 'Missing fields' }, { status: 400 })

    const { data: user } = await supabase.from('users').select('*').eq('email', email.toLowerCase()).single()
    if (!user) return Response.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
    if (!user.is_active) return Response.json({ success: false, message: 'Account inactive' }, { status: 403 })

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return Response.json({ success: false, message: 'Invalid credentials' }, { status: 401 })

    const { data: settingsRow } = await supabase.from('settings').select('*').limit(1).single()
    const settings = settingsRow ? { roles: settingsRow.roles, permissions: settingsRow.permissions } : {}
    const effectivePermissions = getEffectivePermissions(user, settings)

    const token = signToken(user.id)
    const cookieStore = cookies()
    cookieStore.set('treeelivine_session', token, cookieOptions())

    return Response.json({
      success: true,
      user: {
        _id: user.id, id: user.id, email: user.email, name: user.name,
        role: user.role, isActive: user.is_active, isDemo: user.is_demo,
        effectivePermissions,
      }
    })
  } catch (e) {
    console.error(e)
    return Response.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

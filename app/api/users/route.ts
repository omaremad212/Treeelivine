import { NextRequest } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse, demoReadOnlyResponse } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { toApi } from '@/lib/utils'
import bcrypt from 'bcryptjs'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'settings.read')) return forbiddenResponse()

  const { data, error } = await supabase.from('users')
    .select('id, email, name, role, is_active, is_demo, effective_permissions, created_at, updated_at')
    .order('created_at', { ascending: false })

  if (error) return Response.json({ success: false, message: error.message }, { status: 500 })
  return Response.json({ success: true, data: toApi(data || []) })
}

export async function POST(req: NextRequest) {
  const authUser = await getAuthUser(req)
  if (!authUser) return unauthorizedResponse()
  if (!hasPermission(authUser, 'settings.write')) return forbiddenResponse()
  if (authUser.isDemo) return demoReadOnlyResponse()

  const { name, email, password, role } = await req.json()
  if (!email || !password || !name) return Response.json({ success: false, message: 'Name, email and password are required' }, { status: 400 })

  const { data: existing } = await supabase.from('users').select('id').eq('email', email.toLowerCase()).single()
  if (existing) return Response.json({ success: false, message: 'Email already in use' }, { status: 409 })

  const hash = await bcrypt.hash(password, 10)
  const { data, error } = await supabase.from('users').insert({
    email: email.toLowerCase(),
    password: hash,
    name,
    role: role || 'team',
    is_active: true,
  }).select('id, email, name, role, is_active, is_demo, effective_permissions, created_at, updated_at').single()

  if (error || !data) return Response.json({ success: false, message: error?.message || 'Failed to create user' }, { status: 500 })
  return Response.json({ success: true, data: toApi(data) }, { status: 201 })
}

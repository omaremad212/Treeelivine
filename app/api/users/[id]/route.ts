import { NextRequest } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { toApi } from '@/lib/utils'
import bcrypt from 'bcryptjs'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'settings.read') && user.id !== params.id) return forbiddenResponse()

  const { data } = await supabase.from('users')
    .select('id, email, name, role, is_active, is_demo, effective_permissions, created_at, updated_at')
    .eq('id', params.id).single()
  if (!data) return Response.json({ success: false, message: 'Not found' }, { status: 404 })
  return Response.json({ success: true, data: toApi(data) })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  const isSelf = user.id === params.id
  if (!isSelf && !hasPermission(user, 'settings.write')) return forbiddenResponse()

  const { password, role, effectivePermissions, name, email, isActive } = await req.json()
  const updates: any = {}
  if (name !== undefined) updates.name = name
  if (email !== undefined) updates.email = email.toLowerCase()
  if (isActive !== undefined) updates.is_active = isActive
  if (password) updates.password = await bcrypt.hash(password, 10)
  if (hasPermission(user, 'settings.write')) {
    if (role) updates.role = role
    if (effectivePermissions) updates.effective_permissions = effectivePermissions
  }

  const { data, error } = await supabase.from('users')
    .update(updates).eq('id', params.id)
    .select('id, email, name, role, is_active, is_demo, effective_permissions, created_at, updated_at')
    .single()

  if (error) return Response.json({ success: false, message: error.message }, { status: 500 })
  if (!data) return Response.json({ success: false, message: 'Not found' }, { status: 404 })
  return Response.json({ success: true, data: toApi(data) })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'settings.write')) return forbiddenResponse()

  const { error } = await supabase.from('users').delete().eq('id', params.id)
  if (error) return Response.json({ success: false, message: error.message }, { status: 500 })
  return Response.json({ success: true })
}

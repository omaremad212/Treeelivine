import { NextRequest } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { toApi } from '@/lib/utils'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'templates.read')) return forbiddenResponse()

  const { data: existing } = await supabase.from('templates').select('usage_count').eq('id', params.id).single()
  if (!existing) return Response.json({ success: false, message: 'Not found' }, { status: 404 })

  const { data, error } = await supabase.from('templates')
    .update({ usage_count: (existing.usage_count || 0) + 1 })
    .eq('id', params.id).select().single()

  if (error) return Response.json({ success: false, message: error.message }, { status: 500 })
  return Response.json({ success: true, data: toApi(data) })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'templates.write')) return forbiddenResponse()

  const body = await req.json()
  const updates: any = {}
  if (body.name !== undefined) updates.name = body.name
  if (body.description !== undefined) updates.description = body.description
  if (body.type !== undefined) updates.type = body.type
  if (body.category !== undefined) updates.category = body.category
  if (body.content !== undefined) updates.content = body.content

  const { data, error } = await supabase.from('templates').update(updates).eq('id', params.id).select().single()
  if (error) return Response.json({ success: false, message: error.message }, { status: 500 })
  if (!data) return Response.json({ success: false, message: 'Not found' }, { status: 404 })
  return Response.json({ success: true, data: toApi(data) })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'templates.write')) return forbiddenResponse()

  const { error } = await supabase.from('templates').delete().eq('id', params.id)
  if (error) return Response.json({ success: false, message: error.message }, { status: 500 })
  return Response.json({ success: true })
}

import { NextRequest } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { toApi } from '@/lib/utils'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()

  const { data } = await supabase.from('projects')
    .select('id, brief, brief_status, brief_comments, name, customer_id, customer:customers(id,name,email)')
    .eq('id', params.id).single()
  if (!data) return Response.json({ success: false, message: 'Not found' }, { status: 404 })
  return Response.json({ success: true, data: toApi(data) })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()

  const { brief, briefStatus, action } = await req.json()
  const updates: any = {}
  if (brief !== undefined) updates.brief = brief
  if (briefStatus) updates.brief_status = briefStatus

  if (action === 'approve') {
    if (!hasPermission(user, 'projects.write')) return forbiddenResponse()
    updates.brief_status = 'approved'
    updates.brief_approved_at = new Date().toISOString()
    updates.brief_approved_by = user.id
  }
  if (action === 'reject') {
    if (!hasPermission(user, 'projects.write')) return forbiddenResponse()
    updates.brief_status = 'rejected'
  }

  const { data, error } = await supabase.from('projects').update(updates).eq('id', params.id).select().single()
  if (error) return Response.json({ success: false, message: error.message }, { status: 500 })
  if (!data) return Response.json({ success: false, message: 'Not found' }, { status: 404 })
  return Response.json({ success: true, data: toApi(data) })
}

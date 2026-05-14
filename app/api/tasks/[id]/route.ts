import { NextRequest } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { toApi } from '@/lib/utils'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'tasks.read')) return forbiddenResponse()

  const { data } = await supabase.from('tasks')
    .select('*, project:projects(id,name), assignee:employees(id,name,email,internal_role)')
    .eq('id', params.id).single()
  if (!data) return Response.json({ success: false, message: 'Not found' }, { status: 404 })
  return Response.json({ success: true, data: toApi(data) })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'tasks.write')) return forbiddenResponse()

  const body = await req.json()
  const updates: any = {}
  if (body.title !== undefined) updates.title = body.title
  if (body.description !== undefined) updates.description = body.description
  if (body.status !== undefined) updates.status = body.status
  if (body.priority !== undefined) updates.priority = body.priority
  if (body.dueDate !== undefined) updates.due_date = body.dueDate
  if (body.due_date !== undefined) updates.due_date = body.due_date
  if (body.currentAssigneeId !== undefined) updates.current_assignee_id = body.currentAssigneeId
  if (body.current_assignee_id !== undefined) updates.current_assignee_id = body.current_assignee_id
  if (body.projectId !== undefined) updates.project_id = body.projectId
  if (body.completedAt !== undefined) updates.completed_at = body.completedAt

  // Append history entry
  const { data: existing } = await supabase.from('tasks').select('history').eq('id', params.id).single()
  const history = Array.isArray(existing?.history) ? existing.history : []
  updates.history = [...history, { action: 'updated', by: user.id, at: new Date().toISOString() }]

  const { data, error } = await supabase.from('tasks').update(updates).eq('id', params.id).select().single()
  if (error) return Response.json({ success: false, message: error.message }, { status: 500 })
  if (!data) return Response.json({ success: false, message: 'Not found' }, { status: 404 })
  return Response.json({ success: true, data: toApi(data) })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'tasks.write')) return forbiddenResponse()

  const { error } = await supabase.from('tasks').delete().eq('id', params.id)
  if (error) return Response.json({ success: false, message: error.message }, { status: 500 })
  return Response.json({ success: true })
}

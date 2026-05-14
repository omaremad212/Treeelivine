import { NextRequest } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { toApi } from '@/lib/utils'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'team.read')) return forbiddenResponse()

  const { data: emp } = await supabase.from('employees').select('*').eq('id', params.id).single()
  if (!emp) return Response.json({ success: false, message: 'Not found' }, { status: 404 })

  const now = new Date().toISOString()
  const [{ count: taskCount }, { count: projectCount }, { count: overdueTasks }] = await Promise.all([
    supabase.from('tasks').select('*', { count: 'exact', head: true })
      .eq('current_assignee_id', params.id).not('status', 'in', '("completed","cancelled")'),
    supabase.from('projects').select('*', { count: 'exact', head: true })
      .contains('assigned_employee_ids', [params.id]).eq('status', 'active'),
    supabase.from('tasks').select('*', { count: 'exact', head: true })
      .eq('current_assignee_id', params.id).lt('due_date', now).not('status', 'in', '("completed","cancelled")'),
  ])

  return Response.json({ success: true, data: toApi(emp), stats: { taskCount, projectCount, overdueTasks } })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'team.write')) return forbiddenResponse()

  const body = await req.json()
  const updates: any = {}
  if (body.name !== undefined) updates.name = body.name
  if (body.email !== undefined) updates.email = body.email
  if (body.phone !== undefined) updates.phone = body.phone
  if (body.internalRole !== undefined) updates.internal_role = body.internalRole
  if (body.internal_role !== undefined) updates.internal_role = body.internal_role
  if (body.salary !== undefined) updates.salary = body.salary
  if (body.userId !== undefined) updates.user_id = body.userId

  const { data, error } = await supabase.from('employees').update(updates).eq('id', params.id).select().single()
  if (error) return Response.json({ success: false, message: error.message }, { status: 500 })
  if (!data) return Response.json({ success: false, message: 'Not found' }, { status: 404 })
  return Response.json({ success: true, data: toApi(data) })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'team.write')) return forbiddenResponse()

  const { error } = await supabase.from('employees').delete().eq('id', params.id)
  if (error) return Response.json({ success: false, message: error.message }, { status: 500 })
  return Response.json({ success: true })
}

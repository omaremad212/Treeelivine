import { NextRequest } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse, demoReadOnlyResponse } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { toApi } from '@/lib/utils'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'projects.read')) return forbiddenResponse()

  const [{ data: project }, { data: tasks }] = await Promise.all([
    supabase.from('projects').select('*, customer:customers(id,name,email,company)').eq('id', params.id).single(),
    supabase.from('tasks').select('*, assignee:employees(id,name,email)').eq('project_id', params.id).order('created_at', { ascending: false }),
  ])

  if (!project) return Response.json({ success: false, message: 'Not found' }, { status: 404 })
  return Response.json({ success: true, data: toApi(project), tasks: toApi(tasks || []) })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'projects.write')) return forbiddenResponse()
  if (user.isDemo) return demoReadOnlyResponse()

  const body = await req.json()
  const updates: any = {}
  if (body.name !== undefined) updates.name = body.name
  if (body.description !== undefined) updates.description = body.description
  if (body.customerId !== undefined) updates.customer_id = body.customerId
  if (body.customer_id !== undefined) updates.customer_id = body.customer_id
  if (body.status !== undefined) updates.status = body.status
  if (body.brief !== undefined) updates.brief = body.brief
  if (body.briefStatus !== undefined) updates.brief_status = body.briefStatus
  if (body.brief_status !== undefined) updates.brief_status = body.brief_status
  if (body.assignedEmployeeIds !== undefined) updates.assigned_employee_ids = body.assignedEmployeeIds
  if (body.assigned_employee_ids !== undefined) updates.assigned_employee_ids = body.assigned_employee_ids
  if (body.dueDate !== undefined) updates.due_date = body.dueDate
  if (body.due_date !== undefined) updates.due_date = body.due_date
  if (body.startDate !== undefined) updates.start_date = body.startDate
  if (body.notes !== undefined) updates.notes = body.notes
  if (body.briefComments !== undefined) updates.brief_comments = body.briefComments
  if (body.taskProgressPercent !== undefined) updates.task_progress_percent = body.taskProgressPercent

  const { data, error } = await supabase.from('projects').update(updates).eq('id', params.id).select().single()
  if (error) return Response.json({ success: false, message: error.message }, { status: 500 })
  if (!data) return Response.json({ success: false, message: 'Not found' }, { status: 404 })
  return Response.json({ success: true, data: toApi(data) })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'projects.write')) return forbiddenResponse()
  if (user.isDemo) return demoReadOnlyResponse()

  await supabase.from('tasks').delete().eq('project_id', params.id)
  const { error } = await supabase.from('projects').delete().eq('id', params.id)
  if (error) return Response.json({ success: false, message: error.message }, { status: 500 })
  return Response.json({ success: true })
}

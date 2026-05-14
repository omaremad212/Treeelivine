import { NextRequest } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { toApi } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'tasks.read')) return forbiddenResponse()

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')
  const status = searchParams.get('status')
  const projectId = searchParams.get('projectId')
  const assigneeId = searchParams.get('assigneeId')

  let query = supabase.from('tasks')
    .select('*, project:projects(id,name), assignee:employees(id,name,email,internal_role)')
    .order('due_date', { ascending: true, nullsFirst: false })

  if (!user.isDemo) query = query.eq('is_demo', false)
  if (status) query = query.eq('status', status)
  if (projectId) query = query.eq('project_id', projectId)
  if (assigneeId) query = query.eq('current_assignee_id', assigneeId)

  if (user.role === 'team') {
    const { data: emp } = await supabase.from('employees').select('id').eq('user_id', user.id).single()
    if (emp) query = query.eq('current_assignee_id', emp.id)
  }

  const { data, error } = await query
  if (error) return Response.json({ success: false, message: error.message }, { status: 500 })

  let result = data || []
  if (search) {
    const s = search.toLowerCase()
    result = result.filter(t => t.title?.toLowerCase().includes(s) || t.description?.toLowerCase().includes(s))
  }

  return Response.json({ success: true, data: toApi(result) })
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'tasks.write')) return forbiddenResponse()

  const body = await req.json()
  if (!body.title) return Response.json({ success: false, message: 'Title is required' }, { status: 400 })

  const { data, error } = await supabase.from('tasks').insert({
    title: body.title,
    description: body.description,
    project_id: body.projectId || body.project_id || null,
    customer_id: body.customerId || body.customer_id || null,
    current_assignee_id: body.currentAssigneeId || body.current_assignee_id || null,
    status: body.status || 'pending',
    priority: body.priority || 'medium',
    due_date: body.dueDate || body.due_date || null,
    history: [{ action: 'created', by: user.id, at: new Date().toISOString() }],
  }).select().single()

  if (error) return Response.json({ success: false, message: error.message }, { status: 500 })
  return Response.json({ success: true, data: toApi(data) }, { status: 201 })
}

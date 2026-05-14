import { NextRequest } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse, demoReadOnlyResponse } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { toApi } from '@/lib/utils'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'tasks.write')) return forbiddenResponse()
  if (user.isDemo) return demoReadOnlyResponse()

  const { newAssigneeId, note } = await req.json()
  if (!newAssigneeId) return Response.json({ success: false, message: 'newAssigneeId is required' }, { status: 400 })

  const { data: task } = await supabase.from('tasks').select('*').eq('id', params.id).single()
  if (!task) return Response.json({ success: false, message: 'Not found' }, { status: 404 })

  const history = Array.isArray(task.history) ? task.history : []
  const { data, error } = await supabase.from('tasks').update({
    current_assignee_id: newAssigneeId,
    history: [...history, { action: 'handover', by: user.id, from: task.current_assignee_id, to: newAssigneeId, note, at: new Date().toISOString() }],
  }).eq('id', params.id).select().single()

  if (error) return Response.json({ success: false, message: error.message }, { status: 500 })
  return Response.json({ success: true, data: toApi(data) })
}

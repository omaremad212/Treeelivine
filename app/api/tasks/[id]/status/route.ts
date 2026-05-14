import { NextRequest } from 'next/server'
import { getAuthUser, unauthorizedResponse } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { toApi } from '@/lib/utils'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()

  const { status } = await req.json()
  const validStatuses = ['pending', 'in_progress', 'in_review', 'completed', 'cancelled']
  if (!validStatuses.includes(status)) {
    return Response.json({ success: false, message: 'Invalid status' }, { status: 400 })
  }

  const { data: task } = await supabase.from('tasks').select('*').eq('id', params.id).single()
  if (!task) return Response.json({ success: false, message: 'Not found' }, { status: 404 })

  if (user.role === 'team') {
    const { data: emp } = await supabase.from('employees').select('id').eq('user_id', user.id).single()
    if (!emp || task.current_assignee_id !== emp.id) {
      return Response.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }
  }

  const history = Array.isArray(task.history) ? task.history : []
  const updates: any = {
    status,
    history: [...history, { action: `status:${status}`, by: user.id, at: new Date().toISOString() }],
  }
  if (status === 'completed') updates.completed_at = new Date().toISOString()

  const { data, error } = await supabase.from('tasks').update(updates).eq('id', params.id).select().single()
  if (error) return Response.json({ success: false, message: error.message }, { status: 500 })
  return Response.json({ success: true, data: toApi(data) })
}

import { NextRequest } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'crm.write')) return forbiddenResponse()

  const { ids, action, value } = await req.json()
  if (!ids?.length) return Response.json({ success: false, message: 'No IDs' }, { status: 400 })

  let updates: any = {}
  if (action === 'status') updates = { status: value }
  else if (action === 'assignedTo') updates = { assigned_to: value }
  else if (action === 'archive') updates = { archived_at: new Date().toISOString() }

  const { error } = await supabase.from('customers').update(updates).in('id', ids)
  if (error) return Response.json({ success: false, message: error.message }, { status: 500 })
  return Response.json({ success: true })
}

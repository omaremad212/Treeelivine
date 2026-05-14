import { NextRequest } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { toApi } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'team.read')) return forbiddenResponse()

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')
  const internalRole = searchParams.get('internalRole')

  let query = supabase.from('employees').select('*').order('name')
  if (internalRole) query = query.eq('internal_role', internalRole)

  const { data, error } = await query
  if (error) return Response.json({ success: false, message: error.message }, { status: 500 })

  let result = data || []
  if (search) {
    const s = search.toLowerCase()
    result = result.filter(e => e.name?.toLowerCase().includes(s) || e.email?.toLowerCase().includes(s))
  }

  return Response.json({ success: true, data: toApi(result) })
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'team.write')) return forbiddenResponse()

  const body = await req.json()
  const { data, error } = await supabase.from('employees').insert({
    name: body.name,
    email: body.email,
    phone: body.phone,
    internal_role: body.internalRole || body.internal_role,
    salary: body.salary,
    user_id: body.userId || body.user_id || null,
  }).select().single()

  if (error) return Response.json({ success: false, message: error.message }, { status: 500 })
  return Response.json({ success: true, data: toApi(data) }, { status: 201 })
}

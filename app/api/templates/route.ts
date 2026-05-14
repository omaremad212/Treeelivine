import { NextRequest } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse, demoReadOnlyResponse } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { toApi } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'templates.read')) return forbiddenResponse()

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')
  const category = searchParams.get('category')
  const type = searchParams.get('type')

  let query = supabase.from('templates').select('*').order('usage_count', { ascending: false })
  if (category) query = query.eq('category', category)
  if (type) query = query.eq('type', type)

  const { data, error } = await query
  if (error) return Response.json({ success: false, message: error.message }, { status: 500 })

  let result = data || []
  if (search) {
    const s = search.toLowerCase()
    result = result.filter(t => t.name?.toLowerCase().includes(s) || t.description?.toLowerCase().includes(s))
  }

  return Response.json({ success: true, data: toApi(result) })
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'templates.write')) return forbiddenResponse()
  if (user.isDemo) return demoReadOnlyResponse()

  const body = await req.json()
  if (!body.name) return Response.json({ success: false, message: 'Name is required' }, { status: 400 })

  const { data, error } = await supabase.from('templates').insert({
    name: body.name,
    description: body.description,
    type: body.type || 'brief',
    category: body.category || 'general',
    content: body.content,
    created_by: user.id,
  }).select().single()

  if (error) return Response.json({ success: false, message: error.message }, { status: 500 })
  return Response.json({ success: true, data: toApi(data) }, { status: 201 })
}

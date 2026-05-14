import { NextRequest } from 'next/server'
import { getAuthUser, unauthorizedResponse } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { toApi } from '@/lib/utils'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()

  const { data: source } = await supabase.from('templates').select('id,category,type').eq('id', params.id).single()
  if (!source) return Response.json({ success: false, message: 'Not found' }, { status: 404 })

  const { data } = await supabase.from('templates')
    .select('*')
    .neq('id', source.id)
    .or(`category.eq.${source.category},type.eq.${source.type}`)
    .order('usage_count', { ascending: false })
    .limit(5)

  return Response.json({ success: true, data: toApi(data || []) })
}

import { NextRequest } from 'next/server'
import { getAuthUser, unauthorizedResponse } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { toApi } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (user.role !== 'client') {
    return Response.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  const { data: customer } = await supabase.from('customers').select('*').eq('user_id', user.id).single()
  if (!customer) return Response.json({ success: false, message: 'No customer record found' }, { status: 404 })

  const [{ data: projects }, { data: invoices }] = await Promise.all([
    supabase.from('projects').select('*').eq('customer_id', customer.id).order('updated_at', { ascending: false }),
    supabase.from('invoices').select('*').eq('customer_id', customer.id).order('created_at', { ascending: false }),
  ])

  return Response.json({ success: true, data: { customer: toApi(customer), projects: toApi(projects || []), invoices: toApi(invoices || []) } })
}

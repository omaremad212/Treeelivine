import { NextRequest } from 'next/server'
import { getAuthUser, unauthorizedResponse } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { toApi } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || ''
  const search = searchParams.get('search') || ''

  let query = supabase
    .from('quotations')
    .select('*, customer:customers(id,name,company), project:projects(id,name)')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (search) query = query.ilike('quote_number', `%${search}%`)

  const { data, error } = await query
  if (error) return Response.json({ success: false, message: error.message }, { status: 500 })
  return Response.json({ success: true, data: toApi(data || []) })
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()

  const body = await req.json()
  const { customerId, projectId, status, currency, items, taxRate, validUntil, notes } = body

  const { count } = await supabase.from('quotations').select('*', { count: 'exact', head: true })
  const quoteNumber = `QT-${new Date().getFullYear()}-${String((count || 0) + 1).padStart(3, '0')}`

  const parsedItems: any[] = Array.isArray(items) ? items : []
  const subtotal = parsedItems.reduce((s: number, i: any) => s + (Number(i.qty || 1) * Number(i.price || 0)), 0)
  const tr = Number(taxRate || 0)
  const taxAmount = subtotal * (tr / 100)
  const total = subtotal + taxAmount

  const { data, error } = await supabase.from('quotations').insert({
    quote_number: quoteNumber,
    customer_id: customerId || null,
    project_id: projectId || null,
    status: status || 'draft',
    currency: currency || 'SAR',
    items: parsedItems,
    subtotal,
    tax_rate: tr,
    tax_amount: taxAmount,
    total,
    valid_until: validUntil || null,
    notes: notes || null,
  }).select().single()

  if (error) return Response.json({ success: false, message: error.message }, { status: 500 })
  return Response.json({ success: true, data: toApi(data) })
}

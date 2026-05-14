import { NextRequest } from 'next/server'
import { getAuthUser, unauthorizedResponse } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { toApi } from '@/lib/utils'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  const { data } = await supabase
    .from('quotations')
    .select('*, customer:customers(id,name,company), project:projects(id,name)')
    .eq('id', params.id).single()
  return Response.json({ success: true, data: toApi(data) })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()

  const { customerId, projectId, status, currency, items, taxRate, validUntil, notes } = await req.json()

  const parsedItems: any[] = Array.isArray(items) ? items : []
  const subtotal = parsedItems.reduce((s: number, i: any) => s + (Number(i.qty || 1) * Number(i.price || 0)), 0)
  const tr = Number(taxRate || 0)
  const taxAmount = subtotal * (tr / 100)
  const total = subtotal + taxAmount

  const { data, error } = await supabase.from('quotations').update({
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
  }).eq('id', params.id).select().single()

  if (error) return Response.json({ success: false, message: error.message }, { status: 500 })
  return Response.json({ success: true, data: toApi(data) })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  await supabase.from('quotations').delete().eq('id', params.id)
  return Response.json({ success: true })
}

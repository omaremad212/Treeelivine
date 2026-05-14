import { NextRequest } from 'next/server'
import { getAuthUser, hasPermission, unauthorizedResponse, forbiddenResponse } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { toApi } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'finance.read')) return forbiddenResponse()

  const { data, error } = await supabase.from('expenses')
    .select('*, employee:employees(id,name,email,internal_role)')
    .eq('is_recurring_salary', true)
    .order('created_at', { ascending: false })

  if (error) return Response.json({ success: false, message: error.message }, { status: 500 })
  return Response.json({ success: true, data: toApi(data || []) })
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()
  if (!hasPermission(user, 'finance.write')) return forbiddenResponse()

  const body = await req.json()
  const employeeId = body.employeeId || body.employee_id
  if (!employeeId || !body.amount) {
    return Response.json({ success: false, message: 'Employee and amount required' }, { status: 400 })
  }

  const now = new Date()
  const nextDue = body.salaryNextDueDate || body.salary_next_due_date || new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString()

  const { data, error } = await supabase.from('expenses').insert({
    description: body.description,
    category: 'salary',
    amount: body.amount,
    employee_id: employeeId,
    is_recurring_salary: true,
    salary_next_due_date: nextDue,
    date: now.toISOString(),
  }).select().single()

  if (error) return Response.json({ success: false, message: error.message }, { status: 500 })
  return Response.json({ success: true, data: toApi(data) }, { status: 201 })
}

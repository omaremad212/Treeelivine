import { NextRequest } from 'next/server'
import { getAuthUser, unauthorizedResponse } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { syncRecurringSalaryExpenses } from '@/lib/salary-sync'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()

  await syncRecurringSalaryExpenses()

  const isDemo = !!user.isDemo
  const [
    { data: customers },
    { data: projects },
    { data: tasks },
    { data: invoices },
    { data: expenses },
  ] = await Promise.all([
    supabase.from('customers').select('id, status').eq('is_demo', isDemo),
    supabase.from('projects').select('id, status').eq('is_demo', isDemo),
    supabase.from('tasks').select('id, status, due_date').eq('is_demo', isDemo),
    supabase.from('invoices').select('id, status, amount, paid_amount, remaining_amount').eq('is_demo', isDemo),
    supabase.from('expenses').select('id, amount').eq('is_recurring_salary', false).eq('is_demo', isDemo),
  ])

  const now = new Date()
  const activeCustomers = customers?.filter(c => c.status === 'active').length ?? 0
  const activeProjects = projects?.filter(p => ['active','in_progress'].includes(p.status)).length ?? 0
  const openTasks = tasks?.filter(t => !['completed','cancelled'].includes(t.status)).length ?? 0
  const overdueTasks = tasks?.filter(t => t.due_date && new Date(t.due_date) < now && !['completed','cancelled'].includes(t.status)).length ?? 0
  const collected = invoices?.reduce((s, i) => s + (Number(i.paid_amount) || 0), 0) ?? 0
  const unpaidAmt = invoices?.filter(i => i.status !== 'paid').reduce((s, i) => s + (Number(i.amount) - Number(i.paid_amount || 0)), 0) ?? 0
  const unpaidInvoices = invoices?.filter(i => i.status !== 'paid').length ?? 0
  const totalExpenses = expenses?.reduce((s, e) => s + (Number(e.amount) || 0), 0) ?? 0

  return Response.json({
    success: true,
    data: { activeCustomers, activeProjects, openTasks, overdueTasks, collected, unpaidAmt, unpaidInvoices, totalExpenses, net: collected - totalExpenses }
  })
}

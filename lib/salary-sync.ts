import { supabase } from './supabase'

export async function syncRecurringSalaryExpenses() {
  try {
    const { data: templates } = await supabase
      .from('expenses')
      .select('*')
      .eq('is_recurring_salary', true)
      .not('salary_next_due_date', 'is', null)

    if (!templates?.length) return
    const now = new Date()

    for (const tmpl of templates) {
      const nextDue = new Date(tmpl.salary_next_due_date)
      if (nextDue > now) continue

      // Create expense for this month
      await supabase.from('expenses').insert({
        description: tmpl.description,
        category: tmpl.category,
        amount: tmpl.amount,
        employee_id: tmpl.employee_id,
        is_recurring_salary: false,
        date: tmpl.salary_next_due_date,
      })

      // Advance next due date by 1 month
      const next = new Date(nextDue)
      next.setMonth(next.getMonth() + 1)

      await supabase.from('expenses').update({
        salary_next_due_date: next.toISOString(),
      }).eq('id', tmpl.id)
    }
  } catch (err) {
    console.error('syncRecurringSalaryExpenses error:', err)
  }
}

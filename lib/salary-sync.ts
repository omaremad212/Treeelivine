import Expense from '@/models/Expense'

export async function syncRecurringSalaryExpenses() {
  try {
    const templates = await Expense.find({ isTemplate: true, expenseType: 'salary', active: true })
    const now = new Date()
    for (const tmpl of templates) {
      if (!tmpl.salaryNextDueDate || tmpl.salaryNextDueDate > now) continue
      const monthKey = `${tmpl.salaryNextDueDate.getFullYear()}-${String(tmpl.salaryNextDueDate.getMonth() + 1).padStart(2, '0')}`
      const exists = await Expense.findOne({ sourceExpenseId: tmpl._id, generatedMonthKey: monthKey })
      if (!exists) {
        await Expense.create({
          description: tmpl.description, category: tmpl.category,
          amount: tmpl.amount, amountOriginal: tmpl.amountOriginal || tmpl.amount,
          currency: tmpl.currency, currencyCode: tmpl.currencyCode,
          exchangeRateToBase: tmpl.exchangeRateToBase,
          amountBase: tmpl.amountBase || tmpl.amount,
          employeeId: tmpl.employeeId, expenseType: 'salary',
          isTemplate: false, generatedMonthKey: monthKey, sourceExpenseId: tmpl._id, active: true,
        })
      }
      const next = new Date(tmpl.salaryNextDueDate)
      next.setMonth(next.getMonth() + 1)
      tmpl.salaryNextDueDate = next
      tmpl.salaryLastGeneratedMonthKey = monthKey
      await tmpl.save()
    }
  } catch (err) {
    console.error('syncRecurringSalaryExpenses error:', err)
  }
}

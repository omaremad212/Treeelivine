import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, unauthorizedResponse } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { syncRecurringSalaryExpenses } from '@/lib/salary-sync'
import Customer from '@/models/Customer'
import Project from '@/models/Project'
import Task from '@/models/Task'
import Invoice from '@/models/Invoice'
import Expense from '@/models/Expense'

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user) return unauthorizedResponse()

    await connectDB()
    await syncRecurringSalaryExpenses()

    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') || 'month'
    const now = new Date()
    let dateFilter: any = {}

    if (period === 'today') { const s = new Date(now); s.setHours(0,0,0,0); dateFilter = { $gte: s } }
    else if (period === '7d') { const s = new Date(now); s.setDate(s.getDate()-7); dateFilter = { $gte: s } }
    else if (period === '30d') { const s = new Date(now); s.setDate(s.getDate()-30); dateFilter = { $gte: s } }
    else if (period === 'month') { const s = new Date(now.getFullYear(), now.getMonth(), 1); dateFilter = { $gte: s } }
    else if (period === 'quarter') { const q = Math.floor(now.getMonth()/3); const s = new Date(now.getFullYear(), q*3, 1); dateFilter = { $gte: s } }
    else if (period === 'custom') {
      const sd = searchParams.get('startDate'); const ed = searchParams.get('endDate')
      if (sd && ed) dateFilter = { $gte: new Date(sd), $lte: new Date(ed) }
    }

    const dateQ = Object.keys(dateFilter).length ? { createdAt: dateFilter } : {}
    const isClient = (user as any).role === 'client'
    const clientId = isClient ? (user as any).referenceId : null

    const custQ = isClient ? { _id: clientId } : {}
    const projQ = isClient ? { customerId: clientId } : {}
    const taskQ = isClient ? { customerId: clientId } : {}
    const invQ = isClient ? { customerId: clientId } : {}

    const [activeCustomers, activeProjects, openTasks, overdueTasks, invoices, expenses] = await Promise.all([
      Customer.countDocuments({ ...custQ, status: 'active' }),
      Project.countDocuments({ ...projQ, status: 'active' }),
      Task.countDocuments({ ...taskQ, status: { $in: ['new','assigned','in_progress','reopened'] } }),
      Task.countDocuments({ ...taskQ, dueDate: { $lt: now }, status: { $nin: ['completed','cancelled'] } }),
      Invoice.find({ ...invQ, ...dateQ }),
      Expense.find({ isTemplate: false, ...dateQ }),
    ])

    const collected = invoices.filter((i: any) => i.status === 'paid').reduce((a: number, i: any) => a + (i.amountBase || 0), 0)
    const unpaidAmt = invoices.filter((i: any) => ['unpaid','issued','partially_paid','overdue'].includes(i.status)).reduce((a: number, i: any) => a + (i.remainingAmountBase || 0), 0)
    const totalExpenses = expenses.reduce((a: number, e: any) => a + (e.amountBase || 0), 0)

    return NextResponse.json({
      success: true,
      data: { activeCustomers, activeProjects, openTasks, overdueTasks, collected, unpaidAmt, totalExpenses, net: collected - totalExpenses, unpaidInvoices: invoices.filter((i: any) => ['unpaid','issued','partially_paid','overdue'].includes(i.status)).length },
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import { signToken, cookieOptions } from '@/lib/auth'
import User from '@/models/User'
import Customer from '@/models/Customer'
import Employee from '@/models/Employee'
import Project from '@/models/Project'
import Task from '@/models/Task'
import Invoice from '@/models/Invoice'
import Expense from '@/models/Expense'
import Setting from '@/models/Setting'
import { demoCustomers, demoEmployees, demoProjects, DEMO_EMAIL, DEMO_PASSWORD } from '@/lib/demo-data'

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    // Clear existing demo data
    await Promise.all([
      User.deleteMany({ isDemo: true }),
      Customer.deleteMany({ isDemo: true }),
      Employee.deleteMany({ isDemo: true }),
      Project.deleteMany({ isDemo: true }),
      Task.deleteMany({ isDemo: true }),
      Invoice.deleteMany({ isDemo: true }),
      Expense.deleteMany({ isDemo: true }),
    ])

    // Ensure settings exist
    let settings = await Setting.findOne()
    if (!settings) settings = await Setting.create({})

    // Create demo admin user
    const hashed = await bcrypt.hash(DEMO_PASSWORD, 10)
    const demoUser = await User.create({ email: DEMO_EMAIL, password: hashed, role: 'admin', isActive: true, isDemo: true })

    // Create demo customers
    const customers = await Customer.insertMany(demoCustomers.map(c => ({ ...c, isDemo: true })))

    // Create demo employees
    const employees = await Employee.insertMany(demoEmployees.map(e => ({ ...e, isDemo: true })))

    // Create demo projects
    const projects = await Project.insertMany(demoProjects.map((p, i) => ({
      ...p,
      customerId: customers[i % customers.length]._id,
      accountManagerId: employees[0]._id,
      assignedEmployeeIds: [employees[1]._id, employees[2]._id],
      assignmentStatus: 'ready',
      isDemo: true,
    })))

    // Create demo tasks
    const taskData = [
      { title: 'تصميم بوست إنستغرام - أسبوع 1', status: 'in_progress', priority: 'high', projectId: projects[0]._id, customerId: customers[0]._id, currentAssigneeId: employees[1]._id, dueDate: new Date(Date.now() + 2 * 86400000), isDemo: true },
      { title: 'كتابة محتوى شهر أبريل', status: 'new', priority: 'medium', projectId: projects[0]._id, customerId: customers[0]._id, currentAssigneeId: employees[2]._id, dueDate: new Date(Date.now() + 5 * 86400000), isDemo: true },
      { title: 'تصميم الشعار الأساسي', status: 'under_review', priority: 'urgent', projectId: projects[1]._id, customerId: customers[1]._id, currentAssigneeId: employees[1]._id, reviewRequired: true, reviewStatus: 'under_review', dueDate: new Date(Date.now() - 1 * 86400000), isDemo: true },
      { title: 'استراتيجية المحتوى Q2', status: 'completed', priority: 'high', projectId: projects[2]._id, customerId: customers[2]._id, currentAssigneeId: employees[3]._id, completedAt: new Date(), efficiencyScore: 85, isDemo: true },
      { title: 'إدارة إعلانات Meta', status: 'in_progress', priority: 'high', projectId: projects[2]._id, customerId: customers[2]._id, currentAssigneeId: employees[0]._id, dueDate: new Date(Date.now() + 3 * 86400000), isDemo: true },
      { title: 'تصوير منتجات رمضان', status: 'on_hold', priority: 'medium', projectId: projects[3]._id, customerId: customers[3]._id, currentAssigneeId: employees[1]._id, isDemo: true },
    ]
    await Task.insertMany(taskData)

    // Create demo invoices
    const invoiceData = [
      { invoiceNumber: 'INV-0001', customerId: customers[0]._id, projectId: projects[0]._id, subtotalOriginal: 15000, subtotalBase: 15000, currency: 'SAR', exchangeRateToBase: 1, taxRate: 15, taxAmountOriginal: 2250, taxAmountBase: 2250, amountBase: 17250, paidAmountBase: 17250, remainingAmountBase: 0, status: 'paid', issueDate: new Date('2025-01-01'), dueDate: new Date('2025-01-15'), isDemo: true },
      { invoiceNumber: 'INV-0002', customerId: customers[2]._id, projectId: projects[2]._id, subtotalOriginal: 22000, subtotalBase: 22000, currency: 'SAR', exchangeRateToBase: 1, taxRate: 15, taxAmountOriginal: 3300, taxAmountBase: 3300, amountBase: 25300, paidAmountBase: 0, remainingAmountBase: 25300, status: 'issued', issueDate: new Date('2025-03-01'), dueDate: new Date('2025-03-15'), isDemo: true },
      { invoiceNumber: 'INV-0003', customerId: customers[1]._id, projectId: projects[1]._id, subtotalOriginal: 8000, subtotalBase: 8000, currency: 'SAR', exchangeRateToBase: 1, taxRate: 15, taxAmountOriginal: 1200, taxAmountBase: 1200, amountBase: 9200, paidAmountBase: 4600, remainingAmountBase: 4600, status: 'partially_paid', issueDate: new Date('2025-02-01'), dueDate: new Date('2025-02-20'), isDemo: true },
    ]
    await Invoice.insertMany(invoiceData)

    // Create demo expenses
    await Expense.insertMany([
      { description: 'إيجار المكتب - مارس', category: 'إيجار', amount: 8000, amountOriginal: 8000, amountBase: 8000, currency: 'SAR', expenseType: 'single', isDemo: true },
      { description: 'اشتراكات أدوات', category: 'تقنية', amount: 2000, amountOriginal: 2000, amountBase: 2000, currency: 'SAR', expenseType: 'single', isDemo: true },
      { description: 'راتب سارة الشهري', category: 'رواتب', amount: 12000, amountOriginal: 12000, amountBase: 12000, currency: 'SAR', expenseType: 'salary', employeeId: employees[1]._id, isTemplate: true, active: true, salaryStartDate: new Date('2025-01-01'), salaryNextDueDate: new Date('2025-04-01'), isDemo: true },
    ])

    // Generate token for demo login
    const token = signToken(demoUser._id.toString())
    const allPerms = (settings.roles || []).find((r: any) => r.role === 'admin')?.permissions || []

    const res = NextResponse.json({
      success: true,
      message: 'Demo data seeded successfully',
      user: { _id: demoUser._id, email: DEMO_EMAIL, role: 'admin', isActive: true, effectivePermissions: allPerms, isDemo: true },
    })
    res.cookies.set('treeelivine_session', token, cookieOptions())
    return res
  } catch (err: any) {
    console.error('Seed error:', err)
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

import mongoose, { Model } from 'mongoose'

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  category: String,
  amount: { type: Number, default: 0 }, amountOriginal: { type: Number, default: 0 },
  currency: { type: String, default: 'SAR' }, currencyCode: { type: String, default: 'SAR' },
  exchangeRateToBase: { type: Number, default: 1 }, amountBase: { type: Number, default: 0 },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  expenseType: { type: String, enum: ['single','distributed','salary'], default: 'single' },
  recurrenceType: String, startDate: Date, endDate: Date,
  salaryStartDate: Date, salaryNextDueDate: Date, salaryEndDate: Date,
  salaryLastGeneratedMonthKey: String,
  active: { type: Boolean, default: true },
  isTemplate: { type: Boolean, default: false },
  generatedMonthKey: String,
  sourceExpenseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expense' },
  allocationType: String,
  distributionMode: { type: String, enum: ['selected_customers','active_customers'] },
  distributionCustomerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }],
  distributionStartDate: Date, distributionEndDate: Date,
  distributedCustomerCount: Number, perCustomerCost: Number,
  allocations: [{ customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }, amount: Number }],
  isDemo: { type: Boolean, default: false },
}, { timestamps: true })

const Expense: Model<any> = (mongoose.models.Expense as Model<any>) || mongoose.model<any>('Expense', expenseSchema)
export default Expense

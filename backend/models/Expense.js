const mongoose = require('mongoose');

const allocationSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    amount: { type: Number },
  },
  { _id: false }
);

const expenseSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    category: { type: String },
    amount: { type: Number, default: 0 },
    amountOriginal: { type: Number, default: 0 },
    currency: { type: String, default: 'SAR' },
    currencyCode: { type: String, default: 'SAR' },
    exchangeRateToBase: { type: Number, default: 1 },
    amountBase: { type: Number, default: 0 },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    expenseType: { type: String, enum: ['single', 'distributed', 'salary'], default: 'single' },
    recurrenceType: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    // Salary fields
    salaryStartDate: { type: Date },
    salaryNextDueDate: { type: Date },
    salaryEndDate: { type: Date },
    salaryLastGeneratedMonthKey: { type: String },
    active: { type: Boolean, default: true },
    isTemplate: { type: Boolean, default: false },
    generatedMonthKey: { type: String },
    sourceExpenseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expense' },
    // Distribution fields
    allocationType: { type: String },
    distributionMode: { type: String, enum: ['selected_customers', 'active_customers'] },
    distributionCustomerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }],
    distributionStartDate: { type: Date },
    distributionEndDate: { type: Date },
    distributedCustomerCount: { type: Number },
    perCustomerCost: { type: Number },
    allocations: [allocationSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);

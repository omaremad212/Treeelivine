const mongoose = require('mongoose');

const handoverHistorySchema = new mongoose.Schema(
  {
    fromEmployeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    toEmployeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    note: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const activityLogEntrySchema = new mongoose.Schema(
  {
    action: { type: String },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    details: { type: mongoose.Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    currentAssigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    taskType: { type: String },
    source: { type: String },
    status: {
      type: String,
      enum: [
        'new',
        'assigned',
        'in_progress',
        'ready_for_handover',
        'handed_over',
        'under_review',
        'reopened',
        'completed',
        'cancelled',
        'on_hold',
      ],
      default: 'new',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    reviewRequired: { type: Boolean, default: false },
    reviewStatus: {
      type: String,
      enum: ['not_required', 'pending', 'under_review', 'approved', 'reopened'],
      default: 'not_required',
    },
    blockingTask: { type: Boolean, default: false },
    taskCurrency: { type: String },
    amountOriginal: { type: Number },
    currencyOriginal: { type: String },
    exchangeRateToBase: { type: Number, default: 1 },
    amountBase: { type: Number },
    teamDueOriginal: { type: Number },
    teamDueCurrency: { type: String },
    teamDueExchangeRateToBase: { type: Number, default: 1 },
    teamDueBase: { type: Number },
    teamPaymentStatus: {
      type: String,
      enum: ['not_applicable', 'pending', 'partial', 'paid', 'on_hold'],
      default: 'not_applicable',
    },
    clientPaymentLinked: { type: Boolean, default: false },
    employeeVisible: { type: Boolean, default: true },
    projectProgressImpact: { type: Number, default: 0 },
    workflowStageIndex: { type: Number },
    workflowStageName: { type: String },
    autoSpawnedFromTaskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    dueDate: { type: Date },
    startedAt: { type: Date },
    handoverRequestedAt: { type: Date },
    handedOverAt: { type: Date },
    reviewedAt: { type: Date },
    completedAt: { type: Date },
    reopenedCount: { type: Number, default: 0 },
    actualDeliveryDate: { type: Date },
    efficiencyScore: { type: Number },
    handoverHistory: [handoverHistorySchema],
    activityLog: [activityLogEntrySchema],
    description: { type: String },
    estimatedCost: { type: Number },
    estimatedCostBase: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);

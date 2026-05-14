const mongoose = require('mongoose');

const briefQuestionSnapshotSchema = new mongoose.Schema(
  {
    section: { type: String },
    question: { type: String },
    type: { type: String },
    options: [{ type: String }],
    required: { type: Boolean },
    order: { type: Number },
  },
  { _id: false }
);

const briefCommentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const workflowStageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    taskType: { type: String },
    autoCreateTask: { type: Boolean, default: false },
    adminOnlyIfUnpaid: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
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

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    projectType: {
      type: String,
      enum: ['subscription', 'onetime'],
    },
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
    briefTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
    briefStatus: {
      type: String,
      enum: ['not_started', 'draft', 'submitted', 'reviewing', 'changes_requested', 'approved'],
      default: 'not_started',
    },
    briefQuestionsSnapshot: [briefQuestionSnapshotSchema],
    briefAnswers: { type: Map, of: mongoose.Schema.Types.Mixed },
    briefComments: [briefCommentSchema],
    briefSharedAt: { type: Date },
    briefSubmittedAt: { type: Date },
    briefUpdatedAt: { type: Date },
    workflowMode: {
      type: String,
      enum: ['manual', 'sequential'],
    },
    workflowStages: [workflowStageSchema],
    accountManagerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    assignedEmployeeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
    assignmentStatus: {
      type: String,
      enum: ['unassigned', 'partial', 'ready'],
      default: 'unassigned',
    },
    subscriptionDuration: { type: Number },
    estimatedCost: { type: Number },
    taxRate: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    targetDate: { type: Date },
    actualEndDate: { type: Date },
    status: {
      type: String,
      enum: ['draft', 'active', 'on_hold', 'completed', 'cancelled'],
      default: 'draft',
    },
    requiredSpecializations: [{ type: String }],
    serviceDescription: { type: String },
    billable: { type: Boolean, default: true },
    notes: { type: String },
    onHoldReason: { type: String },
    cancelledReason: { type: String },
    completedAt: { type: Date },
    lastStatusChangeAt: { type: Date },
    readinessScore: { type: Number },
    taskProgressPercent: { type: Number, default: 0 },
    taskCompletionRate: { type: Number, default: 0 },
    openTaskCount: { type: Number, default: 0 },
    completedTaskCount: { type: Number, default: 0 },
    overdueTaskCount: { type: Number, default: 0 },
    activityLog: [activityLogEntrySchema],
    archivedAt: { type: Date },
    archivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);

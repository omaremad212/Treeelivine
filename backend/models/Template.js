const mongoose = require('mongoose');

const briefQuestionSchema = new mongoose.Schema(
  {
    section: { type: String },
    question: { type: String, required: true },
    type: {
      type: String,
      enum: ['text', 'textarea', 'select', 'multi_select', 'boolean', 'date', 'number'],
      default: 'text',
    },
    options: [{ type: String }],
    required: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const workflowStageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    taskType: { type: String },
    autoCreateTask: { type: Boolean, default: false },
    adminOnlyIfUnpaid: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const templateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    kind: {
      type: String,
      enum: ['workflow', 'project', 'assignment_rule', 'stage', 'brief'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    serviceType: { type: String },
    projectType: { type: String },
    workflowMode: {
      type: String,
      enum: ['manual', 'sequential'],
    },
    description: { type: String },
    workflowStages: [workflowStageSchema],
    briefQuestions: [briefQuestionSchema],
    requiredSpecializations: [{ type: String }],
    industryPreferences: [{ type: String }],
    tags: [{ type: String }],
    billable: { type: Boolean },
    subscriptionDuration: { type: Number },
    estimatedCost: { type: Number },
    assignmentRule: {
      specialtyWeight: { type: Number, default: 1 },
      industryWeight: { type: Number, default: 1 },
      availabilityWeight: { type: Number, default: 1 },
      workloadWeight: { type: Number, default: 1 },
      maxWorkloadTasks: { type: Number, default: 10 },
      excludeInactive: { type: Boolean, default: true },
      excludeOnLeave: { type: Boolean, default: true },
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Template', templateSchema);

import mongoose, { Model } from 'mongoose'

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: String,
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  projectType: { type: String, enum: ['subscription', 'onetime'], default: 'onetime' },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
  brief: String,
  briefStatus: {
    type: String,
    enum: ['not_started', 'draft', 'pending', 'submitted', 'reviewing', 'changes_requested', 'approved', 'rejected'],
    default: 'not_started',
  },
  briefApprovedAt: Date,
  briefApprovedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  briefComments: [{
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    authorName: String,
    text: String,
    createdAt: { type: Date, default: Date.now },
  }],
  workflowMode: { type: String, enum: ['manual', 'sequential'], default: 'manual' },
  accountManagerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  assignedEmployeeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
  status: {
    type: String,
    enum: ['planning', 'draft', 'active', 'on_hold', 'completed', 'cancelled'],
    default: 'planning',
  },
  dueDate: Date, startDate: Date, endDate: Date, completedAt: Date,
  notes: String,
  taskProgressPercent: { type: Number, default: 0 },
  activityLog: [{ action: String, performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, details: mongoose.Schema.Types.Mixed, timestamp: { type: Date, default: Date.now } }],
  archivedAt: Date,
  isDemo: { type: Boolean, default: false },
}, { timestamps: true })

const Project: Model<any> = (mongoose.models.Project as Model<any>) || mongoose.model<any>('Project', projectSchema)
export default Project

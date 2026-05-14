import mongoose, { Model } from 'mongoose'

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  currentAssigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  taskType: String, source: String,
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'in_review', 'completed', 'cancelled', 'on_hold', 'new', 'assigned', 'ready_for_handover', 'handed_over', 'under_review', 'reopened'],
    default: 'pending',
  },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  reviewRequired: { type: Boolean, default: false },
  blockingTask: { type: Boolean, default: false },
  dueDate: Date, startedAt: Date, completedAt: Date,
  history: [{ action: String, by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, from: mongoose.Schema.Types.Mixed, to: mongoose.Schema.Types.Mixed, note: String, at: Date }],
  handoverHistory: [{ fromEmployeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }, toEmployeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }, note: String, timestamp: { type: Date, default: Date.now } }],
  activityLog: [{ action: String, performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, details: mongoose.Schema.Types.Mixed, timestamp: { type: Date, default: Date.now } }],
  description: String,
  isDemo: { type: Boolean, default: false },
}, { timestamps: true })

const Task: Model<any> = (mongoose.models.Task as Model<any>) || mongoose.model<any>('Task', taskSchema)
export default Task

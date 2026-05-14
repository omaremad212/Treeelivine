import mongoose, { Model } from 'mongoose'

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  kind: { type: String, enum: ['workflow','project','assignment_rule','stage','brief'], required: true },
  status: { type: String, enum: ['active','inactive'], default: 'active' },
  serviceType: String, projectType: String,
  workflowMode: { type: String, enum: ['manual','sequential'] },
  description: String,
  workflowStages: [{ name: String, taskType: String, autoCreateTask: Boolean, adminOnlyIfUnpaid: Boolean, order: Number }],
  briefQuestions: [{ section: String, question: String, type: { type: String, enum: ['text','textarea','select','multi_select','boolean','date','number'] }, options: [String], required: Boolean, order: Number }],
  requiredSpecializations: [String], industryPreferences: [String], tags: [String],
  billable: Boolean, subscriptionDuration: String, estimatedCost: Number,
  assignmentRule: {
    specialtyWeight: Number, industryWeight: Number, availabilityWeight: Number, workloadWeight: Number,
    maxWorkloadTasks: Number, excludeInactive: Boolean, excludeOnLeave: Boolean,
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

const Template: Model<any> = (mongoose.models.Template as Model<any>) || mongoose.model<any>('Template', templateSchema)
export default Template

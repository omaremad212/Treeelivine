import mongoose, { Model } from 'mongoose'

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: String, email: String, code: String,
  skills: [String], specializations: [String],
  internalRole: { type: String, enum: ['account_manager','task_member'], default: 'task_member' },
  industryPreferences: [String],
  availabilityStatus: { type: String, enum: ['available','busy','unavailable'], default: 'available' },
  onLeave: { type: Boolean, default: false },
  assignmentPreferenceNotes: String,
  isActive: { type: Boolean, default: true },
  socialLinks: { linkedin: String, github: String, twitter: String },
  profileLockedAt: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDemo: { type: Boolean, default: false },
}, { timestamps: true })

const Employee: Model<any> = (mongoose.models.Employee as Model<any>) || mongoose.model<any>('Employee', employeeSchema)
export default Employee

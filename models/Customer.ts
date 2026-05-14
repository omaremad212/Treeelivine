import mongoose, { Model } from 'mongoose'

const activitySchema = new mongoose.Schema(
  { action: String, performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, details: mongoose.Schema.Types.Mixed, timestamp: { type: Date, default: Date.now } },
  { _id: false }
)

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  company: { type: String, trim: true },
  phone: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  status: { type: String, enum: ['prospect','qualified','negotiation','active','inactive','suspended','lost'], default: 'prospect' },
  code: String, source: String, score: { type: Number, default: 0 },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  service: String, budget: Number, nextAction: String,
  followUpDate: Date, followUpType: String,
  priority: { type: String, enum: ['low','medium','high','urgent'], default: 'medium' },
  lastContactAt: Date, lastStatusChangeAt: Date,
  archivedAt: Date, archivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lostReason: String,
  tags: [String],
  socialLinks: { website: String, linkedin: String, instagram: String, twitter: String, facebook: String },
  referralType: String, referralId: mongoose.Schema.Types.ObjectId,
  notes: String,
  activityLog: [activitySchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDemo: { type: Boolean, default: false },
}, { timestamps: true })

const Customer: Model<any> = (mongoose.models.Customer as Model<any>) || mongoose.model<any>('Customer', customerSchema)
export default Customer

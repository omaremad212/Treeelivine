const mongoose = require('mongoose');

const activityLogEntrySchema = new mongoose.Schema(
  {
    action: { type: String },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    details: { type: mongoose.Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    status: {
      type: String,
      enum: ['prospect', 'qualified', 'negotiation', 'active', 'inactive', 'suspended', 'lost'],
      default: 'prospect',
    },
    code: { type: String, trim: true },
    source: { type: String, trim: true },
    score: { type: Number, default: 0 },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    service: { type: String, trim: true },
    budget: { type: Number },
    nextAction: { type: String, trim: true },
    followUpDate: { type: Date },
    followUpType: { type: String, trim: true },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    lastContactAt: { type: Date },
    lastStatusChangeAt: { type: Date },
    archivedAt: { type: Date },
    archivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lostReason: { type: String, trim: true },
    tags: [{ type: String }],
    socialLinks: {
      website: { type: String },
      linkedin: { type: String },
      instagram: { type: String },
      twitter: { type: String },
      facebook: { type: String },
    },
    referralType: { type: String },
    referralId: { type: mongoose.Schema.Types.ObjectId },
    notes: { type: String },
    activityLog: [activityLogEntrySchema],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);

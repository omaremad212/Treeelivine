const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    code: { type: String, trim: true },
    skills: [{ type: String }],
    specializations: [{ type: String }],
    internalRole: {
      type: String,
      enum: ['account_manager', 'task_member'],
    },
    industryPreferences: [{ type: String }],
    availabilityStatus: {
      type: String,
      enum: ['available', 'busy', 'unavailable'],
      default: 'available',
    },
    onLeave: { type: Boolean, default: false },
    assignmentPreferenceNotes: { type: String },
    isActive: { type: Boolean, default: true },
    socialLinks: {
      linkedin: { type: String },
      github: { type: String },
      twitter: { type: String },
    },
    profileLockedAt: { type: Date },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);

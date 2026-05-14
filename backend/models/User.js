const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'manager', 'team', 'finance', 'viewer', 'client'],
      required: true,
    },
    isActive: { type: Boolean, default: true },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'roleRef',
    },
    roleRef: {
      type: String,
      enum: ['Employee', 'Customer'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

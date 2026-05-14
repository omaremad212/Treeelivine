import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUser extends Document {
  email: string
  password: string
  name?: string
  role: 'admin' | 'manager' | 'team' | 'finance' | 'viewer' | 'client'
  isActive: boolean
  referenceId?: mongoose.Types.ObjectId
  roleRef?: 'Employee' | 'Customer'
  effectivePermissions?: string[]
  isDemo: boolean
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: String,
  role: { type: String, enum: ['admin', 'manager', 'team', 'finance', 'viewer', 'client'], required: true },
  isActive: { type: Boolean, default: true },
  referenceId: { type: Schema.Types.ObjectId, refPath: 'roleRef' },
  roleRef: { type: String, enum: ['Employee', 'Customer'] },
  effectivePermissions: { type: [String], default: [] },
  isDemo: { type: Boolean, default: false },
}, { timestamps: true })

const User: Model<IUser> = mongoose.models.User as Model<IUser> || mongoose.model<IUser>('User', userSchema)
export default User

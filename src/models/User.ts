import { model, Schema } from 'mongoose'

export interface UserRecord {
  name: string
  email: string
  passwordHash: string
  role: 'student' | 'vendor_admin'
  isActive: boolean
}

const userSchema = new Schema<UserRecord>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['student', 'vendor_admin'], default: 'student', required: true },
    isActive: { type: Boolean, default: true, required: true },
  },
  { timestamps: true },
)

export const UserModel = model<UserRecord>('User', userSchema)

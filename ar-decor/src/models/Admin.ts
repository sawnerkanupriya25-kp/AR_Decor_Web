import mongoose, { Schema, model, models } from 'mongoose';

export interface IAdmin extends mongoose.Document {
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  createdAt: Date;
}

const AdminSchema = new Schema<IAdmin>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'admin' },
}, { timestamps: true });

export const Admin = models.Admin || model<IAdmin>('Admin', AdminSchema);

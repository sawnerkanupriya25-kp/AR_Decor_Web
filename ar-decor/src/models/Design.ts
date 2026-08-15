import mongoose, { Schema, model, models } from 'mongoose';

export interface IDesign extends mongoose.Document {
  categoryId: string;
  title: string;
  description: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  thumbnailUrl: string;
  featured: boolean;
  sortOrder: number;
  active: boolean;
}

const DesignSchema = new Schema<IDesign>({
  categoryId: { type: String, required: true, ref: 'Category' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
  mediaUrl: { type: String, required: true },
  thumbnailUrl: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export const Design = models.Design || model<IDesign>('Design', DesignSchema);

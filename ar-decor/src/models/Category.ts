import mongoose, { Schema, model, models } from 'mongoose';

export interface ICategory extends mongoose.Document {
  sectionId: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  sortOrder: number;
  active: boolean;
}

const CategorySchema = new Schema<ICategory>({
  sectionId: { type: String, required: true, ref: 'Section' },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  sortOrder: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

// Create compound index for unique slug per section
CategorySchema.index({ sectionId: 1, slug: 1 }, { unique: true });

export const Category = models.Category || model<ICategory>('Category', CategorySchema);

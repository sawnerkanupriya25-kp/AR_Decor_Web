import mongoose, { Schema, model, models } from 'mongoose';

export interface ISection extends mongoose.Document {
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  sortOrder: number;
  active: boolean;
}

const SectionSchema = new Schema<ISection>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  sortOrder: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export const Section = models.Section || model<ISection>('Section', SectionSchema);

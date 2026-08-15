import mongoose, { Schema, model, models } from 'mongoose';

export interface IEnquiry extends mongoose.Document {
  name: string;
  phone: string;
  categoryId?: string;
  designId?: string;
  eventDate?: string;
  eventTime?: string;
  location?: string;
  message: string;
  status: 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled';
  adminNotes: string;
}

const EnquirySchema = new Schema<IEnquiry>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  categoryId: { type: String, ref: 'Category' },
  designId: { type: String, ref: 'Design' },
  eventDate: { type: String },
  eventTime: { type: String },
  location: { type: String },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['new', 'contacted', 'confirmed', 'completed', 'cancelled'],
    default: 'new'
  },
  adminNotes: { type: String, default: '' },
}, { timestamps: true });

export const Enquiry = models.Enquiry || model<IEnquiry>('Enquiry', EnquirySchema);

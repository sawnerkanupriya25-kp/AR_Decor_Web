import mongoose, { Schema, model, models } from 'mongoose';

export interface IWebsiteSettings extends mongoose.Document {
  key: string;
  value: string;
}

const WebsiteSettingsSchema = new Schema<IWebsiteSettings>({
  key: { type: String, required: true, unique: true },
  value: { type: String, default: '' },
}, { timestamps: true });

export const WebsiteSettings = models.WebsiteSettings || model<IWebsiteSettings>('WebsiteSettings', WebsiteSettingsSchema);

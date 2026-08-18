import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

// Schema Definition
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: String,
  section: { type: String, default: 'Balloon Decor' },
  description: String,
  active: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

// Database Connection & Model
let Category: any;
try {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }
  Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
} catch (error) {
  console.error("DB Connection Error:", error);
}

// GET: Fetch all categories
export async function GET() {
  try {
    const categories = await Category.find().sort({ sortOrder: 1, createdAt: -1 });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST: Create new category
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newCat = await Category.create(body);
    return NextResponse.json(newCat, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
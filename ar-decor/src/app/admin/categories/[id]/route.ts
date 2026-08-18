import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

const CategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  section: String,
  description: String,
  active: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

let Category: any;

try {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }
  Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
} catch (error) {
  console.error("DB Connection Error:", error);
}

// GET single category by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

// PUT (Update) category by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const updated = await Category.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE category by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await Category.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Category } from '@/models/Category';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const sectionId = searchParams.get('sectionId');
    const slug = searchParams.get('slug');
    
    let query: any = { active: true };
    
    if (sectionId) {
      query.sectionId = sectionId;
    }
    
    if (slug) {
      query.slug = slug;
    }
    
    const categories = await Category.find(query).sort({ sortOrder: 1 });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

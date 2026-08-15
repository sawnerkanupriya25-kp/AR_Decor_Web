import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Design } from '@/models/Design';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    const featured = searchParams.get('featured');
    
    let query: any = { active: true };
    
    if (categoryId) {
      query.categoryId = categoryId;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    const designs = await Design.find(query).sort({ sortOrder: 1 });
    return NextResponse.json(designs);
  } catch (error) {
    console.error('Error fetching designs:', error);
    return NextResponse.json({ error: 'Failed to fetch designs' }, { status: 500 });
  }
}

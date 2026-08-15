import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { WebsiteSettings } from '@/models/WebsiteSettings';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    
    const updates = Array.isArray(body) ? body : [body];
    
    for (const { key, value } of updates) {
      if (key) {
        await WebsiteSettings.findOneAndUpdate(
          { key },
          { key, value },
          { upsert: true, new: true }
        );
      }
    }
    
    const settings = await WebsiteSettings.find();
    const settingsObj: any = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.value;
    });
    
    return NextResponse.json(settingsObj);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

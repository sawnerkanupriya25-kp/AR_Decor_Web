import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Admin } from '@/models/Admin';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'ardecor@admin' });
    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Admin already exists' },
        { status: 200 }
      );
    }

    // Hash the password
    const passwordHash = await bcrypt.hash('Aman@Kanu', 10);
    
    // Create the admin user
    await Admin.create({
      name: 'AR Decor Admin',
      email: 'ardecor@admin',
      passwordHash,
      role: 'admin',
    });

    return NextResponse.json(
      { message: 'Admin created successfully', email: 'ardecor@admin' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: 'Failed to create admin' },
      { status: 500 }
    );
  }
}

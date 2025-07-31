import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import dbConnect from '@/lib/db';
import { User } from '@/lib/models/User';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { gender, dateOfBirth, role } = await req.json();

    if (!gender || !dateOfBirth || !role) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user with additional information
    user.gender = gender;
    user.dateOfBirth = new Date(dateOfBirth);
    user.role = role;
    user.profileCompleted = true;
    
    await user.save();

    return NextResponse.json({ 
      message: 'Profile completed successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        role: user.role,
        profileCompleted: user.profileCompleted
      }
    });
  } catch (error) {
    console.error('Error completing profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/auth';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession(req);
    if (!session || (session.role !== 'manager' && session.role !== 'superadmin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    await connectToDatabase();

    const userToDelete = await User.findById(id);
    if (!userToDelete) {
       return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Manager cannot delete manager or superadmin
    if (session.role === 'manager' && userToDelete.role !== 'personnel') {
       return NextResponse.json({ error: 'Forbidden to delete this user' }, { status: 403 });
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession(req);
    if (!session || (session.role !== 'manager' && session.role !== 'superadmin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const { password, isTwoFactorEnabled, name, email, role, reset2FA } = await req.json();

    await connectToDatabase();
    const user = await User.findById(id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Manager cannot edit manager or superadmin
    if (session.role === 'manager' && user.role !== 'personnel') {
       return NextResponse.json({ error: 'Forbidden to edit this user' }, { status: 403 });
    }

    // Process general info updates
    if (name) user.name = name;
    if (email && email !== user.email) {
      // check if email is taken
      const existing = await User.findOne({ email });
      if (existing) return NextResponse.json({ error: 'Bu e-posta adresi zaten kullanılıyor.' }, { status: 400 });
      user.email = email;
    }
    
    // Process role update
    if (role && session.role === 'superadmin') {
      if (role === 'manager' || role === 'personnel') {
        user.role = role;
      }
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      user.passwordHash = hash;
    }

    if (isTwoFactorEnabled !== undefined && session.role === 'superadmin') {
      user.isTwoFactorEnabled = isTwoFactorEnabled;
    }

    if (reset2FA && session.role === 'superadmin') {
      user.twoFactorSecret = '';
    }

    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

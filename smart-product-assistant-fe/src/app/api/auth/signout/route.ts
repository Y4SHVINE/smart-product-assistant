import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/utils/supabase';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient(request);

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Sign out error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 400 }
      );
    }

    return NextResponse.json({ message: 'Signed out successfully' });
  } catch (error) {
    console.error('Unexpected error during sign out:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 
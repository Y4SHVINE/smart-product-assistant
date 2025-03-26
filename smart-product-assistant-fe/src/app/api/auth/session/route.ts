import { getSupabaseServerClient } from '@/utils/supabase';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = getSupabaseServerClient(request);

  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Error getting session:', error);
    return NextResponse.json({ error: 'Failed to get session' }, { status: 500 });
  }

  return NextResponse.json({ session });
} 
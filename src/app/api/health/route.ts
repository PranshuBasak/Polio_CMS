import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabaseAdmin = createAdminClient();
    // Update the last_ping timestamp for the record with id 1
    const { data, error } = await supabaseAdmin
      .from('health_check')
      .update({ last_ping: new Date().toISOString() })
      .eq('id', 1)
      .select();

    if (error) {
      console.error('Health check error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'ok', data });
  } catch (error) {
    console.error('Health check unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST() {
  return GET();
}

import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

// Vercel Cron endpoint (schedule lives in vercel.json — daily, 07:00 UTC).
// Supabase pauses free-plan projects after about a week without database
// activity, which would take down the CMS content and the donations backend.
// A trivial daily query keeps the project awake. Deliberately independent of
// the recurring-reminders cron: if that route ever fails before its query,
// this one still counts as activity.
//
// Same CRON_SECRET gate as the other cron route — not because this does
// anything sensitive, but so the endpoint can't be hammered by strangers.
export async function GET(request: Request): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();
    // head:true fetches no rows — the cheapest query that still counts as activity.
    const [content, donations] = await Promise.all([
      supabase.from('site_content').select('page', { count: 'exact', head: true }),
      supabase.from('donations').select('id', { count: 'exact', head: true }),
    ]);

    if (content.error || donations.error) {
      console.error('Keep-alive query failed:', content.error ?? donations.error);
      return NextResponse.json({ success: false, error: 'query_failed' }, { status: 500 });
    }

    console.log('Supabase keep-alive ping:', {
      siteContentRows: content.count,
      donationRows: donations.count,
    });
    return NextResponse.json({
      success: true,
      siteContentRows: content.count,
      donationRows: donations.count,
    });
  } catch (err) {
    console.error('Keep-alive failed:', err);
    return NextResponse.json({ success: false, error: 'server_error' }, { status: 500 });
  }
}

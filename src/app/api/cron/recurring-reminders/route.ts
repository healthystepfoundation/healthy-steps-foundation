import { NextResponse } from 'next/server';
import { runDueRecurringReminders } from '@/lib/reminders';

// Vercel Cron endpoint (schedule lives in vercel.json — daily, 06:00 UTC).
// Emails recurring donors a reminder, since SWIFT/check giving is manual.
// Vercel sends `Authorization: Bearer ${CRON_SECRET}` with each invocation
// when the CRON_SECRET env var is set on the project; this route refuses to
// run without a matching header because it sends real email to donors.
export const maxDuration = 60;

export async function GET(request: Request): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 });
  }

  try {
    const summary = await runDueRecurringReminders();
    console.log('Recurring reminders run:', summary);
    return NextResponse.json({ success: true, summary });
  } catch (err) {
    console.error('Failed to run recurring reminders:', err);
    return NextResponse.json({ success: false, error: 'server_error' }, { status: 500 });
  }
}

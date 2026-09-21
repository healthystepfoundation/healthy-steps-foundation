import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-auth';
import { getSupabaseAdmin, mapDonationRow, type DonationRow } from '@/lib/supabase';
import { renderDonationReceiptPdf } from '@/lib/pdf/donation-receipt';
import { sendPaymentReceivedEmail } from '@/lib/email';

const updateSchema = z.object({ status: z.literal('received') });

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  // Defense in depth: middleware already gates /api/admin/*, but re-check here too.
  const cookieHeader = request.headers.get('cookie') ?? '';
  const token = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${ADMIN_SESSION_COOKIE}=`))
    ?.split('=')[1];

  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'invalid_json' }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'validation' }, { status: 400 });
  }

  const { data: row, error } = await getSupabaseAdmin()
    .from('donations')
    .update({ status: 'received', received_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error || !row) {
    console.error('Failed to mark donation received:', error);
    return NextResponse.json({ success: false, error: 'server_error' }, { status: 500 });
  }

  // Best-effort: the status update already succeeded, so an email failure
  // shouldn't fail this request — same pattern as the initial pledge email.
  let emailStatus: 'sent' | 'failed' = 'failed';
  try {
    const record = mapDonationRow(row as DonationRow);
    const receiptPdf = await renderDonationReceiptPdf(record);
    const emailResult = await sendPaymentReceivedEmail(record, receiptPdf);
    emailStatus = emailResult.ok ? 'sent' : 'failed';
    if (!emailResult.ok) {
      console.error('Failed to send donation receipt email:', emailResult.error);
    }
  } catch (err) {
    console.error('Failed to send donation receipt email:', err);
  }

  return NextResponse.json({ success: true, emailStatus });
}

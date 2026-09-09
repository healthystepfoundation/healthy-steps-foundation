// Recurring-reminder engine, called from two route handlers: the admin "run
// now" endpoint (api/admin/reminders/run) and the daily Vercel Cron endpoint
// (api/cron/recurring-reminders — schedule in vercel.json). It builds its own
// Supabase/Resend clients with lazy env-var checks so importing it never
// throws at module-load time, only when a run actually starts.
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { mapDonationRow, type DonationRow } from './donation-row';
import { ORG, FUND_LABELS } from './constants';
import { formatCurrency } from './utils';
import type { DonationRecord, RecurringFrequency } from '../types';

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  }
  return createClient(url, serviceRoleKey, { auth: { persistSession: false } });
}

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('Missing RESEND_API_KEY environment variable');
  return new Resend(apiKey);
}

async function sendReminderEmail(record: DonationRecord): Promise<{ ok: boolean; error?: string }> {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) return { ok: false, error: 'Missing RESEND_FROM_EMAIL environment variable' };

  const fundLabel = FUND_LABELS[record.fund] ?? record.fund;

  try {
    const { error } = await getResend().emails.send({
      from,
      to: record.email,
      replyTo: ORG.email,
      subject: `Reminder: your ${record.recurringFrequency ?? 'recurring'} gift to ${ORG.name} is due`,
      html: `
        <p>Dear ${record.firstName},</p>
        <p>This is a friendly reminder that your ${record.recurringFrequency} recurring gift of
        ${formatCurrency(record.totalAmount)} to the ${fundLabel} fund is due. Since
        ${record.method === 'swift' ? 'SWIFT transfers are' : 'check giving is'} manual, please
        repeat your transfer using the instructions from your original pledge confirmation
        (invoice #${record.invoiceNumber}).</p>
        <p>If you'd like to stop these reminders, just reply and let us know.</p>
        <p>With gratitude,<br />${ORG.name}</p>
      `,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// Rolls forward from the due date itself (not "today") so a late-running job
// doesn't drift the schedule forward.
export function computeNextReminderDate(dueDate: Date, frequency: RecurringFrequency): Date {
  const next = new Date(dueDate);
  if (frequency === 'monthly') next.setMonth(next.getMonth() + 1);
  else if (frequency === 'quarterly') next.setMonth(next.getMonth() + 3);
  else next.setFullYear(next.getFullYear() + 1);
  return next;
}

export async function getDueRecurringDonations(): Promise<DonationRecord[]> {
  const supabase = getSupabase();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .eq('donation_type', 'recurring')
    .eq('is_active', true)
    .lte('next_reminder_date', today);

  if (error) throw new Error(`Failed to fetch due recurring donations: ${error.message}`);
  return (data as DonationRow[]).map(mapDonationRow);
}

export interface ReminderRunSummary {
  checked: number;
  sent: number;
  failed: number;
}

export async function runDueRecurringReminders(): Promise<ReminderRunSummary> {
  const supabase = getSupabase();
  const due = await getDueRecurringDonations();

  let sent = 0;
  let failed = 0;

  for (const record of due) {
    const result = await sendReminderEmail(record);
    const dueDate = record.nextReminderDate ? new Date(record.nextReminderDate) : new Date();
    const nextReminderDate = record.recurringFrequency
      ? computeNextReminderDate(dueDate, record.recurringFrequency)
      : null;

    if (result.ok) sent += 1;
    else failed += 1;

    await supabase
      .from('donations')
      .update({
        last_reminder_sent_at: new Date().toISOString(),
        next_reminder_date: nextReminderDate ? nextReminderDate.toISOString().slice(0, 10) : null,
      })
      .eq('id', record.id);
  }

  return { checked: due.length, sent, failed };
}

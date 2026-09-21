import 'server-only';
import { Resend } from 'resend';
import { ORG } from '@/lib/constants';
import type { DonationRecord } from '@/types';

let client: Resend | null = null;

function getResend(): Resend {
  if (client) return client;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('Missing RESEND_API_KEY environment variable');
  client = new Resend(apiKey);
  return client;
}

function getFromAddress(): string {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) throw new Error('Missing RESEND_FROM_EMAIL environment variable');
  return from;
}

interface EmailResult {
  ok: boolean;
  error?: string;
}

/** Shared branded shell so both donor emails read as one organization. */
function emailShell(body: string): string {
  return `
    <div style="margin:0;padding:24px;background-color:#f5f5f4;font-family:Georgia,'Times New Roman',serif;">
      <div style="max-width:560px;margin:0 auto;background-color:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e7e5e4;">
        <div style="background-color:#14532d;padding:20px 32px;">
          <p style="margin:0;color:#ffffff;font-size:18px;font-weight:bold;letter-spacing:0.5px;">${ORG.name}</p>
          <p style="margin:2px 0 0;color:#bbf7d0;font-size:12px;">A path to mental wellness</p>
        </div>
        <div style="padding:28px 32px;color:#292524;font-size:15px;line-height:1.6;">
          ${body}
        </div>
        <div style="padding:16px 32px;border-top:1px solid #e7e5e4;background-color:#fafaf9;">
          <p style="margin:0;color:#78716c;font-size:12px;line-height:1.5;">
            ${ORG.name} · ${ORG.location.village}, ${ORG.location.district}, ${ORG.location.country}<br />
            ${ORG.email} · ${ORG.phone.join(' / ')}
          </p>
        </div>
      </div>
    </div>
  `;
}

export async function sendDonationPledgeEmail(
  record: DonationRecord,
  pdfBuffer: Buffer,
): Promise<EmailResult> {
  try {
    const { error } = await getResend().emails.send({
      from: getFromAddress(),
      to: record.email,
      replyTo: ORG.email,
      subject: `Thank You! Your Donation Pledge Is Confirmed #${record.invoiceNumber}`,
      html: emailShell(`
        <h1 style="margin:0 0 16px;font-size:22px;letter-spacing:0.5px;color:#14532d;">Thank you, ${record.firstName}!</h1>
        <p>Your donation pledge to ${ORG.name} has been recorded.</p>
        <p>Your pledge confirmation (invoice #${record.invoiceNumber}) is attached as a PDF,
        along with instructions for completing your
        ${record.method === 'swift' ? 'SWIFT bank transfer' : 'check donation'}.</p>
        <p><strong>Please note:</strong> this confirms your pledge only. It is not a receipt of
        funds received, since ${record.method === 'swift' ? 'SWIFT transfers are' : 'checks are'}
        processed manually, not in real time. Once your
        ${record.method === 'swift' ? 'bank transfer' : 'check'} is complete, please reply to this
        email or write to ${ORG.email} with proof of payment, referencing invoice
        #${record.invoiceNumber}. Your official donation receipt will follow in a separate email
        once we've confirmed your gift has arrived.</p>
        <p>With gratitude,<br />${ORG.name}</p>
      `),
      attachments: [
        {
          filename: `${record.invoiceNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// Sent once staff confirm the transfer/check actually arrived (admin "Mark
// received" action). Carries the official donation receipt PDF — the pledge
// email deliberately does not, since no funds had moved yet.
export async function sendPaymentReceivedEmail(
  record: DonationRecord,
  receiptPdf: Buffer,
): Promise<EmailResult> {
  try {
    const { error } = await getResend().emails.send({
      from: getFromAddress(),
      to: record.email,
      replyTo: ORG.email,
      subject: `Your Donation Receipt from ${ORG.name} #${record.invoiceNumber}`,
      html: emailShell(`
        <h1 style="margin:0 0 16px;font-size:22px;letter-spacing:0.5px;color:#14532d;">Thank you, ${record.firstName}!</h1>
        <p>We're delighted to confirm that your donation has been received. Your official
        donation receipt (receipt no. ${record.invoiceNumber}) is attached as a PDF for your
        records.</p>
        <p>Thank you for partnering with ${ORG.name} to walk alongside families in Wakiso,
        Uganda. Your gift is already at work.</p>
        <p>With gratitude,<br />${ORG.name}</p>
      `),
      attachments: [
        {
          filename: `Donation-Receipt-${record.invoiceNumber}.pdf`,
          content: receiptPdf,
        },
      ],
    });

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// Pure mapper between the Postgres `donations` row shape (snake_case) and the
// app's DonationRecord type (camelCase). Shared by supabase.ts and reminders.ts.
import type { DonationRecord } from '../types';

export interface DonationRow {
  id: string;
  serial_number: number;
  created_at: string;
  invoice_number: string;
  method: DonationRecord['method'];
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  country: string;
  donation_type: DonationRecord['donationType'];
  recurring_frequency: DonationRecord['recurringFrequency'];
  amount: number;
  fund: DonationRecord['fund'];
  cover_bank_fee: boolean;
  bank_fee: number;
  total_amount: number;
  status: DonationRecord['status'];
  received_at: string | null;
  is_active: boolean;
  next_reminder_date: string | null;
  last_reminder_sent_at: string | null;
}

export function mapDonationRow(row: DonationRow): DonationRecord {
  return {
    id: row.id,
    serialNumber: row.serial_number,
    createdAt: row.created_at,
    invoiceNumber: row.invoice_number,
    method: row.method,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    country: row.country,
    donationType: row.donation_type,
    recurringFrequency: row.recurring_frequency,
    amount: Number(row.amount),
    fund: row.fund,
    coverBankFee: row.cover_bank_fee,
    bankFee: Number(row.bank_fee),
    totalAmount: Number(row.total_amount),
    status: row.status,
    receivedAt: row.received_at,
    isActive: row.is_active,
    nextReminderDate: row.next_reminder_date,
    lastReminderSentAt: row.last_reminder_sent_at,
  };
}

export type DonationType = 'one-time' | 'recurring';
export type RecurringFrequency = 'monthly' | 'quarterly' | 'annually';
export type PaymentMethod = 'swift' | 'us-check';
export type DonationStatus = 'pledged' | 'received';
export type DonationFund =
  | 'food-closet'
  | 'clothing-closet'
  | 'children-tuition'
  | 'adult-vocation'
  | 'family-medical'
  | 'resource-materials'
  | 'where-needed-most';

export interface DonationForm {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country: string;
  type: DonationType;
  recurringFrequency?: RecurringFrequency;
  amount: number;
  fund: DonationFund;
  coverBankFee: boolean;
  donationAmount: number;
  bankFee: number;
  totalAmount: number;
}

// A submitted donation pledge as stored in Supabase (snake_case columns mapped to camelCase)
export interface DonationRecord {
  id: string;
  serialNumber: number;
  createdAt: string;
  invoiceNumber: string;
  method: PaymentMethod;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  country: string;
  donationType: DonationType;
  recurringFrequency: RecurringFrequency | null;
  amount: number;
  fund: DonationFund;
  coverBankFee: boolean;
  bankFee: number;
  totalAmount: number;
  status: DonationStatus;
  receivedAt: string | null;
  isActive: boolean;
  nextReminderDate: string | null;
  lastReminderSentAt: string | null;
}

export interface Program {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  icon: string;
  image: string;
  /** Describes what is actually happening in the photo, for screen readers and search. */
  imageAlt: string;
  fund: DonationFund;
  whoWeServe: string;
  /** The sentence in the dark donate band at the bottom of the program page. */
  donateBlurb: string;
  relatedSlugs: string[];
}

/**
 * A program as the site renders it: the structural fields from `PROGRAMS` in
 * constants.ts merged with whatever the content editor has changed.
 *
 * Differs from `Program` in two ways — `description` is a real list of
 * paragraphs (the raw constant packs them into one string with blank lines,
 * which used to render as a single run-on block), and the photo carries its own
 * alt text instead of falling back to the program name.
 */
export interface ProgramView {
  slug: string;
  fund: DonationFund;
  relatedSlugs: string[];
  name: string;
  shortDescription: string;
  description: string[];
  icon: string;
  image: string;
  imageAlt: string;
  whoWeServe: string;
  donateBlurb: string;
  /** Staff removed the donate strip for this program in the content editor. */
  donateStripHidden: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  photo?: string;
  /** Falls back to the person's name when the content editor leaves it blank. */
  photoAlt?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  photo?: string;
  program?: string;
}

export interface NewsUpdate {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  imageAlt?: string;
  body: string[];
  signOff: { name: string; title: string };
}

export interface UpcomingEvent {
  slug: string;
  title: string;
  date: string; // ISO date, e.g. '2026-10-03'
  startTime: string; // 24h, e.g. '10:00'
  endTime: string; // 24h, e.g. '12:00'
  location: string;
  description: string;
}

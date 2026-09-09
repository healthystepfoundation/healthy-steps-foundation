'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Copy, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { donationSchema, type DonationFormValues } from '@/lib/validations';
import { calculateDonationTotals, formatCurrency, cn } from '@/lib/utils';
import { SWIFT_DETAILS, ORG, FUND_LABELS, BANK_FEE_USD } from '@/lib/constants';
import AmountSelector from './AmountSelector';
import FundSelector from './FundSelector';
import BankFeeCheckbox from './BankFeeCheckbox';
import CurrencyConverter from './CurrencyConverter';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import type { DonationFund } from '@/types';

interface SuccessData {
  firstName: string;
  email: string;
  amount: number;
  fund: string;
  type: string;
  recurringFrequency?: string;
  totalAmount: number;
  coverBankFee: boolean;
  bankFee: number;
  invoiceNumber: string;
  emailStatus: 'sent' | 'failed';
}

// Copy-to-clipboard row used inside the success modal
function SwiftRow({ label, value }: { label: string; value: string }): React.JSX.Element {
  const [copied, setCopied] = useState(false);
  const isPending = value === 'PENDING';

  function handleCopy(): void {
    if (isPending) return;
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-warm-gray-100 last:border-0">
      <span className="text-warm-gray-500 text-sm shrink-0">{label}</span>
      <div className="flex items-center gap-2">
        <span className={cn('text-sm font-medium text-right', isPending ? 'text-error italic' : 'text-warm-gray-900 font-mono')}>
          {value}
        </span>
        {!isPending && (
          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-warm-gray-100 transition-colors text-warm-gray-400 hover:text-forest-green-600"
            aria-label={`Copy ${label}`}
          >
            {copied ? <Check size={14} className="text-forest-green-500" /> : <Copy size={14} />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function DonationForm({
  defaultAmount,
  defaultFund,
  defaultType,
}: {
  defaultAmount?: number;
  defaultFund?: DonationFund;
  defaultType?: 'one-time' | 'recurring';
}): React.JSX.Element {
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      method: 'swift',
      type: defaultType ?? 'one-time',
      amount: defaultAmount ?? 50,
      fund: defaultFund ?? 'where-needed-most',
      coverBankFee: false,
      country: '',
      companyWebsite: '',
    },
  });

  const watchType = watch('type');
  const watchAmount = watch('amount');
  const watchCoverBankFee = watch('coverBankFee');
  const { bankFee, totalAmount } = calculateDonationTotals(watchAmount, watchCoverBankFee);
  const swiftPending = !SWIFT_DETAILS.swiftBicCode;

  async function onSubmit(data: DonationFormValues): Promise<void> {
    setSubmitError(null);
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, method: 'swift' }),
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        setSubmitError("We couldn't process your pledge right now. Please try again or email us directly.");
        return;
      }

      setSuccessData({
        firstName: data.firstName,
        email: data.email,
        amount: data.amount,
        fund: FUND_LABELS[data.fund] ?? data.fund,
        type: data.type,
        recurringFrequency: data.recurringFrequency,
        totalAmount: result.totals.totalAmount,
        coverBankFee: data.coverBankFee,
        bankFee: result.totals.bankFee,
        invoiceNumber: result.invoiceNumber,
        emailStatus: result.emailStatus,
      });
    } catch {
      setSubmitError("We couldn't reach the server. Please check your connection and try again.");
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>

        {/* Honeypot — hidden from real users, bots that autofill every field trip it */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] w-px h-px overflow-hidden"
          {...register('companyWebsite')}
        />

        {/* ── Step 1: Gift Details ────────────────────────────── */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-warm-gray-100">
            <div className="w-7 h-7 rounded-full bg-forest-green-500 text-white text-xs font-bold flex items-center justify-center shrink-0">1</div>
            <h3 className="font-bold text-warm-gray-900">Gift Details</h3>
          </div>

          {/* Donation Type Toggle */}
          <div>
            <p className="text-sm font-medium text-warm-gray-700 mb-3">Donation Type</p>
            <div className="flex gap-3">
              {(['one-time', 'recurring'] as const).map((t) => (
                <label key={t} className="flex-1 cursor-pointer">
                  <input type="radio" value={t} className="sr-only" {...register('type')} />
                  <div className={cn(
                    'py-3 px-4 rounded-xl border-2 text-center font-semibold text-sm transition-all duration-200',
                    watchType === t
                      ? 'border-forest-green-500 bg-forest-green-50 text-forest-green-700 shadow-sm'
                      : 'border-warm-gray-200 text-warm-gray-500 hover:border-warm-gray-300',
                  )}>
                    {t === 'one-time' ? 'One-Time' : 'Recurring'}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Recurring frequency */}
          {watchType === 'recurring' && (
            <div>
              <p className="text-sm font-medium text-warm-gray-700 mb-2">Frequency</p>
              <p className="text-xs text-warm-gray-400 mb-3">
                We&apos;ll remind you by email each period to initiate your transfer.
              </p>
              <div className="flex gap-3">
                {(['monthly', 'quarterly', 'annually'] as const).map((f) => (
                  <label key={f} className="flex-1 cursor-pointer">
                    <input type="radio" value={f} className="sr-only peer" {...register('recurringFrequency')} />
                    <div className={cn(
                      'py-2 px-3 rounded-xl border-2 text-center font-medium text-sm transition-all duration-200 capitalize',
                      'peer-checked:border-forest-green-500 peer-checked:bg-forest-green-50 peer-checked:text-forest-green-700',
                      'border-warm-gray-200 text-warm-gray-500 hover:border-warm-gray-300',
                    )}>
                      {f}
                    </div>
                  </label>
                ))}
              </div>
              {errors.recurringFrequency && (
                <p className="text-sm text-error mt-1">{errors.recurringFrequency.message}</p>
              )}
            </div>
          )}

          {/* Amount */}
          <div>
            <p className="text-sm font-medium text-warm-gray-700 mb-3">Select Amount (USD)</p>
            <AmountSelector
              value={watchAmount}
              onChange={(v) => setValue('amount', v, { shouldValidate: true })}
            />
            {errors.amount && <p className="text-sm text-error mt-1">{errors.amount.message}</p>}
          </div>

          {/* Currency converter */}
          <CurrencyConverter
            usdAmount={watchAmount}
            onUsdChange={(v) => setValue('amount', v, { shouldValidate: true })}
          />

          {/* Fund */}
          <FundSelector
            value={watch('fund')}
            onChange={(f) => setValue('fund', f)}
            error={errors.fund?.message}
          />
        </div>

        {/* ── Step 2: Bank Fee ───────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-warm-gray-100">
            <div className="w-7 h-7 rounded-full bg-forest-green-500 text-white text-xs font-bold flex items-center justify-center shrink-0">2</div>
            <h3 className="font-bold text-warm-gray-900">Bank Transfer Fee</h3>
          </div>
          <BankFeeCheckbox
            checked={watchCoverBankFee}
            onChange={(v) => setValue('coverBankFee', v)}
          />
        </div>

        {/* ── Live Summary ────────────────────────────────────── */}
        <div className="bg-forest-green-50 rounded-xl p-5 border border-forest-green-100 space-y-2 text-sm">
          <p className="font-semibold text-forest-green-900 mb-3">Donation Summary</p>
          <div className="flex justify-between text-warm-gray-600">
            <span>Donation amount</span>
            <span>{formatCurrency(watchAmount)}</span>
          </div>
          {watchCoverBankFee && (
            <div className="flex justify-between text-warm-gray-600">
              <span>Bank transfer fee (covered by you)</span>
              <span>{formatCurrency(bankFee)}</span>
            </div>
          )}
          {!watchCoverBankFee && (
            <div className="flex justify-between text-warm-gray-500">
              <span>Bank fee deducted from gift</span>
              <span>− {formatCurrency(BANK_FEE_USD)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-warm-gray-900 border-t border-forest-green-200 pt-3 text-base">
            <span>Total to transfer</span>
            <span className="text-forest-green-600">{formatCurrency(totalAmount)}</span>
          </div>
          {/* What actually lands in Uganda once the receiving bank takes its cut */}
          {!watchCoverBankFee && (
            <div className="flex justify-between font-semibold text-warm-gray-700">
              <span>Total received is</span>
              <span>{formatCurrency(Math.max(0, watchAmount - BANK_FEE_USD))}</span>
            </div>
          )}
        </div>

        {/* ── Step 3: Your Information ───────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-warm-gray-100">
            <div className="w-7 h-7 rounded-full bg-forest-green-500 text-white text-xs font-bold flex items-center justify-center shrink-0">3</div>
            <h3 className="font-bold text-warm-gray-900">Your Information</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input id="firstName" label="First Name" placeholder="Jane"
              error={errors.firstName?.message} {...register('firstName')} />
            <Input id="lastName" label="Last Name" placeholder="Smith"
              error={errors.lastName?.message} {...register('lastName')} />
          </div>
          <div>
            <Input id="email" type="email" label="Email Address" placeholder="jane@example.com"
              error={errors.email?.message} {...register('email')} />
            <p className="flex items-start gap-1.5 text-xs text-warm-gray-400 mt-1.5">
              <Info size={13} className="shrink-0 mt-0.5" />
              We only use this to send your donation receipt and, for recurring gifts, a reminder
              each period. We will not add you to any marketing list.
            </p>
          </div>
          <Input id="phone" type="tel" label="Phone (optional)" placeholder="+1 234 567 8900"
            {...register('phone')} />
          <Input id="country" label="Country" placeholder="United States"
            error={errors.country?.message} {...register('country')} />
        </div>

        {submitError && (
          <div className="flex items-center gap-2 bg-error/10 text-error text-sm rounded-xl px-4 py-3">
            <AlertCircle size={16} className="shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        <Button type="submit" variant="primary" size="lg" className="w-full text-base" disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : 'Get Transfer Instructions →'}
        </Button>

        <p className="text-xs text-warm-gray-400 text-center">
          By proceeding, you agree to complete a SWIFT bank transfer using the instructions provided.
          No payment is taken through this website.
        </p>
      </form>

      {/* ── Success Modal ──────────────────────────────────────── */}
      <Modal isOpen={!!successData} onClose={() => setSuccessData(null)}>
        {successData && (
          <div className="space-y-6">

            {/* Header */}
            <div className="text-center pt-2">
              <div className="w-16 h-16 bg-forest-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={36} className="text-forest-green-500" />
              </div>
              <h2 className="text-2xl font-bold font-serif text-warm-gray-900 mb-1">
                Thank You, {successData.firstName}!
              </h2>
              <p className="text-warm-gray-500 text-sm">
                Your generosity will make a real difference in Wakiso, Uganda.
              </p>
              <p className="text-xs text-warm-gray-400 mt-2 font-mono">
                Pledge Confirmation #{successData.invoiceNumber}
              </p>
              {successData.emailStatus === 'sent' ? (
                <p className="text-xs text-forest-green-600 mt-1">
                  We&apos;ve emailed a copy of this confirmation to {successData.email}.
                </p>
              ) : (
                <p className="text-xs text-amber-600 mt-1">
                  We couldn&apos;t email your confirmation. Please save these details or contact us at{' '}
                  {ORG.email} referencing invoice #{successData.invoiceNumber}.
                </p>
              )}
            </div>

            {/* Gift summary */}
            <div className="bg-forest-green-50 rounded-xl p-4 border border-forest-green-100 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-warm-gray-500">Fund</span>
                <span className="font-semibold text-warm-gray-900">{successData.fund}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-gray-500">Type</span>
                <span className="font-semibold text-warm-gray-900 capitalize">
                  {successData.type === 'recurring'
                    ? `${successData.recurringFrequency} recurring`
                    : 'One-time gift'}
                </span>
              </div>
              {successData.coverBankFee && (
                <div className="flex justify-between">
                  <span className="text-warm-gray-500">Bank fee covered</span>
                  <span className="font-semibold text-forest-green-600">Yes, 100% reaches families</span>
                </div>
              )}
              <div className="flex justify-between font-bold border-t border-forest-green-200 pt-2 text-base">
                <span className="text-warm-gray-700">Total to transfer</span>
                <span className="text-forest-green-600">{formatCurrency(successData.totalAmount)}</span>
              </div>
            </div>

            {/* SWIFT Details */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-warm-gray-900">Bank Transfer Details</h3>
                {swiftPending && (
                  <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                    <AlertCircle size={13} /> Details pending
                  </span>
                )}
              </div>
              {swiftPending && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3">
                  <p className="text-sm text-amber-700">
                    Our bank details are being finalised. We will email them to you within 24 hours.
                    Please do not transfer yet.
                  </p>
                </div>
              )}
              <div className="bg-warm-gray-50 rounded-xl p-4 border border-warm-gray-100">
                <SwiftRow label="Bank Name" value={SWIFT_DETAILS.bankName || 'PENDING'} />
                <SwiftRow label="Account Holder" value={SWIFT_DETAILS.accountHolder} />
                <SwiftRow label="Account Number (USD)" value={SWIFT_DETAILS.accountNumberUsd || 'PENDING'} />
                <SwiftRow label="Account Number (UGX)" value={SWIFT_DETAILS.accountNumberUgx || 'PENDING'} />
                <SwiftRow label="SWIFT / BIC" value={SWIFT_DETAILS.swiftBicCode || 'PENDING'} />
                <SwiftRow label="Branch" value={SWIFT_DETAILS.branch || 'PENDING'} />
                <SwiftRow label="Branch Address" value={SWIFT_DETAILS.branchAddress || 'PENDING'} />
                <SwiftRow label="Amount (USD)" value={formatCurrency(successData.totalAmount)} />
              </div>
              <p className="text-xs text-warm-gray-400 mt-2 text-center">
                Click the copy icon next to each field to copy it directly.
              </p>
            </div>

            {/* Next Steps */}
            <div>
              <h3 className="font-bold text-warm-gray-900 mb-3">Next Steps</h3>
              <ol className="space-y-3">
                {[
                  { step: '1', text: 'Visit your bank (online or in person) and initiate a SWIFT international transfer using the details above.' },
                  { step: '2', text: <>Email your proof of payment to{' '}<a href={`mailto:${ORG.email}`} className="text-forest-green-600 underline font-medium">{ORG.email}</a>. Include your name and the fund you selected.</> },
                  { step: '3', text: 'We\'ll confirm receipt of your transfer and send a thank-you acknowledgment within 2 business days.' },
                ].map(({ step, text }) => (
                  <li key={step} className="flex gap-3 items-start text-sm">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-forest-green-500 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                      {step}
                    </span>
                    <span className="text-warm-gray-600 leading-relaxed">{text}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Recurring reminder */}
            {successData.type === 'recurring' && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
                <p className="font-semibold mb-1">Recurring Gift Reminder</p>
                <p>
                  Since SWIFT transfers are manual, please set a reminder in your calendar to repeat
                  this transfer {successData.recurringFrequency}. We&apos;ll also send you a reminder email
                  each period.
                </p>
              </div>
            )}

            <Button variant="primary" size="lg" className="w-full" onClick={() => setSuccessData(null)}>
              Done
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
}

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Copy, CheckCircle, Mail, AlertCircle, Info } from 'lucide-react';
import { donationSchema, type DonationFormValues } from '@/lib/validations';
import { cn } from '@/lib/utils';
import { US_CHECK_DETAILS, ORG, FUND_LABELS } from '@/lib/constants';
import AmountSelector from './AmountSelector';
import FundSelector from './FundSelector';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import type { DonateFormCopy } from '@/lib/cms/pages/donate';

interface CheckSuccessData {
  firstName: string;
  email: string;
  amount: number;
  fund: string;
  type: string;
  recurringFrequency?: string;
  invoiceNumber: string;
  emailStatus: 'sent' | 'failed';
}

function CopyRow({ label, value }: { label: string; value: string }): React.JSX.Element {
  const [copied, setCopied] = useState(false);
  const isPending = !value;

  function handleCopy(): void {
    if (isPending) return;
    void navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-warm-gray-100 last:border-0">
      <span className="text-warm-gray-500 text-sm shrink-0">{label}</span>
      <div className="flex items-center gap-2">
        <span className={cn(
          'text-sm font-semibold text-right',
          isPending ? 'italic text-warm-gray-400' : 'text-warm-gray-900',
        )}>
          {isPending ? 'Contact us for address' : value}
        </span>
        {!isPending && (
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 rounded hover:bg-warm-gray-100 transition-colors text-warm-gray-400 hover:text-forest-green-600"
            aria-label={`Copy ${label}`}
          >
            {copied
              ? <Check size={14} className="text-forest-green-500" />
              : <Copy size={14} />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function CheckDonationPanel({ copy }: { copy: DonateFormCopy }): React.JSX.Element {
  const [successData, setSuccessData] = useState<CheckSuccessData | null>(null);
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
      method: 'us-check',
      type: 'one-time',
      amount: 50,
      fund: 'where-needed-most',
      coverBankFee: false,
      country: 'United States',
      companyWebsite: '',
    },
  });

  const watchType = watch('type');
  const watchAmount = watch('amount');

  async function onSubmit(data: DonationFormValues): Promise<void> {
    setSubmitError(null);
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, method: 'us-check', coverBankFee: false }),
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        setSubmitError("We couldn't record your pledge right now. Please try again or email us directly.");
        return;
      }

      setSuccessData({
        firstName: data.firstName,
        email: data.email,
        amount: data.amount,
        fund: FUND_LABELS[data.fund] ?? data.fund,
        type: data.type,
        recurringFrequency: data.recurringFrequency,
        invoiceNumber: result.invoiceNumber,
        emailStatus: result.emailStatus,
      });
    } catch {
      setSubmitError("We couldn't reach the server. Please check your connection and try again.");
    }
  }

  return (
    <div className="space-y-8">

      {/* Zero-fee highlight */}
      <div className="flex items-start gap-4 bg-forest-green-50 rounded-xl p-5 border border-forest-green-100">
        <div className="w-10 h-10 bg-forest-green-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
          <CheckCircle size={20} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-forest-green-900 mb-1">{copy.checkFeeTitle}</p>
          <p className="text-sm text-warm-gray-600 leading-relaxed">
            {copy.checkFeeText}
          </p>
        </div>
      </div>

      {/* Steps */}
      <div>
        <div className="flex items-center gap-3 pb-3 border-b border-warm-gray-100 mb-5">
          <div className="w-7 h-7 rounded-full bg-forest-green-500 text-white text-xs font-bold flex items-center justify-center shrink-0">1</div>
          <h3 className="font-bold text-warm-gray-900">{copy.checkStepsTitle}</h3>
        </div>
        <ol className="space-y-4">
          {copy.checkSteps.map((text, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span className="shrink-0 w-7 h-7 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              <span className="text-warm-gray-600 text-sm leading-relaxed pt-0.5">{text}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Check details */}
      <div>
        <div className="flex items-center gap-3 pb-3 border-b border-warm-gray-100 mb-4">
          <div className="w-7 h-7 rounded-full bg-forest-green-500 text-white text-xs font-bold flex items-center justify-center shrink-0">2</div>
          <h3 className="font-bold text-warm-gray-900">{copy.checkDetailsTitle}</h3>
        </div>
        <div className="bg-white border border-warm-gray-200 rounded-xl p-5 shadow-sm">
          <CopyRow label="Make payable to" value={US_CHECK_DETAILS.payableTo} />
          <CopyRow label="Memo / note line" value={US_CHECK_DETAILS.memo} />
          <CopyRow label="Mailing address" value={US_CHECK_DETAILS.mailingAddress} />
        </div>
        <p className="text-xs text-warm-gray-400 text-center mt-2">
          Click the copy icon next to each field to copy it.
        </p>
      </div>


      {/* Pledge form */}
      <div>
        <div className="flex items-center gap-3 pb-3 border-b border-warm-gray-100 mb-5">
          <div className="w-7 h-7 rounded-full bg-forest-green-500 text-white text-xs font-bold flex items-center justify-center shrink-0">3</div>
          <h3 className="font-bold text-warm-gray-900">{copy.checkPledgeTitle}</h3>
        </div>
        <p className="text-sm text-warm-gray-600 leading-relaxed mb-5">
          {copy.checkPledgeText}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>

          {/* Honeypot */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] w-px h-px overflow-hidden"
            {...register('companyWebsite')}
          />

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

          {watchType === 'recurring' && (
            <div>
              <p className="text-sm font-medium text-warm-gray-700 mb-2">Frequency</p>
              <p className="text-xs text-warm-gray-400 mb-3">
                We&apos;ll email you a reminder each period since check giving is manual.
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
            <p className="text-sm font-medium text-warm-gray-700 mb-3">Check Amount (USD)</p>
            <AmountSelector
              value={watchAmount}
              onChange={(v) => setValue('amount', v, { shouldValidate: true })}
            />
            {errors.amount && <p className="text-sm text-error mt-1">{errors.amount.message}</p>}
          </div>

          {/* Fund */}
          <FundSelector
            value={watch('fund')}
            onChange={(f) => setValue('fund', f)}
            error={errors.fund?.message}
          />

          {/* Your Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input id="check-firstName" label="First Name" placeholder="Jane"
              error={errors.firstName?.message} {...register('firstName')} />
            <Input id="check-lastName" label="Last Name" placeholder="Smith"
              error={errors.lastName?.message} {...register('lastName')} />
          </div>
          <div>
            <Input id="check-email" type="email" label="Email Address" placeholder="jane@example.com"
              error={errors.email?.message} {...register('email')} />
            <p className="flex items-start gap-1.5 text-xs text-warm-gray-400 mt-1.5">
              <Info size={13} className="shrink-0 mt-0.5" />
              We only use this to send your pledge confirmation and, for recurring gifts, a
              reminder each period. We will not add you to any marketing list.
            </p>
          </div>
          <Input id="check-phone" type="tel" label="Phone (optional)" placeholder="+1 234 567 8900"
            {...register('phone')} />
          <Input id="check-country" label="Country" placeholder="United States"
            error={errors.country?.message} {...register('country')} />

          {submitError && (
            <div className="flex items-center gap-2 bg-error/10 text-error text-sm rounded-xl px-4 py-3">
              <AlertCircle size={16} className="shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" className="w-full text-base" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : `${copy.checkSubmitLabel} →`}
          </Button>
        </form>
      </div>

      {/* Confirm by email / phone (fallback) */}
      <div>
        <div className="flex items-center gap-3 pb-3 border-b border-warm-gray-100 mb-4">
          <div className="w-7 h-7 rounded-full bg-forest-green-500 text-white text-xs font-bold flex items-center justify-center shrink-0">4</div>
          <h3 className="font-bold text-warm-gray-900">{copy.checkEmailTitle}</h3>
        </div>
        <p className="text-sm text-warm-gray-600 leading-relaxed mb-4">
          {copy.checkEmailText}
        </p>
        <a
          href={`mailto:${ORG.email}?subject=Check%20Donation%20-%20Healthy%20Steps%20Foundation`}
          className="inline-flex items-center gap-2 bg-forest-green-600 text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-forest-green-700 transition-colors"
        >
          <Mail size={16} />
          {ORG.email}
        </a>
        <div className="mt-4 space-y-1">
          {ORG.phone.map((num) => (
            <a
              key={num}
              href={`tel:${num}`}
              className="flex items-center gap-2 text-forest-green-600 text-sm hover:text-forest-green-700 transition-colors font-medium"
            >
              {num}
            </a>
          ))}
        </div>
      </div>

      {/* Success Modal */}
      <Modal isOpen={!!successData} onClose={() => setSuccessData(null)}>
        {successData && (
          <div className="space-y-6">
            <div className="text-center pt-2">
              <div className="w-16 h-16 bg-forest-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={36} className="text-forest-green-500" />
              </div>
              <h2 className="text-2xl font-bold font-serif text-warm-gray-900 mb-1">
                Thank You, {successData.firstName}!
              </h2>
              <p className="text-warm-gray-500 text-sm">
                We&apos;ve recorded your pledge. Mail your check whenever you&apos;re ready.
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
                  We couldn&apos;t email your confirmation. Please contact us at {ORG.email}{' '}
                  referencing invoice #{successData.invoiceNumber}.
                </p>
              )}
            </div>

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
              <div className="flex justify-between font-bold border-t border-forest-green-200 pt-2 text-base">
                <span className="text-warm-gray-700">Check amount</span>
                <span className="text-forest-green-600">${successData.amount}</span>
              </div>
            </div>

            <div className="bg-warm-gray-50 rounded-xl p-4 border border-warm-gray-100">
              <CopyRow label="Make payable to" value={US_CHECK_DETAILS.payableTo} />
              <CopyRow label="Memo / note line" value={US_CHECK_DETAILS.memo} />
              <CopyRow label="Mailing address" value={US_CHECK_DETAILS.mailingAddress} />
            </div>

            {successData.type === 'recurring' && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
                <p className="font-semibold mb-1">Recurring Gift Reminder</p>
                <p>
                  Since check giving is manual, please set a reminder to mail your check{' '}
                  {successData.recurringFrequency}. We&apos;ll also send you a reminder email each period.
                </p>
              </div>
            )}

            <Button variant="primary" size="lg" className="w-full" onClick={() => setSuccessData(null)}>
              Done
            </Button>
          </div>
        )}
      </Modal>

    </div>
  );
}

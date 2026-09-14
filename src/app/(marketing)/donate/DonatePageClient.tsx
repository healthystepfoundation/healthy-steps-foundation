'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Globe, FileText } from 'lucide-react';
import DonationForm from '@/components/donation/DonationForm';
import CheckDonationPanel from '@/components/donation/CheckDonationPanel';
import { cn } from '@/lib/utils';
import type { DonationFund } from '@/types';

type PaymentMethod = 'swift' | 'us-check';

interface MethodOption {
  id: PaymentMethod;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  sublabel: string;
}

const VALID_FUNDS: DonationFund[] = [
  'food-closet', 'clothing-closet', 'children-tuition',
  'adult-vocation', 'family-medical', 'resource-materials', 'where-needed-most',
];

const METHODS: MethodOption[] = [
  {
    id: 'swift',
    icon: Globe,
    label: 'International Transfer',
    sublabel: 'SWIFT bank transfer, available worldwide',
  },
  {
    id: 'us-check',
    icon: FileText,
    label: 'US Donors: Give by Check',
    sublabel: 'Zero transfer fee when you donate by check',
  },
];

export default function DonatePageClient(): React.JSX.Element {
  const params = useSearchParams();
  const [method, setMethod] = useState<PaymentMethod>('swift');

  const amount = Number(params.get('amount')) || undefined;
  const rawFund = params.get('fund');
  const fund = VALID_FUNDS.includes(rawFund as DonationFund) ? (rawFund as DonationFund) : undefined;
  const rawType = params.get('type');
  const type: 'one-time' | 'recurring' | undefined =
    rawType === 'recurring' ? 'recurring' : rawType === 'one-time' ? 'one-time' : undefined;

  return (
    <div className="space-y-8">

      {/* Payment method picker */}
      <div>
        <p className="text-sm font-semibold text-warm-gray-700 mb-3">How would you like to give?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {METHODS.map(({ id, icon: Icon, label, sublabel }) => {
            const isActive = method === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setMethod(id)}
                className={cn(
                  'relative flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200',
                  isActive
                    ? 'border-forest-green-500 bg-forest-green-50 shadow-sm'
                    : 'border-warm-gray-200 hover:border-warm-gray-300 bg-white',
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                  isActive ? 'bg-forest-green-500' : 'bg-warm-gray-100',
                )}>
                  <Icon size={18} className={isActive ? 'text-white' : 'text-warm-gray-500'} />
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <p className={cn(
                    'font-semibold text-sm leading-tight',
                    isActive ? 'text-forest-green-800' : 'text-warm-gray-800',
                  )}>
                    {label}
                  </p>
                  <p className="text-xs text-warm-gray-500 mt-1 leading-snug">{sublabel}</p>
                </div>
                {isActive && (
                  <span className="absolute top-3 right-3 w-5 h-5 bg-forest-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-warm-gray-100" />

      {/* Active payment panel */}
      {method === 'swift' ? (
        <DonationForm defaultAmount={amount} defaultFund={fund} defaultType={type} />
      ) : (
        <CheckDonationPanel />
      )}

    </div>
  );
}

'use client';

import { BANK_FEE_USD } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';

interface BankFeeCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function BankFeeCheckbox({ checked, onChange }: BankFeeCheckboxProps): React.JSX.Element {
  return (
    <label className="flex items-start gap-3 cursor-pointer group p-4 rounded-lg border-2 border-warm-gray-200 hover:border-forest-green-200 transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 mt-0.5 rounded border-2 border-warm-gray-300 text-forest-green-500 focus:ring-2 focus:ring-forest-green-100 cursor-pointer shrink-0"
      />
      <div>
        <p className="font-semibold text-warm-gray-800 group-hover:text-warm-gray-900">
          I&apos;ll cover the {formatCurrency(BANK_FEE_USD)} international bank transfer fee
        </p>
        <p className="text-sm text-warm-gray-500 mt-1 leading-relaxed">
          International SWIFT transfers carry a fixed {formatCurrency(BANK_FEE_USD)} fee charged by
          the receiving bank. This applies to all international wire transfers regardless of amount.
          Covering it means <strong>100% of your gift reaches families in Uganda</strong>. If you
          prefer not to cover the fee, {formatCurrency(BANK_FEE_USD)} will be deducted from your
          donation on receipt.
        </p>
      </div>
    </label>
  );
}

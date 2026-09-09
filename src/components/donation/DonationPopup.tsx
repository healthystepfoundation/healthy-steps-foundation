'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ArrowRight } from 'lucide-react';

const SESSION_KEY = 'hsf_popup_shown';
const DELAY_MS = 5000;

const QUICK_AMOUNTS = [
  { amount: 50, impact: 'feeds a family for a month' },
  { amount: 100, impact: 'sponsors a child\'s school term' },
];

export default function DonationPopup(): React.JSX.Element | null {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const timer = setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem(SESSION_KEY, '1');
    }, DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  function handleQuickDonate(amount: number): void {
    setIsOpen(false);
    router.push(`/donate?amount=${amount}&fund=where-needed-most&type=one-time`);
  }

  function handleClose(): void {
    setIsOpen(false);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-warm-gray-900/45 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Popup card */}
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-float"
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 28, stiffness: 320, delay: 0.05 } }}
            exit={{ opacity: 0, y: 40, scale: 0.95, transition: { duration: 0.2 } }}
            role="dialog"
            aria-modal="true"
            aria-label="Donation prompt"
          >
            {/* Green header strip */}
            <div className="relative overflow-hidden bg-gradient-to-br from-forest-green-700 via-forest-green-800 to-forest-green-900 px-6 pt-7 pb-9 text-center text-white">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 -right-12 h-48 w-48 rounded-full bg-amber-400/15 blur-3xl"
              />
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 rounded-lg p-1.5 transition-colors hover:bg-white/10"
                aria-label="Close"
              >
                <X size={18} className="text-white/70" />
              </button>

              <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 shadow-glow-amber">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 animate-ping rounded-full bg-amber-400/40"
                />
                <Heart size={26} className="relative fill-warm-gray-900 text-warm-gray-900" />
              </div>
              <h2 className="relative mb-2 font-serif text-2xl font-bold">Make an Impact Today</h2>
              <p className="relative text-sm leading-relaxed text-forest-green-100/85">
                Partner with us to help families in Wakiso, Uganda access mental health
                support, emergency food, education, and essential resources, with dignity.
              </p>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-4">
              {/* Quick donate buttons */}
              <div className="space-y-3">
                {QUICK_AMOUNTS.map(({ amount, impact }) => (
                  <button
                    key={amount}
                    onClick={() => handleQuickDonate(amount)}
                    className="group flex w-full items-center justify-between rounded-2xl border border-forest-green-100 bg-forest-green-50 px-5 py-4 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-forest-green-300 hover:bg-white hover:shadow-lift"
                  >
                    <div className="text-left">
                      <p className="font-serif text-xl font-bold text-forest-green-900">
                        ${amount}
                      </p>
                      <p className="text-xs text-forest-green-600">{impact}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 transition-colors group-hover:text-amber-700">
                      Please Give
                      <ArrowRight
                        size={15}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </span>
                  </button>
                ))}
              </div>

              {/* Full page link */}
              <button
                onClick={() => { handleClose(); router.push('/donate'); }}
                className="w-full text-center text-sm text-warm-gray-500 hover:text-forest-green-600 transition-colors py-2"
              >
                Choose a different amount or fund →
              </button>

              <p className="text-xs text-warm-gray-400 text-center">
                All donations via secure international bank transfer (SWIFT).
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

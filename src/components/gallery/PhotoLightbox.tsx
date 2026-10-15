'use client';

import { useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { MediaValue } from '@/lib/cms/types';

interface PhotoLightboxProps {
  photos: MediaValue[];
  /** Index of the open photo, or null when closed. */
  index: number | null;
  onChange: (index: number | null) => void;
}

/** A horizontal drag past this many pixels counts as a swipe. */
const SWIPE_THRESHOLD = 60;

/**
 * Full-screen viewer for one outreach's photos. Shows each photo uncropped,
 * with previous/next by button, arrow key or swipe, and closes on Escape,
 * the X, or a tap on the backdrop.
 */
export default function PhotoLightbox({
  photos,
  index,
  onChange,
}: PhotoLightboxProps): React.JSX.Element {
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null;
  const count = photos.length;

  const step = useCallback(
    (delta: number): void => {
      if (index === null) return;
      onChange((index + delta + count) % count);
    },
    [index, count, onChange],
  );

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') onChange(null);
      else if (event.key === 'ArrowRight') step(1);
      else if (event.key === 'ArrowLeft') step(-1);
    }

    // Keep the page behind still while the viewer is open
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    closeRef.current?.focus();

    return (): void => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, step, onChange]);

  function handleDragEnd(_: unknown, info: PanInfo): void {
    if (info.offset.x < -SWIPE_THRESHOLD) step(1);
    else if (info.offset.x > SWIPE_THRESHOLD) step(-1);
  }

  const photo = index === null ? null : photos[index];

  return (
    <AnimatePresence>
      {photo && index !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(): void => onChange(null)}
          className="fixed inset-0 z-[100] flex flex-col bg-forest-green-900/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${index + 1} of ${count}`}
        >
          {/* Top bar: counter and close */}
          <div className="flex items-center justify-between px-4 py-4 sm:px-6">
            <p className="text-sm font-medium tabular-nums text-white/70" aria-live="polite">
              {index + 1} / {count}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={(): void => onChange(null)}
              aria-label="Close photo"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X size={22} />
            </button>
          </div>

          {/* The photo itself; swipe sideways on a phone */}
          <div className="relative flex-1 px-4 sm:px-20">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={photo.src}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                drag={count > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={handleDragEnd}
                onClick={(event): void => event.stopPropagation()}
                className="relative h-full w-full cursor-grab touch-pan-y active:cursor-grabbing"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="pointer-events-none object-contain select-none"
                  sizes="100vw"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>

            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={(event): void => {
                    event.stopPropagation();
                    step(-1);
                  }}
                  aria-label="Previous photo"
                  className="absolute top-1/2 left-2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:flex"
                >
                  <ChevronLeft size={26} />
                </button>
                <button
                  type="button"
                  onClick={(event): void => {
                    event.stopPropagation();
                    step(1);
                  }}
                  aria-label="Next photo"
                  className="absolute top-1/2 right-2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:flex"
                >
                  <ChevronRight size={26} />
                </button>
              </>
            )}
          </div>

          {/* Caption */}
          <p
            onClick={(event): void => event.stopPropagation()}
            className="mx-auto max-w-2xl px-6 py-5 text-center text-sm leading-relaxed text-white/80"
          >
            {photo.alt}
            {count > 1 && (
              <span className="mt-1 block text-xs text-white/50 sm:hidden">Swipe for more</span>
            )}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

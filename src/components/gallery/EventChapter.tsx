'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { Camera, MapPin, Play } from 'lucide-react';
import FadeUp from '@/components/ui/FadeUp';
import Button from '@/components/ui/Button';
import PhotoLightbox from '@/components/gallery/PhotoLightbox';
import { cn } from '@/lib/utils';
import type { MediaValue } from '@/lib/cms/types';

/** Photos visible before "Show all" — two full rows on desktop. */
const INITIAL_PHOTOS = 8;

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface DateParts {
  day: string;
  monthYear: string;
  weekday: string;
}

/**
 * "2026-10-10" → { day: "10", monthYear: "October 2026", weekday: "Saturday" }.
 * Parsed by hand rather than with toLocaleDateString so the server and the
 * browser can never disagree (a hydration mismatch) or shift it by a timezone.
 */
function dateParts(iso: string): DateParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return null;
  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  if (Number.isNaN(date.getTime())) return null;
  return {
    day: String(Number(day)),
    monthYear: `${MONTHS[date.getUTCMonth()]} ${year}`,
    weekday: WEEKDAYS[date.getUTCDay()],
  };
}

const tile: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: (i % INITIAL_PHOTOS) * 0.05, ease: 'easeOut' as const },
  }),
};

export interface EventChapterProps {
  id: string;
  title: string;
  date: string;
  place: string;
  text: string;
  video: MediaValue;
  poster: MediaValue;
  videoCaption: string;
  photos: MediaValue[];
  tone: 'light' | 'dark';
}

export default function EventChapter({
  id,
  title,
  date,
  place,
  text,
  video,
  poster,
  videoCaption,
  photos,
  tone,
}: EventChapterProps): React.JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [openPhoto, setOpenPhoto] = useState<number | null>(null);

  const dark = tone === 'dark';
  const parts = dateParts(date);
  const hasVideo = video.src.trim() !== '';
  const visible = showAll ? photos : photos.slice(0, INITIAL_PHOTOS);
  const hidden = photos.length - INITIAL_PHOTOS;

  function handlePlay(): void {
    const element = videoRef.current;
    if (!element) return;
    void element.play();
    setPlaying(true);
  }

  return (
    <section
      id={id}
      className={cn(
        'scroll-mt-24 px-6 py-20 sm:py-24',
        dark ? 'bg-forest-green-900 text-white' : 'bg-warm-white',
      )}
    >
      <div className="container mx-auto max-w-6xl">
        {/* Story + video */}
        <div className="mb-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <FadeUp className={hasVideo ? 'lg:col-span-5' : 'lg:col-span-12 max-w-3xl'}>
            <div className={cn('mb-6 h-0.5 w-10', dark ? 'bg-amber-400' : 'bg-amber-500')} />

            {parts && (
              <div className="mb-5 flex items-center gap-4">
                <span
                  className={cn(
                    'font-serif text-6xl leading-none font-black sm:text-7xl',
                    dark ? 'text-amber-400' : 'text-forest-green-600',
                  )}
                >
                  {parts.day}
                </span>
                <span className="flex flex-col">
                  <span
                    className={cn(
                      'text-sm font-semibold tracking-widest uppercase',
                      dark ? 'text-forest-green-200' : 'text-warm-gray-700',
                    )}
                  >
                    {parts.monthYear}
                  </span>
                  <span className={cn('text-sm', dark ? 'text-forest-green-300' : 'text-warm-gray-400')}>
                    {parts.weekday}
                  </span>
                </span>
              </div>
            )}

            <h2
              className={cn(
                'mb-4 font-serif text-3xl leading-tight font-bold sm:text-4xl',
                dark ? 'text-white' : 'text-warm-gray-900',
              )}
            >
              {title}
            </h2>

            {place && (
              <p
                className={cn(
                  'mb-5 flex items-center gap-2 text-sm font-medium',
                  dark ? 'text-forest-green-200' : 'text-forest-green-700',
                )}
              >
                <MapPin size={16} className="shrink-0" />
                {place}
              </p>
            )}

            {text && (
              <p className={cn('leading-relaxed', dark ? 'text-forest-green-100' : 'text-warm-gray-600')}>
                {text}
              </p>
            )}

            <p
              className={cn(
                'mt-6 flex items-center gap-2 text-sm',
                dark ? 'text-forest-green-300' : 'text-warm-gray-400',
              )}
            >
              <Camera size={16} className="shrink-0" />
              {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
              {hasVideo && <span aria-hidden="true">·</span>}
              {hasVideo && 'video'}
            </p>
          </FadeUp>

          {hasVideo && (
            <FadeUp delay={0.1} className="lg:col-span-7">
              <div
                className={cn(
                  'group relative aspect-video overflow-hidden rounded-2xl bg-black shadow-float',
                  dark ? 'ring-1 ring-white/10' : 'ring-1 ring-warm-gray-200',
                )}
              >
                <video
                  ref={videoRef}
                  src={video.src}
                  poster={poster.src}
                  controls={playing}
                  playsInline
                  preload="none"
                  className="h-full w-full object-cover"
                />

                {!playing && (
                  <button
                    type="button"
                    onClick={handlePlay}
                    aria-label={`Play the video: ${title}`}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Image
                      src={poster.src}
                      alt={poster.alt}
                      fill
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 100vw, 640px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-green-900/75 via-forest-green-900/10 to-transparent" />
                    <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-forest-green-900 transition-colors group-hover:bg-amber-400 sm:h-20 sm:w-20">
                      <Play size={30} className="ml-1 fill-current" />
                    </span>
                    {videoCaption && (
                      <span className="absolute bottom-4 left-4 z-10 text-left text-sm font-medium text-white sm:bottom-5 sm:left-5">
                        {videoCaption}
                      </span>
                    )}
                  </button>
                )}
              </div>
            </FadeUp>
          )}
        </div>

        {/* Photo grid — equal tiles, tap to open full size */}
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          <AnimatePresence initial={false}>
            {visible.map((photo, i) => (
              <motion.li
                key={`${photo.src}-${i}`}
                custom={i}
                variants={tile}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              >
                <button
                  type="button"
                  onClick={(): void => setOpenPhoto(i)}
                  aria-label={`View photo full size: ${photo.alt}`}
                  className={cn(
                    'group relative block aspect-square w-full cursor-pointer overflow-hidden rounded-xl',
                    dark ? 'ring-1 ring-white/10 hover:ring-amber-300/60' : 'shadow-soft hover:shadow-lift',
                    'transition-shadow duration-500',
                  )}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
                  />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {hidden > 0 && (
          <div className="mt-10 flex justify-center">
            <Button
              type="button"
              variant={dark ? 'onDark' : 'outline'}
              onClick={(): void => setShowAll((value) => !value)}
              aria-expanded={showAll}
            >
              {showAll ? 'Show fewer photos' : `Show all ${photos.length} photos`}
            </Button>
          </div>
        )}
      </div>

      <PhotoLightbox photos={photos} index={openPhoto} onChange={setOpenPhoto} />
    </section>
  );
}

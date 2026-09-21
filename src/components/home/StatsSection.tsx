'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import type { HomeContent } from '@/lib/cms/pages/home';

function AnimatedCounter({
  end,
  suffix,
  duration = 2000,
}: {
  end: number;
  suffix: string;
  duration?: number;
}): React.JSX.Element {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number | null = null;
    function step(timestamp: number): void {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

function str(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export default function StatsSection({ content }: { content: HomeContent }): React.JSX.Element {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-24 sm:py-28">
      <div className="relative z-10 container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Stats side */}
          <div>
            {/* "Our Impact" is the heading here; the former heading text sits
                under it, same serif face but lighter and a step smaller. */}
            <SectionHeading
              title={content.statsEyebrow}
              lead={
                <span className="block whitespace-pre-line font-serif text-xl leading-snug font-normal text-warm-gray-700 sm:text-2xl">
                  {content.statsTitle}
                </span>
              }
              className="mb-10"
            />

            {/* Open grid, no card chrome — the numbers carry the section */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-12">
              {content.stats.map((stat, i) => {
                const value = str(stat.value);
                const suffix = str(stat.suffix);
                const label = str(stat.label);
                // Plain digits count up; anything else (e.g. "Weekly") is shown as written.
                const numeric = Number(value.replace(/,/g, ''));
                const countsUp = value.trim() !== '' && Number.isFinite(numeric);

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="mb-2 font-serif text-5xl font-black text-forest-green-600 tabular-nums sm:text-6xl">
                      {countsUp ? (
                        <AnimatedCounter end={numeric} suffix={suffix} />
                      ) : (
                        <span>
                          {value}
                          {suffix}
                        </span>
                      )}
                    </div>
                    <div className="text-sm leading-snug font-medium text-warm-gray-500">{label}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Photo side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="grain-overlay relative aspect-[4/3] overflow-hidden rounded-3xl shadow-float">
              <Image
                src={content.statsImage.src}
                alt={content.statsImage.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-green-900/55 via-transparent to-transparent" />
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}

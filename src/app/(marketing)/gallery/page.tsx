import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowDown } from 'lucide-react';
import EventChapter, { type EventChapterProps } from '@/components/gallery/EventChapter';
import { getPageContent } from '@/lib/cms/content';
import { sectionHidden } from '@/lib/cms/merge';
import { gallerySchema, type GalleryContent } from '@/lib/cms/pages/gallery';
import type { ContentItem, MediaValue } from '@/lib/cms/types';

export const metadata: Metadata = {
  title: 'Gallery | Healthy Steps Foundation',
  description:
    'Photos and videos from Healthy Steps Foundation outreaches in Uganda, including the October 2026 back-to-school events.',
};

/** List rows hold `{ photo }`; drop any row whose photo was never filled in. */
function photosOf(rows: ContentItem[]): MediaValue[] {
  return rows
    .map((row) => row.photo)
    .filter((photo): photo is MediaValue => typeof photo === 'object' && !Array.isArray(photo) && photo.src !== '');
}

/** "2026-10-10" → "10 Oct", for the compact jump links in the hero. */
function shortDate(iso: string): string {
  const match = /^\d{4}-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return iso;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${Number(match[2])} ${months[Number(match[1]) - 1] ?? ''}`.trim();
}

type Chapter = Omit<EventChapterProps, 'tone'>;

function chapters(content: GalleryContent): Chapter[] {
  const slots: { group: string; chapter: Chapter }[] = [
    {
      group: 'event1',
      chapter: {
        id: 'outreach-1',
        title: content.event1Title,
        date: content.event1Date,
        place: content.event1Place,
        text: content.event1Text,
        video: content.event1Video,
        poster: content.event1Poster,
        videoCaption: content.event1VideoCaption,
        photos: photosOf(content.event1Photos),
      },
    },
    {
      group: 'event2',
      chapter: {
        id: 'outreach-2',
        title: content.event2Title,
        date: content.event2Date,
        place: content.event2Place,
        text: content.event2Text,
        video: content.event2Video,
        poster: content.event2Poster,
        videoCaption: content.event2VideoCaption,
        photos: photosOf(content.event2Photos),
      },
    },
  ];

  return slots
    .filter(({ group }) => !sectionHidden(content, group))
    .map(({ chapter }) => chapter);
}

export default async function GalleryPage(): Promise<React.JSX.Element> {
  const content = await getPageContent(gallerySchema);
  const visibleChapters = chapters(content);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden">
        <Image
          src={content.heroImage.src}
          alt={content.heroImage.alt}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-green-900/95 via-forest-green-900/70 to-forest-green-900/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-green-900/55 via-transparent to-transparent" />

        <div className="relative z-10 container mx-auto px-6 py-28">
          <div className="mb-4 h-0.5 w-10 bg-amber-400" />
          <h1 className="max-w-2xl font-serif text-4xl leading-tight font-black text-white sm:text-5xl lg:text-6xl">
            {content.heroEyebrow}
          </h1>
          <p className="mt-3 max-w-2xl font-serif text-xl leading-snug font-normal text-white/90 sm:text-2xl">
            {content.heroTitle}
          </p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-forest-green-100 sm:text-xl">
            {content.heroLead}
          </p>

          {/* Jump straight to an outreach */}
          {visibleChapters.length > 1 && (
            <nav aria-label="Outreaches on this page" className="mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row">
              {visibleChapters.map((chapter) => {
                const thumb = chapter.photos[0] ?? chapter.poster;
                return (
                  <a
                    key={chapter.id}
                    href={`#${chapter.id}`}
                    className="group flex flex-1 items-center gap-3 rounded-2xl bg-white/10 p-2 pr-4 ring-1 ring-white/15 backdrop-blur-sm transition-colors hover:bg-white/15"
                  >
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                      <Image src={thumb.src} alt="" fill className="object-cover" sizes="56px" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold tracking-widest text-amber-300 uppercase">
                        {shortDate(chapter.date)}
                      </span>
                      <span className="block truncate text-sm font-medium text-white">
                        {chapter.place || chapter.title}
                      </span>
                    </span>
                    <ArrowDown
                      size={16}
                      className="shrink-0 text-white/60 transition-transform group-hover:translate-y-0.5"
                    />
                  </a>
                );
              })}
            </nav>
          )}
        </div>
      </section>

      {/* One chapter per outreach, alternating dark and light */}
      {visibleChapters.map((chapter, i) => (
        <EventChapter key={chapter.id} {...chapter} tone={i % 2 === 0 ? 'dark' : 'light'} />
      ))}
    </>
  );
}

import 'server-only';
import { PROGRAMS } from '@/lib/constants';
import type { ProgramView, Testimonial, UpcomingEvent, NewsUpdate } from '@/types';
import { getPageContent, getPagesContent } from './content';
import { sectionHidden } from './merge';
import { PROGRAM_SCHEMAS } from './pages/program';
import { testimonialsSchema } from './pages/testimonials';
import { eventsSchema } from './pages/events';
import { newsSchema } from './pages/news';
import type { ContentItem, MediaValue } from './types';

/**
 * Content that appears on more than one page.
 *
 * Every helper here reads through the render-scoped cache in `content.ts`, so
 * calling several of them on one page still costs a single database round trip.
 */

function str(value: ContentItem[string] | undefined): string {
  return typeof value === 'string' ? value : '';
}

function strList(value: ContentItem[string] | undefined): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];
}

function mediaOf(value: ContentItem[string] | undefined): MediaValue {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value
    : { src: '', alt: '' };
}

/**
 * The six programs, with editor changes applied.
 *
 * `slug`, `fund` and `relatedSlugs` always come from `PROGRAMS` — they are
 * routing, not copy, so the CMS cannot break a URL or misdirect a donation.
 */
export async function getPrograms(): Promise<ProgramView[]> {
  const contents = await getPagesContent(PROGRAM_SCHEMAS);

  return PROGRAMS.map((program, i) => {
    const content = contents[i];
    if (!content) {
      throw new Error(`Missing merged content for program "${program.slug}"`);
    }
    const photo = content.image;

    return {
      slug: program.slug,
      fund: program.fund,
      relatedSlugs: program.relatedSlugs,
      name: content.name,
      shortDescription: content.shortDescription,
      description: content.description,
      icon: content.icon,
      image: photo.src,
      imageAlt: photo.alt || content.name,
      whoWeServe: content.whoWeServe,
      donateBlurb: content.donateBlurb,
      donateStripHidden: sectionHidden(content, 'donate'),
    };
  });
}

export async function getProgram(slug: string): Promise<ProgramView | undefined> {
  const programs = await getPrograms();
  return programs.find((program) => program.slug === slug);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const content = await getPageContent(testimonialsSchema);

  return content.items.map((row, i) => ({
    id: `t${i + 1}`,
    name: str(row.name),
    location: str(row.location),
    quote: str(row.quote),
    program: str(row.program) || undefined,
  }));
}

/** The wording of the homepage events banner, with editor changes applied. */
export async function getEventsBanner(): Promise<{ label: string; headline: string }> {
  const content = await getPageContent(eventsSchema);
  return { label: content.bannerLabel, headline: content.bannerHeadline };
}

export async function getUpcomingEvents(): Promise<UpcomingEvent[]> {
  const content = await getPageContent(eventsSchema);

  return content.items.map((row, i) => ({
    slug: str(row.slug) || `event-${i + 1}`,
    title: str(row.title),
    date: str(row.date),
    startTime: str(row.startTime),
    endTime: str(row.endTime),
    location: str(row.location),
    description: str(row.description),
  }));
}

export async function getNewsUpdates(): Promise<NewsUpdate[]> {
  const content = await getPageContent(newsSchema);

  return content.posts.map((row, i) => {
    const photo = mediaOf(row.image);
    return {
      slug: str(row.slug) || `update-${i + 1}`,
      title: str(row.title),
      date: str(row.date),
      excerpt: str(row.excerpt),
      image: photo.src,
      imageAlt: photo.alt,
      body: strList(row.body),
      signOff: { name: str(row.signOffName), title: str(row.signOffTitle) },
    };
  });
}

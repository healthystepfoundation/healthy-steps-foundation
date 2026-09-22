import EventsBanner from '@/components/home/EventsBanner';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import VideoSection from '@/components/home/VideoSection';
import { getPageContent } from '@/lib/cms/content';
import { getEventsBanner, getUpcomingEvents } from '@/lib/cms/collections';
import { sectionHidden } from '@/lib/cms/merge';
import { homeSchema } from '@/lib/cms/pages/home';

// EventsBanner picks "the next upcoming event" from today's date — without
// revalidation this page is statically prerendered once and the banner would
// freeze at build time instead of updating as events pass.
export const revalidate = 3600;

export default async function HomePage(): Promise<React.JSX.Element> {
  const [content, events, banner] = await Promise.all([
    getPageContent(homeSchema),
    getUpcomingEvents(),
    getEventsBanner(),
  ]);

  return (
    <>
      <EventsBanner events={events} label={banner.label} headline={banner.headline} />
      <HeroSection content={content} />
      {!sectionHidden(content, 'stats') && <StatsSection content={content} />}
      {/* The video and gallery share one section; it only goes when both are removed */}
      {!(sectionHidden(content, 'video') && sectionHidden(content, 'gallery')) && (
        <VideoSection content={content} />
      )}
    </>
  );
}

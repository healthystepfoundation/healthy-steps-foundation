import type { Metadata } from 'next';
import { Heart } from 'lucide-react';
import FadeUp from '@/components/ui/FadeUp';
import StoriesGrid from '@/components/stories/StoriesGrid';
import { getPrograms, getTestimonials } from '@/lib/cms/collections';
import { getPageContent } from '@/lib/cms/content';
import { storiesSchema } from '@/lib/cms/pages/stories';

export const metadata: Metadata = {
  title: 'Stories | Healthy Steps Foundation',
  description:
    'Real stories from families and partners impacted by Healthy Steps Foundation: hope, resilience, and dignity in Uganda.',
};

export default async function StoriesPage(): Promise<React.JSX.Element> {
  const [content, testimonials, programs] = await Promise.all([
    getPageContent(storiesSchema),
    getTestimonials(),
    getPrograms(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="bg-forest-green-900 text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-forest-green-700/30 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full translate-y-1/2 -translate-x-1/3" />
        </div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-4">
            {content.heroEyebrow}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-serif leading-tight mb-6">
            {content.heroTitle}
          </h1>
          <p className="text-forest-green-100 text-lg sm:text-xl leading-relaxed max-w-2xl">
            {content.heroLead}
          </p>
        </div>
      </section>

      {/* Stories grid */}
      <section className="py-20 px-6 bg-warm-white">
        <div className="container mx-auto max-w-6xl">
          <FadeUp className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-warm-gray-900 mb-3">
              {content.gridEyebrow}
            </h2>
            <p className="font-serif text-xl sm:text-2xl leading-snug font-normal text-warm-gray-700">
              {content.gridTitle}
            </p>
          </FadeUp>

          <StoriesGrid testimonials={testimonials} />

          {/* More stories note */}
          <FadeUp delay={0.2} className="mt-14">
            <div className="bg-forest-green-50 rounded-2xl p-8 sm:p-10 text-center max-w-2xl mx-auto">
              <div className="w-12 h-12 bg-forest-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={22} className="text-forest-green-500" />
              </div>
              <h3 className="font-bold font-serif text-warm-gray-900 text-xl mb-3">
                {content.moreTitle}
              </h3>
              <p className="text-warm-gray-600 text-sm leading-relaxed">{content.moreText}</p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Programs that create stories */}
      <section className="py-20 px-6 bg-forest-green-50">
        <div className="container mx-auto max-w-4xl">
          <FadeUp className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-warm-gray-900 mb-3">
              {content.programsEyebrow}
            </h2>
            <p className="font-serif text-xl sm:text-2xl leading-snug font-normal text-warm-gray-700 mb-4">
              {content.programsTitle}
            </p>
            <p className="text-warm-gray-500 text-lg max-w-xl mx-auto">{content.programsLead}</p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="flex flex-wrap justify-center gap-3">
              {programs.map(({ slug, name }) => (
                <span
                  key={slug}
                  className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-forest-green-700 shadow-sm border border-forest-green-100"
                >
                  {name}
                </span>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

    </>
  );
}

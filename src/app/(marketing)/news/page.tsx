import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Mail, Phone } from 'lucide-react';
import { US_CHECK_DETAILS, ORG } from '@/lib/constants';
import FadeUp from '@/components/ui/FadeUp';
import { buttonStyles } from '@/components/ui/Button';
import { getNewsUpdates } from '@/lib/cms/collections';
import { getPageContent } from '@/lib/cms/content';
import { newsSchema } from '@/lib/cms/pages/news';

export const metadata: Metadata = {
  title: 'News | Healthy Steps Foundation',
  description:
    'Updates from Healthy Steps Foundation on recent events, fundraising, and what is next for families in Ndejje, Uganda.',
};

function formatDate(iso: string): string {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function NewsPage(): Promise<React.JSX.Element> {
  const [content, updates] = await Promise.all([getPageContent(newsSchema), getNewsUpdates()]);

  const [latest, ...earlier] = updates;
  // The schema keeps at least one post, so this only trips if the data is edited
  // directly in the database.
  if (!latest) notFound();

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <Image
          src={latest.image}
          alt={latest.imageAlt ?? latest.title}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-green-900/95 via-forest-green-900/70 to-forest-green-900/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-green-900/55 via-transparent to-transparent" />
        <div className="relative z-10 container mx-auto px-6 py-24">
          <div className="w-10 h-0.5 bg-amber-400 mb-4" />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-serif leading-tight text-white max-w-2xl">
            {content.heroEyebrow}
          </h1>
          <p className="font-serif text-xl sm:text-2xl leading-snug font-normal text-white/90 max-w-2xl mt-3 whitespace-pre-line">
            {content.heroTitle}
          </p>
          <p className="text-forest-green-100 text-lg sm:text-xl leading-relaxed max-w-2xl mt-6">
            {content.heroLead}
          </p>
        </div>
      </section>

      {/* Latest update */}
      <section className="py-20 px-6 bg-warm-white">
        <div className="container mx-auto max-w-3xl">
          <FadeUp className="mb-10">
            <div className="w-10 h-0.5 bg-amber-500 mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-warm-gray-900 mb-3">
              {formatDate(latest.date)}
            </h2>
            <p className="font-serif text-xl sm:text-2xl leading-snug font-normal text-warm-gray-700">
              {latest.title}
            </p>
          </FadeUp>

          <FadeUp delay={0.08}>
            <p className="text-warm-gray-900 font-semibold mb-6">{content.salutation}</p>
            <div className="space-y-5 text-warm-gray-600 leading-relaxed">
              {latest.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <p className="mt-8 text-warm-gray-700">
              {content.signOffPrefix}
              <br />
              <span className="font-semibold text-warm-gray-900">
                {latest.signOff.name}
                {latest.signOff.title && `, ${latest.signOff.title}`}
              </span>
            </p>
          </FadeUp>

          {/* Older posts — only rendered once a second update exists */}
          {earlier.length > 0 && (
            <FadeUp delay={0.12} className="mt-16 border-t border-warm-gray-200 pt-12">
              <div className="w-10 h-0.5 bg-amber-500 mb-4" />
              <h2 className="text-2xl font-bold font-serif text-warm-gray-900 mb-6">
                {content.earlierHeading}
              </h2>
              <ul className="space-y-6">
                {earlier.map((post) => (
                  <li key={post.slug} className="flex flex-col gap-4 sm:flex-row">
                    {post.image && (
                      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl sm:w-40">
                        <Image
                          src={post.image}
                          alt={post.imageAlt ?? post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 160px"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-warm-gray-400 mb-1">
                        {formatDate(post.date)}
                      </p>
                      <h3 className="font-bold font-serif text-warm-gray-900 text-lg mb-2">
                        {post.title}
                      </h3>
                      <p className="text-warm-gray-600 text-sm leading-relaxed">{post.excerpt}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </FadeUp>
          )}
        </div>
      </section>

      {/* How to give in response to this update */}
      <section className="py-20 px-6 bg-forest-green-50">
        <div className="container mx-auto max-w-4xl">
          <FadeUp className="text-center mb-12">
            <div className="w-10 h-0.5 bg-amber-500 mb-4 mx-auto" />
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-warm-gray-900 mb-3">
              {content.giveEyebrow}
            </h2>
            <p className="font-serif text-xl sm:text-2xl leading-snug font-normal text-warm-gray-700">
              {content.giveTitle}
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FadeUp delay={0.08}>
              <div className="bg-white rounded-2xl p-8 shadow-md h-full flex flex-col">
                <h3 className="font-bold text-warm-gray-900 text-lg mb-2">
                  {content.giveOnlineTitle}
                </h3>
                <p className="text-warm-gray-600 text-sm leading-relaxed mb-6 flex-1">
                  {content.giveOnlineText}
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={0.16}>
              <div className="bg-white rounded-2xl p-8 shadow-md h-full flex flex-col">
                <h3 className="font-bold text-warm-gray-900 text-lg mb-2">
                  {content.giveCheckTitle}
                </h3>
                <p className="text-warm-gray-600 text-sm leading-relaxed mb-4">
                  {content.giveCheckIntro} <strong>{US_CHECK_DETAILS.payableTo}</strong>, with{' '}
                  <strong>{US_CHECK_DETAILS.memo}</strong> on the FOR line, and mail to:
                </p>
                <p className="text-warm-gray-900 text-sm font-medium leading-relaxed">
                  {US_CHECK_DETAILS.mailingAddress}
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-forest-green-900 text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <FadeUp>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif mb-3">
              {content.ctaEyebrow}
            </h2>
            <p className="font-serif text-xl sm:text-2xl leading-snug font-normal whitespace-pre-line text-white/90 mb-5">
              {content.ctaTitle}
            </p>
            <p className="text-forest-green-200 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              {content.ctaLead}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`mailto:${ORG.email}`}
                className={buttonStyles('primary', 'lg', 'w-full sm:w-auto')}
              >
                <Mail size={20} />
                {content.ctaEmailLabel}
              </a>
              <a
                href={`tel:${ORG.phone[0]}`}
                className={buttonStyles('onDark', 'lg', 'w-full sm:w-auto')}
              >
                <Phone size={20} />
                {content.ctaPhoneLabel}
              </a>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}

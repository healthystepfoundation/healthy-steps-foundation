import type { Metadata } from 'next';
import Image from 'next/image';
import { Suspense } from 'react';
import { RefreshCw, Mail, Phone } from 'lucide-react';
import DonatePageClient from './DonatePageClient';
import { ORG } from '@/lib/constants';
import { ContentIcon } from '@/lib/icons';
import { getPageContent } from '@/lib/cms/content';
import { sectionHidden } from '@/lib/cms/merge';
import { donateSchema } from '@/lib/cms/pages/donate';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Donate',
  description: 'Support Healthy Steps Foundation and help families in Uganda thrive.',
};

function str(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export default async function DonatePage(): Promise<React.JSX.Element> {
  const content = await getPageContent(donateSchema);
  const showSidebar = !sectionHidden(content, 'sidebar');

  return (
    <>
      {/* Hero — real field photo, full-bleed overlay */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
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
        <div className="relative z-10 container mx-auto px-6 py-28 max-w-5xl">
          <div className="max-w-2xl">
            <div className="w-10 h-0.5 bg-amber-400 mb-4" />
            <h1 className="mb-3 font-serif text-4xl leading-tight font-bold text-white sm:text-5xl lg:text-6xl">
              {content.heroEyebrow}
            </h1>
            <p className="mb-8 font-serif text-xl sm:text-2xl leading-snug font-normal text-white/90">
              {content.heroHeadline}
            </p>
            <p className="text-forest-green-100 text-xl leading-relaxed max-w-xl">
              {content.heroLead}
            </p>
          </div>
        </div>
      </section>

      {/* Main content — form + sidebar */}
      <section className="py-16 px-6 bg-warm-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

            {/* Donation Form — takes 2/3 width, or all of it without the sidebar */}
            <div className={cn('bg-white rounded-2xl shadow-md p-8', showSidebar ? 'lg:col-span-2' : 'lg:col-span-3')}>
              <div className="w-10 h-0.5 bg-amber-500 mb-4" />
              <h2 className="text-2xl font-bold font-serif text-warm-gray-900 mb-2">
                {content.formTitle}
              </h2>
              <p className="text-warm-gray-500 text-sm mb-8">{content.formLead}</p>
              <Suspense fallback={
                <div className="flex items-center justify-center py-16 text-warm-gray-400">
                  <RefreshCw size={20} className="animate-spin mr-2" /> Loading...
                </div>
              }>
                <DonatePageClient copy={content} />
              </Suspense>
            </div>

            {/* Sidebar — takes 1/3 width */}
            {showSidebar && (
            <div className="space-y-6">

              {/* Secure Giving — replaces the former "Two Ways to Give" and
                  "Safe & Transparent" cards (client direction) */}
              <div className="bg-forest-green-900 rounded-2xl p-6">
                <div className="w-8 h-0.5 bg-amber-400 mb-3" />
                <div className="flex items-center gap-2 mb-3">
                  <ContentIcon name="Shield" size={18} className="text-amber-400" />
                  <h3 className="font-bold text-white font-serif text-lg">{content.secureTitle}</h3>
                </div>
                <p className="text-forest-green-200 text-sm leading-relaxed">
                  {content.secureText}
                </p>
              </div>

              {/* Questions */}
              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                <h3 className="font-bold text-warm-gray-900 mb-3">{content.questionsTitle}</h3>
                <p className="text-warm-gray-500 text-sm mb-4">{content.questionsText}</p>
                <div className="space-y-2">
                  <a
                    href={`mailto:${ORG.email}`}
                    className="flex items-center gap-2 text-forest-green-600 text-sm hover:text-forest-green-700 transition-colors font-medium"
                  >
                    <Mail size={15} /> {ORG.email}
                  </a>
                  {ORG.phone.map((num) => (
                    <a
                      key={num}
                      href={`tel:${num}`}
                      className="flex items-center gap-2 text-forest-green-600 text-sm hover:text-forest-green-700 transition-colors font-medium"
                    >
                      <Phone size={15} /> {num}
                    </a>
                  ))}
                </div>
              </div>

            </div>
            )}
          </div>
        </div>
      </section>

      {/* Bottom trust bar */}
      {!sectionHidden(content, 'trust') && (
      <section className="py-10 px-6 bg-forest-green-900 text-white">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {content.trustPoints.map((point, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <ContentIcon name={str(point.icon)} size={22} className="text-amber-400" />
                <p className="font-semibold text-white text-sm">{str(point.label)}</p>
                <p className="text-forest-green-300 text-xs leading-relaxed">{str(point.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}
    </>
  );
}

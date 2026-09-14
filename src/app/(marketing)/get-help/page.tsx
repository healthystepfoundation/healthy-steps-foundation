import type { Metadata } from 'next';
import { Phone, CheckCircle, Clock } from 'lucide-react';
import { ORG } from '@/lib/constants';
import FadeUp from '@/components/ui/FadeUp';
import { buttonStyles } from '@/components/ui/Button';
import { getPageContent } from '@/lib/cms/content';
import { getHelpSchema } from '@/lib/cms/pages/get-help';

export const metadata: Metadata = {
  title: 'Get Help | Healthy Steps Foundation',
  description:
    'Healthy Steps Foundation provides emergency, temporary support to families in Ndejje, Uganda. Learn about our programs and how to reach out for help.',
};

function str(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export default async function GetHelpPage(): Promise<React.JSX.Element> {
  const content = await getPageContent(getHelpSchema);

  return (
    <>
      {/* Hero */}
      <section className="bg-forest-green-900 text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-forest-green-700/30 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full translate-y-1/2 -translate-x-1/3" />
        </div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-serif leading-tight mb-3">
            {content.heroEyebrow}
          </h1>
          <p className="font-serif text-xl sm:text-2xl leading-snug font-normal text-white/90 mb-6">
            {content.heroTitle}
          </p>
          <p className="text-forest-green-100 text-lg sm:text-xl leading-relaxed max-w-2xl">
            {content.heroLead}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <a
              href={`tel:${ORG.phone[0]}`}
              className={buttonStyles('primary', 'lg', 'w-full sm:w-auto')}
            >
              <Phone size={20} />
              {content.heroCallLabel}
            </a>
          </div>
        </div>
      </section>

      {/* Hours of Operation */}
      <section className="py-20 px-6 bg-forest-green-50">
        <div className="container mx-auto max-w-4xl">
          <FadeUp className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-warm-gray-900 mb-3">
              {content.hoursEyebrow}
            </h2>
            <p className="font-serif text-xl sm:text-2xl leading-snug font-normal text-warm-gray-700">
              {content.hoursTitle}
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {content.hours.map((entry, i) => (
              <FadeUp key={i} delay={i * 0.07}>
                <div className="flex gap-4 items-start bg-white rounded-2xl p-6 shadow-md h-full">
                  <div className="w-10 h-10 bg-forest-green-500 rounded-lg flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-warm-gray-900 mb-1">{str(entry.title)}</h3>
                    <p className="text-warm-gray-600 text-sm leading-relaxed">
                      {str(entry.description)}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Our Promise */}
      <section className="py-20 px-6 bg-forest-green-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <FadeUp className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold font-serif mb-3">
              {content.promiseEyebrow}
            </h2>
            <p className="font-serif text-xl sm:text-2xl leading-snug font-normal text-white/90">
              {content.promiseTitle}
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {content.promises.map((promise, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div className="bg-forest-green-800/60 rounded-2xl p-7 border border-forest-green-700/50 h-full">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
                    <CheckCircle size={20} className="text-amber-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2">{str(promise.title)}</h3>
                  <p className="text-forest-green-200 text-sm leading-relaxed">
                    {str(promise.description)}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-6 bg-warm-white">
        <div className="container mx-auto max-w-3xl text-center">
          <FadeUp>
            <h2 className="text-3xl font-bold font-serif text-warm-gray-900 mb-4">
              {content.ctaTitle}
            </h2>
            <p className="text-warm-gray-500 text-lg mb-10 max-w-xl mx-auto">{content.ctaLead}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              {ORG.phone.map((num) => (
                <a
                  key={num}
                  href={`tel:${num}`}
                  className={buttonStyles('secondary', 'lg', 'w-full sm:w-auto')}
                >
                  <Phone size={20} />
                  {num}
                </a>
              ))}
            </div>
            <p className="text-warm-gray-500 text-sm">
              {content.ctaEmailPrefix}{' '}
              <a
                href={`mailto:${ORG.email}`}
                className="text-forest-green-600 font-medium hover:underline"
              >
                {ORG.email}
              </a>
            </p>
          </FadeUp>
        </div>
      </section>
    </>
  );
}

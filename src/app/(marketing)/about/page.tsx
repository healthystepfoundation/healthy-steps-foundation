import type { Metadata } from 'next';
import Image from 'next/image';
import { CheckCircle, Eye, Target } from 'lucide-react';
import FadeUp from '@/components/ui/FadeUp';
import { ContentIcon } from '@/lib/icons';
import { getPageContent } from '@/lib/cms/content';
import { aboutSchema } from '@/lib/cms/pages/about';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Healthy Steps Foundation: our story, mission, vision, and values.',
};

export default async function AboutPage(): Promise<React.JSX.Element> {
  const content = await getPageContent(aboutSchema);

  return (
    <>
      {/* Hero — split screen */}
      <section className="overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
          {/* Left — text panel */}
          <div className="bg-forest-green-900 text-white px-8 py-24 lg:px-16 flex items-center">
            <div className="max-w-lg">
              <div className="w-10 h-0.5 bg-amber-400 mb-6" />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-serif leading-[1.05] mb-3">
                {content.heroEyebrow}
              </h1>
              <p className="font-serif text-xl sm:text-2xl leading-snug font-normal text-white/90 mb-6">
                {content.heroTitle}
              </p>
              <p className="text-forest-green-100 text-lg sm:text-xl leading-relaxed">
                {content.heroLead}
              </p>
            </div>
          </div>
          {/* Right — real community photo */}
          <div className="relative min-h-[55vh] lg:min-h-0">
            <Image
              src={content.heroImage.src}
              alt={content.heroImage.alt}
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-6 bg-warm-white">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeUp>
              <div className="w-10 h-0.5 bg-amber-500 mb-4" />
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-warm-gray-900 mb-3">
                {content.storyEyebrow}
              </h2>
              <p className="font-serif text-xl sm:text-2xl leading-snug font-normal text-warm-gray-700 mb-6">
                {content.storyTitle}
              </p>
              <div className="space-y-4 text-warm-gray-600 leading-relaxed">
                {content.storyParagraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={content.storyImage.src}
                  alt={content.storyImage.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 px-6 bg-forest-green-50">
        <div className="container mx-auto max-w-4xl">
          <FadeUp className="mb-10">
            <div className="w-10 h-0.5 bg-amber-500 mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-warm-gray-900">
              {content.purposeEyebrow}
            </h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeUp>
              <div className="bg-white rounded-2xl p-10 shadow-md border-t-4 border-forest-green-500 h-full">
                <div className="w-12 h-12 bg-forest-green-50 rounded-xl flex items-center justify-center mb-6">
                  <Eye size={24} className="text-forest-green-500" />
                </div>
                <h2 className="text-2xl font-bold font-serif text-warm-gray-900 mb-4">
                  {content.visionTitle}
                </h2>
                <p className="text-warm-gray-600 leading-relaxed text-lg">{content.visionText}</p>
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="bg-white rounded-2xl p-10 shadow-md border-t-4 border-amber-500 h-full">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6">
                  <Target size={24} className="text-amber-500" />
                </div>
                <h2 className="text-2xl font-bold font-serif text-warm-gray-900 mb-4">
                  {content.missionTitle}
                </h2>
                <p className="text-warm-gray-600 leading-relaxed text-lg">{content.missionText}</p>
              </div>
            </FadeUp>
          </div>

          {/* Photo carried over from the removed Where We Work section */}
          <FadeUp delay={0.2}>
            <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden shadow-xl mt-8">
              <Image
                src={content.purposeImage.src}
                alt={content.purposeImage.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20 px-6 bg-warm-white">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeUp>
              <div className="w-10 h-0.5 bg-amber-500 mb-4" />
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-warm-gray-900 mb-3">
                {content.whoEyebrow}
              </h2>
              <p className="font-serif text-xl sm:text-2xl leading-snug font-normal text-warm-gray-700 mb-6">
                {content.whoTitle}
              </p>
              <div className="space-y-4 text-warm-gray-600 leading-relaxed">
                {content.whoParagraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.12}>
              <div className="bg-white rounded-2xl p-8 shadow-soft">
                <h3 className="font-bold text-warm-gray-900 text-lg mb-6">
                  {content.eligibilityHeading}
                </h3>
                <ul className="space-y-3">
                  {content.eligibility.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-forest-green-500 mt-0.5 shrink-0" />
                      <span className="text-warm-gray-700 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* How We Serve */}
      <section className="py-20 px-6 bg-forest-green-50">
        <div className="container mx-auto max-w-4xl">
          <FadeUp className="mb-12">
            <div className="w-10 h-0.5 bg-amber-500 mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-warm-gray-900 mb-3">
              {content.processEyebrow}
            </h2>
            <p className="font-serif text-xl sm:text-2xl leading-snug font-normal text-warm-gray-700">
              {content.processTitle}
            </p>
          </FadeUp>

          <div className="space-y-5">
            {content.steps.map((step, i) => (
              <FadeUp key={i} delay={i * 0.09}>
                <div className="flex gap-6 items-start bg-white rounded-2xl p-7 shadow-soft ring-1 ring-warm-gray-200/70">
                  <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shrink-0 text-forest-green-900 font-black text-lg font-serif">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-warm-gray-900 text-lg mb-1">
                      {String(step.title ?? '')}
                    </h3>
                    <p className="text-warm-gray-600 leading-relaxed">
                      {String(step.description ?? '')}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-6 bg-forest-green-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <FadeUp className="mb-14">
            <div className="w-10 h-0.5 bg-amber-400 mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold font-serif mb-3">
              {content.valuesEyebrow}
            </h2>
            <p className="font-serif text-xl sm:text-2xl leading-snug font-normal text-white/90">
              {content.valuesTitle}
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.values.map((value, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div className="bg-forest-green-800/60 rounded-2xl p-8 border border-forest-green-700/50 h-full">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-5">
                    <ContentIcon name={String(value.icon ?? '')} size={24} className="text-amber-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{String(value.title ?? '')}</h3>
                  <p className="text-forest-green-200 text-sm leading-relaxed">
                    {String(value.description ?? '')}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}

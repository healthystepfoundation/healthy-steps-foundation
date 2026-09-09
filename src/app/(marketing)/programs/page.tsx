import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import ProgramCard from '@/components/programs/ProgramCard';
import FadeUp from '@/components/ui/FadeUp';
import { ProgramIcon, ContentIcon } from '@/lib/icons';
import { getPrograms } from '@/lib/cms/collections';
import { getPageContent } from '@/lib/cms/content';
import { programsIndexSchema } from '@/lib/cms/pages/programs';

export const metadata: Metadata = {
  title: 'Our Programs',
  description: 'Six programs supporting families in Wakiso, Uganda: food, clothing, education, vocation, medical care, and mental health resources.',
};

export default async function ProgramsPage(): Promise<React.JSX.Element> {
  const [content, programs] = await Promise.all([
    getPageContent(programsIndexSchema),
    getPrograms(),
  ]);

  return (
    <>
      {/* Hero — full-bleed overlay */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden">
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
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-0.5 bg-amber-400 shrink-0" />
              <span className="text-amber-300 text-sm font-medium tracking-wide">
                {content.heroEyebrow}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-serif leading-[1.05] mb-6 text-white">
              {content.heroTitle}
            </h1>
            <p className="text-white/80 text-lg sm:text-xl leading-relaxed">{content.heroLead}</p>
          </div>
        </div>
      </section>

      {/* Why 6 programs — white section, not amber */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-5xl">
          <FadeUp className="mb-12">
            <div className="w-10 h-0.5 bg-amber-500 mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-warm-gray-900 mb-3">
              {content.whyEyebrow}
            </h2>
            <p className="font-serif text-xl sm:text-2xl leading-snug font-normal text-warm-gray-700">
              {content.whyTitle}
            </p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.why.map((reason, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="flex flex-col gap-4">
                  <div className="w-12 h-12 bg-forest-green-50 rounded-xl flex items-center justify-center">
                    <ContentIcon
                      name={String(reason.icon ?? '')}
                      size={22}
                      className="text-forest-green-600"
                    />
                  </div>
                  <h3 className="font-bold text-warm-gray-900 text-lg">{String(reason.label ?? '')}</h3>
                  <p className="text-warm-gray-500 text-sm leading-relaxed">
                    {String(reason.desc ?? '')}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Program Cards Grid */}
      <section className="py-20 px-6 bg-warm-white">
        <div className="container mx-auto max-w-6xl">
          <FadeUp className="mb-12">
            <div className="w-10 h-0.5 bg-amber-500 mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-warm-gray-900 mb-3">
              {content.gridEyebrow}
            </h2>
            <p className="font-serif text-xl sm:text-2xl leading-snug font-normal text-warm-gray-700 mb-4">
              {content.gridTitle}
            </p>
            <p className="text-warm-gray-500 text-lg max-w-2xl">{content.gridLead}</p>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, i) => (
              <FadeUp key={program.slug} delay={i * 0.08}>
                <ProgramCard program={program} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* How they connect */}
      <section className="py-20 px-6 bg-forest-green-50">
        <div className="container mx-auto max-w-5xl">
          <FadeUp className="mb-12">
            <div className="w-10 h-0.5 bg-amber-500 mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-warm-gray-900 mb-3">
              {content.connectEyebrow}
            </h2>
            <p className="font-serif text-xl sm:text-2xl leading-snug font-normal text-warm-gray-700 mb-4">
              {content.connectTitle}
            </p>
            <p className="text-warm-gray-500 text-lg max-w-2xl">{content.connectLead}</p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs.map((program, i) => (
              <FadeUp key={program.slug} delay={i * 0.07}>
                <Link
                  href={`/programs/${program.slug}`}
                  className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-warm-gray-100 hover:shadow-md hover:border-forest-green-200 hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 bg-forest-green-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-forest-green-100 transition-colors">
                    <ProgramIcon name={program.icon} size={20} className="text-forest-green-500" />
                  </div>
                  <span className="text-sm font-semibold text-warm-gray-800 group-hover:text-forest-green-700 leading-snug">
                    {program.name}
                  </span>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}

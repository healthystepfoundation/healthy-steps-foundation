import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import ProgramHero from '@/components/programs/ProgramHero';
import { ButtonLink } from '@/components/ui/Button';
import FadeUp from '@/components/ui/FadeUp';
import { PROGRAMS } from '@/lib/constants';
import { ProgramIcon } from '@/lib/icons';
import { getProgram, getPrograms } from '@/lib/cms/collections';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return PROGRAMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgram(slug);
  if (!program) return {};
  return {
    title: program.name,
    description: program.shortDescription,
  };
}

export default async function ProgramPage({ params }: Props): Promise<React.JSX.Element> {
  const { slug } = await params;
  const programs = await getPrograms();
  const program = programs.find((p) => p.slug === slug);
  if (!program) notFound();

  return (
    <>
      <ProgramHero program={program} />

      {/* About */}
      <section className="py-20 px-6 bg-warm-white">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Main description */}
            <FadeUp className="lg:col-span-2">
              <div className="w-10 h-0.5 bg-amber-500 mb-4" />
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-warm-gray-900 mb-3">
                About This Program
              </h2>
              <p className="font-serif text-xl sm:text-2xl leading-snug font-normal text-warm-gray-700 mb-6">
                {program.name}
              </p>
              <div className="space-y-4 text-warm-gray-600 leading-relaxed text-lg">
                {program.description.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </FadeUp>

            {/* Who We Serve sidebar */}
            <FadeUp delay={0.15}>
              <div className="bg-forest-green-50 rounded-2xl p-6 border border-forest-green-100">
                <div className="w-10 h-10 bg-forest-green-500 rounded-xl flex items-center justify-center mb-4">
                  <ProgramIcon name={program.icon} size={20} className="text-white" />
                </div>
                <h3 className="font-bold text-forest-green-900 mb-3">Who We Serve</h3>
                <p className="text-warm-gray-600 text-sm leading-relaxed">{program.whoWeServe}</p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Program photo */}
      <section className="py-20 px-6 bg-warm-white">
        <div className="container mx-auto max-w-5xl">
          <FadeUp>
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={program.image}
                alt={program.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1024px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-green-900/30 to-transparent" />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Donate CTA */}
      <section className="py-16 px-6 bg-forest-green-900 text-white">
        <div className="container mx-auto max-w-4xl">
          <FadeUp>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif mb-3">
                  Support {program.name}
                </h2>
                <p className="text-forest-green-200 leading-relaxed max-w-lg">
                  {program.donateBlurb}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <ButtonLink
                  href={`/donate?fund=${program.fund}`}
                  size="lg"
                  className="w-full whitespace-nowrap sm:w-auto"
                >
                  Donate to This Program
                </ButtonLink>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

    </>
  );
}

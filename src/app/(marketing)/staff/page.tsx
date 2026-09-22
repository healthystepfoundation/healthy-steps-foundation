import type { Metadata } from 'next';
import Image from 'next/image';
import StaffCard from '@/components/staff/StaffCard';
import FadeUp from '@/components/ui/FadeUp';
import { getPageContent } from '@/lib/cms/content';
import { sectionHidden } from '@/lib/cms/merge';
import { staffSchema } from '@/lib/cms/pages/staff';
import type { ContentItem, MediaValue } from '@/lib/cms/types';
import type { StaffMember } from '@/types';

export const metadata: Metadata = {
  title: 'Our Staff',
  description: 'Meet the dedicated team behind Healthy Steps Foundation in Wakiso, Uganda.',
};

function str(value: ContentItem[string] | undefined): string {
  return typeof value === 'string' ? value : '';
}

function toStaffMember(row: ContentItem, index: number): StaffMember {
  const photo = row.photo as MediaValue | undefined;
  return {
    id: `${index}-${str(row.name)}`,
    name: str(row.name),
    title: str(row.title),
    bio: str(row.bio),
    photo: photo?.src || undefined,
    photoAlt: photo?.alt,
  };
}

export default async function StaffPage(): Promise<React.JSX.Element> {
  const content = await getPageContent(staffSchema);
  const members = content.members.map(toStaffMember);

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
        <div className="absolute inset-0 bg-gradient-to-t from-forest-green-900/50 via-transparent to-transparent" />

        <div className="relative z-10 container mx-auto px-6 py-28">
          <div className="max-w-2xl">
            <div className="w-10 h-0.5 bg-amber-400 mb-6" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-serif leading-[1.05] mb-3 text-white">
              {content.heroEyebrow}
            </h1>
            <p className="font-serif text-xl sm:text-2xl leading-snug font-normal text-white/90 mb-6">
              {content.heroTitle}
            </p>
            <p className="text-white/80 text-lg sm:text-xl leading-relaxed">{content.heroLead}</p>
          </div>
        </div>
      </section>

      {/* Staff Grid */}
      <section className="py-20 px-6 bg-warm-white">
        <div className="container mx-auto max-w-6xl">
          <FadeUp className="mb-12">
            <div className="w-10 h-0.5 bg-amber-500 mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-warm-gray-900 mb-3">
              {content.gridEyebrow}
            </h2>
            <p className="font-serif text-xl sm:text-2xl leading-snug font-normal text-warm-gray-700">
              {content.gridTitle}
            </p>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member, i) => (
              <FadeUp key={member.id} delay={i * 0.08}>
                <StaffCard member={member} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Values strip */}
      {!sectionHidden(content, 'strip') && (
      <section className="py-16 px-6 bg-forest-green-50">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {content.strip.map((entry, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="p-6">
                  <div className="text-5xl font-black text-forest-green-600 font-serif mb-1">
                    {str(entry.number)}
                  </div>
                  <div className="font-semibold text-warm-gray-800 mb-1">{str(entry.label)}</div>
                  <div className="text-sm text-warm-gray-500">{str(entry.sub)}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Team photo */}
      {!sectionHidden(content, 'photo') && (
      <section className="py-20 px-6 bg-warm-white">
        <div className="container mx-auto max-w-5xl">
          <FadeUp>
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={content.teamImage.src}
                alt={content.teamImage.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1024px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-green-900/30 to-transparent" />
            </div>
          </FadeUp>
        </div>
      </section>
      )}

    </>
  );
}

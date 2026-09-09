import Image from 'next/image';
import { ButtonLink } from '@/components/ui/Button';
import type { ProgramView } from '@/types';

interface ProgramHeroProps {
  program: ProgramView;
}

export default function ProgramHero({ program }: ProgramHeroProps): React.JSX.Element {
  return (
    <section className="grain-overlay relative flex min-h-[70vh] items-center overflow-hidden bg-forest-green-900">
      {/* Full-bleed program photo */}
      <Image
        src={program.image}
        alt={program.imageAlt}
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
      />
      {/* Layered overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-forest-green-900/95 via-forest-green-900/75 to-forest-green-900/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-green-900/60 via-transparent to-forest-green-900/20" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-24">
        <div className="max-w-2xl">
          <h1 className="mb-6 font-serif text-4xl leading-[1.08] font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            {program.name}
          </h1>
          <p className="mb-9 max-w-xl text-lg leading-relaxed text-white/80 sm:text-xl">
            {program.shortDescription}
          </p>
          <ButtonLink href={`/donate?fund=${program.fund}`} size="lg" className="w-full sm:w-auto">
            Support This Program
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

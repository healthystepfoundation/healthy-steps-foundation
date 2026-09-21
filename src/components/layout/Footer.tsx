import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone } from 'lucide-react';
import { ORG } from '@/lib/constants';
import type { SiteContent } from '@/lib/cms/pages/site';

interface FooterProps {
  content: SiteContent;
}

export default function Footer({ content }: FooterProps): React.JSX.Element {
  return (
    <footer className="relative overflow-hidden bg-forest-green-900 text-white">
      {/* Hairline of brand colour along the very top edge */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 left-1/4 h-96 w-96 rounded-full bg-forest-green-700/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 right-0 h-80 w-80 rounded-full bg-amber-500/5 blur-3xl"
      />

      <div className="relative z-10 container mx-auto px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* Brand */}
          <div>
            <Link href="/" className="mb-5 inline-block" aria-label="Healthy Steps Foundation home">
              <div className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 shadow-lift transition-transform duration-300 hover:scale-[1.02]">
                <Image
                  src="/HSF_logo.webp"
                  alt="Healthy Steps Foundation"
                  width={200}
                  height={67}
                  className="h-14 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-forest-green-200">
              {content.footerBlurb}
            </p>
          </div>

          {/* Contact */}
          <div className="md:justify-self-end">
            <h3 className="mb-5 text-xs font-semibold tracking-[0.2em] text-white uppercase">
              {content.footerContactHeading}
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`mailto:${ORG.email}`}
                  className="flex items-start gap-3 text-sm break-all text-forest-green-200 transition-colors hover:text-amber-400"
                >
                  <Mail size={16} className="mt-0.5 shrink-0 text-amber-400" />
                  {ORG.email}
                </a>
              </li>
              {ORG.phone.map((num) => (
                <li key={num}>
                  <a
                    href={`tel:${num}`}
                    className="flex items-center gap-3 text-sm text-forest-green-200 transition-colors hover:text-amber-400"
                  >
                    <Phone size={16} className="shrink-0 text-amber-400" />
                    {num}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-forest-green-700/60 pt-8 text-sm text-forest-green-400 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {ORG.name}. All rights reserved.
          </p>
          <p className="text-center sm:text-right">{content.footerLegalRight}</p>
        </div>
      </div>
    </footer>
  );
}

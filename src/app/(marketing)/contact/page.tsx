import type { Metadata } from 'next';
import Image from 'next/image';
import { Mail, Phone, Clock } from 'lucide-react';
import { ORG } from '@/lib/constants';
import FadeUp from '@/components/ui/FadeUp';
import ContactForm from '@/components/contact/ContactForm';
import { getPageContent } from '@/lib/cms/content';
import { sectionHidden } from '@/lib/cms/merge';
import { contactSchema } from '@/lib/cms/pages/contact';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    "Get in touch with Healthy Steps Foundation in Ndejje, Wakiso, Uganda. Whether you need support, want to partner, or have a question, we'd love to hear from you.",
};

export default async function ContactPage(): Promise<React.JSX.Element> {
  const content = await getPageContent(contactSchema);

  return (
    <>
      {/* Hero — full-bleed overlay */}
      <section className="relative min-h-[65vh] flex items-center overflow-hidden">
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

        <div className="relative z-10 container mx-auto px-6 py-24">
          <div className="max-w-2xl">
            <div className="w-10 h-0.5 bg-amber-400 mb-6" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-serif leading-[1.05] mb-3 text-white">
              {content.heroEyebrow}
            </h1>
            <p className="font-serif text-xl sm:text-2xl leading-snug font-normal text-white/90 mb-6">
              {content.heroTitle}
            </p>
            <p className="text-white/80 text-lg sm:text-xl leading-relaxed max-w-xl">
              {content.heroLead}
            </p>
          </div>
        </div>
      </section>

      {/* Quick-contact strip */}
      {!sectionHidden(content, 'strip') && (
      <section className="bg-forest-green-900 border-t border-forest-green-700 py-5 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

            <a href={`mailto:${ORG.email}`} className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors">
                <Mail size={18} className="text-amber-400" />
              </div>
              <div>
                <p className="text-forest-green-400 text-xs font-semibold uppercase tracking-wide">
                  {content.stripEmailLabel}
                </p>
                <p className="text-white text-sm font-medium group-hover:text-amber-300 transition-colors break-all">
                  {ORG.email}
                </p>
              </div>
            </a>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                <Phone size={18} className="text-amber-400" />
              </div>
              <div>
                <p className="text-forest-green-400 text-xs font-semibold uppercase tracking-wide">
                  {content.stripPhoneLabel}
                </p>
                <div className="flex flex-col gap-0.5">
                  {ORG.phone.map((num) => (
                    <a
                      key={num}
                      href={`tel:${num}`}
                      className="text-white text-sm font-medium hover:text-amber-300 transition-colors"
                    >
                      {num}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                <Clock size={18} className="text-amber-400" />
              </div>
              <div>
                <p className="text-forest-green-400 text-xs font-semibold uppercase tracking-wide">
                  {content.stripResponseLabel}
                </p>
                <p className="text-white text-sm font-medium">{content.stripResponseValue}</p>
              </div>
            </div>

          </div>
        </div>
      </section>
      )}

      {/* Message form */}
      <section className="py-20 px-6 bg-warm-white">
        <div className="container mx-auto max-w-3xl">
          <FadeUp>
            <div className="w-10 h-0.5 bg-amber-500 mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-warm-gray-900 mb-3">
              {content.formEyebrow}
            </h2>
            <p className="font-serif text-xl sm:text-2xl leading-snug font-normal text-warm-gray-700 mb-2">
              {content.formTitle}
            </p>
            <p className="text-warm-gray-500 mb-8">{content.formLead}</p>
            <ContactForm />
          </FadeUp>
        </div>
      </section>
    </>
  );
}

import { icon, image, list, text, textarea, media } from '../fields';
import type { ContentItem, MediaValue, PageSchema } from '../types';

export type DonateContent = {
  heroEyebrow: string;
  heroHeadline: string;
  heroLead: string;
  heroImage: MediaValue;

  formTitle: string;
  formLead: string;

  secureTitle: string;
  secureText: string;

  questionsTitle: string;
  questionsText: string;

  trustPoints: ContentItem[];
};

const defaults: DonateContent = {
  heroEyebrow: 'Give Today',
  heroHeadline: 'Donate to Healthy Steps Foundation',
  heroLead:
    'Every gift, no matter the size, reaches a real family in Wakiso, Uganda. US donors can give by check or by SWIFT bank transfer. International donors must use SWIFT bank transfer.',
  heroImage: media(
    '/images/WhatsApp Image 2026-05-21 at 20.31.38 (2).jpeg',
    'Community members supported by Healthy Steps Foundation in Ndejje, Wakiso, Uganda',
  ),

  formTitle: 'Make Your Gift',
  formLead:
    "Choose how you'd like to give below. US donors can give by check or by SWIFT bank transfer. International donors must use SWIFT bank transfer.",

  secureTitle: 'Secure Giving',
  secureText: 'SWIFT or check. No card data is ever stored.',

  questionsTitle: 'Questions?',
  questionsText: "We're happy to help. Reach out any time.",

  trustPoints: [
    {
      icon: 'Shield',
      label: 'Secure Giving',
      desc: 'SWIFT or check. No card data is ever stored',
    },
    {
      icon: 'Heart',
      label: '100% to Families',
      desc: 'Give by check or cover the bank fee so every cent reaches those in need',
    },
    {
      icon: 'Mail',
      label: 'Confirmed in 48 hrs',
      desc: 'We acknowledge every gift personally within 2 business days',
    },
  ],
};

export const donateSchema: PageSchema<DonateContent> = {
  slug: 'donate',
  label: 'Donate',
  description: 'The donate page wording around the giving form.',
  group: 'Pages',
  path: '/donate',
  defaults,
  groups: [
    {
      id: 'hero',
      label: 'Hero',
      description: 'The full-width photo and headline at the top of the donate page.',
      fields: [
        text('heroEyebrow', 'Small label above the headline'),
        text('heroHeadline', 'Headline'),
        textarea('heroLead', 'Introduction paragraph', { rows: 4 }),
        image('heroImage', 'Background photo'),
      ],
    },
    {
      id: 'form',
      label: 'Giving form',
      description:
        'Only the wording above the form. The bank details, amounts and fee are set in the code, since they must match what the bank and the confirmation emails say.',
      fields: [
        text('formTitle', 'Heading'),
        textarea('formLead', 'Body text', { rows: 3 }),
      ],
    },
    {
      id: 'sidebar',
      label: 'Sidebar',
      fields: [
        text('secureTitle', 'Green card heading'),
        textarea('secureText', 'Green card text', { rows: 2 }),
        text('questionsTitle', 'Questions card heading'),
        textarea('questionsText', 'Questions card text', {
          rows: 2,
          help: 'The email address and phone numbers below it come from the site contact details.',
        }),
      ],
    },
    {
      id: 'trust',
      label: 'Bottom strip',
      fields: [
        list('trustPoints', 'Points', {
          itemNoun: 'point',
          titleKey: 'label',
          min: 1,
          max: 3,
          help: 'Three reads best. They sit in a single row.',
          blank: { icon: 'Shield', label: '', desc: '' },
          fields: [
            icon('icon', 'Icon'),
            text('label', 'Title'),
            textarea('desc', 'Description', { rows: 2 }),
          ],
        }),
      ],
    },
  ],
};

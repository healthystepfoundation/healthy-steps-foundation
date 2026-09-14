import { text, textarea } from '../fields';
import type { PageSchema } from '../types';

export type SiteContent = {
  footerBlurb: string;
  footerContactHeading: string;
  footerLegalRight: string;
};

const defaults: SiteContent = {
  footerBlurb:
    'An organization partnering with families in Wakiso, Uganda to improve mental health wellness through food, clothing, education, medical care and vocational skills, offered on a temporary basis.',
  footerContactHeading: 'Reach Us',
  footerLegalRight: 'Registered in Uganda · Wakiso, Central Region',
};

export const siteSchema: PageSchema<SiteContent> = {
  slug: 'site',
  label: 'Footer',
  description: 'The wording in the footer, which appears at the bottom of every page.',
  group: 'Shared across pages',
  path: '/',
  revalidateLayout: true,
  defaults,
  groups: [
    {
      id: 'footer',
      label: 'Footer',
      description:
        'The email address, phone numbers and physical address are not edited here. They also appear in donation receipts and reminder emails, so they are changed once in the code and update everywhere at the same time.',
      fields: [
        textarea('footerBlurb', 'Description under the logo', { rows: 4 }),
        text('footerContactHeading', 'Contact column heading'),
        text('footerLegalRight', 'Small print, bottom right', {
          help: 'The copyright line on the left updates its year automatically.',
        }),
      ],
    },
  ],
};

import { text } from '../fields';
import type { PageSchema } from '../types';

export type SiteContent = {
  footerContactHeading: string;
  footerLegalRight: string;
};

const defaults: SiteContent = {
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
        text('footerContactHeading', 'Contact column heading'),
        text('footerLegalRight', 'Small print, bottom right', {
          help: 'The copyright line on the left updates its year automatically.',
        }),
      ],
    },
  ],
};

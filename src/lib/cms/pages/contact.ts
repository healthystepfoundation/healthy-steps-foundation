import { image, text, textarea, media } from '../fields';
import type { MediaValue, PageSchema } from '../types';

export type ContactContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;
  heroImage: MediaValue;

  stripEmailLabel: string;
  stripPhoneLabel: string;
  stripResponseLabel: string;
  stripResponseValue: string;

  formEyebrow: string;
  formTitle: string;
  formLead: string;
};

const defaults: ContactContent = {
  heroEyebrow: 'Reach Out',
  heroTitle: 'Get in Touch',
  heroLead:
    "Whether you need support, want to partner with us, or just have a question, we'd love to hear from you. No enquiry is too small.",
  heroImage: media(
    '/images/WhatsApp%20Image%202026-05-21%20at%2020.31.38%20%2811%29.jpeg',
    'Healthy Steps Foundation staff member conducting intake with community families in Ndejje, Uganda',
  ),

  stripEmailLabel: 'Email',
  stripPhoneLabel: 'Phone',
  stripResponseLabel: 'Response Time',
  stripResponseValue: 'Within 1–2 business days',

  formEyebrow: 'Send a Message',
  formTitle: "We'd Love to Hear From You",
  formLead: "Fill in the form below and we'll get back to you as soon as we can.",
};

export const contactSchema: PageSchema<ContactContent> = {
  slug: 'contact',
  label: 'Contact',
  description: 'The contact page wording: hero, contact strip and message form.',
  group: 'Pages',
  path: '/contact',
  defaults,
  groups: [
    {
      id: 'hero',
      label: 'Hero',
      fields: [
        text('heroEyebrow', 'Heading'),
        text('heroTitle', 'Text under the heading'),
        textarea('heroLead', 'Introduction paragraph', { rows: 4 }),
        image('heroImage', 'Hero photo'),
      ],
    },
    {
      id: 'strip',
      removable: true,
      label: 'Green contact strip',
      description:
        'The email address, phone numbers and address are not edited here. They also appear in donation receipts and reminder emails, so they are changed once in the code and update everywhere at the same time.',
      fields: [
        text('stripEmailLabel', 'Email label'),
        text('stripPhoneLabel', 'Phone label'),
        text('stripResponseLabel', 'Response time label'),
        text('stripResponseValue', 'Response time value'),
      ],
    },
    {
      id: 'form',
      label: 'Message form',
      fields: [
        text('formEyebrow', 'Heading'),
        text('formTitle', 'Text under the heading'),
        textarea('formLead', 'Body text', { rows: 2 }),
      ],
    },
  ],
};

import { icon, image, list, text, textarea, media } from '../fields';
import type { ContentItem, MediaValue, PageSchema } from '../types';

export type ProgramsIndexContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;
  heroImage: MediaValue;

  whyEyebrow: string;
  whyTitle: string;
  why: ContentItem[];

  gridEyebrow: string;
  gridTitle: string;
  gridLead: string;

  connectEyebrow: string;
  connectTitle: string;
  connectLead: string;

};

const defaults: ProgramsIndexContent = {
  heroEyebrow: 'What We Do',
  heroTitle: 'Our Programs',
  heroLead:
    'Six carefully designed programs that work together to support the whole family, not just one need but every dimension of a flourishing life.',
  heroImage: media(
    '/images/WhatsApp%20Image%202026-05-21%20at%2020.31.34%20%281%29.jpeg',
    'A community member receiving a food package from Healthy Steps Foundation staff through a distribution window in Ndejje',
  ),

  whyEyebrow: 'Our Philosophy',
  whyTitle: 'Why Six Programs?',
  why: [
    {
      icon: 'Heart',
      label: 'Holistic Approach',
      desc: 'We address mental health, food, education, clothing, medical, and skills, because real change is never one-dimensional.',
    },
    {
      icon: 'Users',
      label: 'Family-Centred',
      desc: 'Every program is designed around the whole family unit. Parents, children, and elderly relatives all matter.',
    },
    {
      icon: 'ArrowRight',
      label: 'Interconnected',
      desc: 'Our programs link together. A child in tuition support also benefits from our food and resource programs.',
    },
  ],

  gridEyebrow: 'Explore',
  gridTitle: 'All Six Programs',
  gridLead:
    'Click any program to learn how it works, who it serves, and how your donation makes an impact.',

  connectEyebrow: 'The Bigger Picture',
  connectTitle: 'Programs That Work Together',
  connectLead:
    'A family enrolled in Children Tuition is also more likely to access Food Pantry support. An Adult Vocation graduate no longer needs Family Medical emergency funding. Each program strengthens the others.',

};

export const programsIndexSchema: PageSchema<ProgramsIndexContent> = {
  slug: 'programs',
  label: 'Programs (overview page)',
  description: 'The wording on the programs list page. Each program is edited separately.',
  group: 'Pages',
  path: '/programs',
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
      id: 'why',
      removable: true,
      label: 'Why six programs',
      fields: [
        text('whyEyebrow', 'Heading'),
        text('whyTitle', 'Text under the heading'),
        list('why', 'Reasons', {
          itemNoun: 'reason',
          titleKey: 'label',
          min: 1,
          max: 3,
          help: 'Three reads best. They sit in a single row.',
          blank: { icon: 'Heart', label: 'New reason', desc: '' },
          fields: [
            icon('icon', 'Icon'),
            text('label', 'Title'),
            textarea('desc', 'Description', { rows: 3 }),
          ],
        }),
      ],
    },
    {
      id: 'grid',
      label: 'Program cards',
      description: 'Only the wording here. The cards come from each program page.',
      fields: [
        text('gridEyebrow', 'Heading'),
        text('gridTitle', 'Text under the heading'),
        textarea('gridLead', 'Body text', { rows: 3 }),
      ],
    },
    {
      id: 'connect',
      removable: true,
      label: 'How they connect',
      fields: [
        text('connectEyebrow', 'Heading'),
        text('connectTitle', 'Text under the heading'),
        textarea('connectLead', 'Body text', { rows: 4 }),
      ],
    },
  ],
};

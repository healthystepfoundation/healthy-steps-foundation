import { image, list, text, textarea, media } from '../fields';
import type { ContentItem, MediaValue, PageSchema } from '../types';

export type StaffPageContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;
  heroImage: MediaValue;

  gridEyebrow: string;
  gridTitle: string;
  members: ContentItem[];

  strip: ContentItem[];

  teamImage: MediaValue;

};

const defaults: StaffPageContent = {
  heroEyebrow: 'The Team',
  heroTitle: 'Meet Our Team',
  heroLead:
    'Every member of Healthy Steps Foundation is committed to serving. Our team treats everyone like family regardless of where they live.',
  heroImage: media(
    '/images/WhatsApp%20Image%202026-05-21%20at%2020.31.38%20%2814%29.jpeg',
    'Healthy Steps Foundation staff members greeting children at a community outreach event in Ndejje, Uganda',
  ),

  gridEyebrow: 'Our People',
  gridTitle: 'Community-Rooted Leadership',
  members: [
    {
      name: 'Isaac Oyirwoth',
      title: 'Director',
      bio: 'Isaac leads Healthy Steps Foundation with a deep commitment to mental health advocacy and holistic family care. He oversees all six programs and ensures every family is served with dignity and purpose.',
      photo: media('/Picture1.jpg', 'Isaac Oyirwoth, Director of Healthy Steps Foundation'),
    },
    {
      name: 'Sharon Blue',
      title: 'Director',
      bio: 'Sharon co-directs the foundation, bringing vision and faith-grounded leadership to the work. She champions the holistic model that connects mental wellness with food security, education, and community support.',
      photo: media('/Picture4.jpg', 'Sharon Blue, Director of Healthy Steps Foundation'),
    },
    {
      name: 'Pius Olockywinu',
      title: 'Secretary',
      bio: 'Pius keeps the foundation running with care and precision, managing communications, records, and day-to-day coordination so the team can focus entirely on the families they serve.',
      photo: media('/Picture3.jpg', 'Pius Olockywinu, Secretary of Healthy Steps Foundation'),
    },
  ],

  strip: [
    { number: '100%', label: 'Community-Based', sub: 'Our team is committed' },
    { number: '6', label: 'Programs Managed', sub: 'Every Program has purpose' },
    { number: '5+', label: 'Languages Spoken', sub: 'Luganda, English & local dialects' },
  ],

  teamImage: media(
    '/images/WhatsApp%20Image%202026-05-21%20at%2020.31.38%20%2813%29.jpeg',
    'Healthy Steps Foundation staff members with community children at an outreach event in Ndejje',
  ),

};

export const staffSchema: PageSchema<StaffPageContent> = {
  slug: 'staff',
  label: 'Our Staff',
  group: 'Pages',
  description: 'Team members, their photos and bios, plus the team page copy.',
  path: '/staff',
  defaults,
  groups: [
    {
      id: 'hero',
      label: 'Hero',
      fields: [
        text('heroEyebrow', 'Small label above the heading'),
        text('heroTitle', 'Heading'),
        textarea('heroLead', 'Introduction paragraph', { rows: 4 }),
        image('heroImage', 'Hero photo'),
      ],
    },
    {
      id: 'members',
      label: 'Team members',
      description: 'The cards of people. Add, remove and reorder them here.',
      fields: [
        text('gridEyebrow', 'Heading'),
        text('gridTitle', 'Text under the heading'),
        list('members', 'Team members', {
          itemNoun: 'team member',
          titleKey: 'name',
          min: 1,
          help: 'Cards lay out in rows of three. Portrait photos crop best; the card is square and anchored to the top of the image.',
          blank: { name: 'New team member', title: '', bio: '', photo: { src: '', alt: '' } },
          fields: [
            text('name', 'Full name'),
            text('title', 'Role', { placeholder: 'e.g. Director' }),
            textarea('bio', 'Short bio', { rows: 5 }),
            image('photo', 'Photo', { help: 'Leave empty to show their initials instead.' }),
          ],
        }),
      ],
    },
    {
      id: 'strip',
      label: 'Numbers strip',
      description: 'The three large green numbers under the team cards.',
      fields: [
        list('strip', 'Numbers', {
          itemNoun: 'number',
          titleKey: 'label',
          min: 1,
          max: 3,
          help: 'Three reads best. They sit in a single row.',
          blank: { number: '', label: '', sub: '' },
          fields: [
            text('number', 'Large number', { placeholder: 'e.g. 100%' }),
            text('label', 'Label'),
            text('sub', 'Small print underneath'),
          ],
        }),
      ],
    },
    {
      id: 'photo',
      label: 'Team photo',
      fields: [image('teamImage', 'Wide team photo')],
    },
  ],
};

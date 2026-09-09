import { text, textarea } from '../fields';
import type { PageSchema } from '../types';

export type StoriesContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;

  gridEyebrow: string;
  gridTitle: string;

  moreTitle: string;
  moreText: string;

  programsEyebrow: string;
  programsTitle: string;
  programsLead: string;

};

const defaults: StoriesContent = {
  heroEyebrow: 'Impact Stories',
  heroTitle: 'Real Families, Real Change',
  heroLead:
    'Behind every program is a family with a story. Here are a few of the lives touched by Healthy Steps Foundation, told with permission and shared with dignity.',

  gridEyebrow: 'Community Voices',
  gridTitle: 'Stories from the Community',

  moreTitle: 'More Stories Coming Soon',
  moreText:
    'Every family we serve has a story worth telling. As we collect more testimonials from the community, we will share them here, always with full permission and always with dignity and care.',

  programsEyebrow: 'Where Change Happens',
  programsTitle: 'Six Programs, Countless Stories',
  programsLead:
    "Each story comes from one of our six holistic programs. Together, they address every dimension of a family's wellbeing.",
};

export const storiesSchema: PageSchema<StoriesContent> = {
  slug: 'stories',
  label: 'Stories',
  description: 'The Stories page wording. The quotes themselves are under Testimonials.',
  group: 'Pages',
  path: '/stories',
  defaults,
  groups: [
    {
      id: 'hero',
      label: 'Hero',
      fields: [
        text('heroEyebrow', 'Small label above the heading'),
        text('heroTitle', 'Heading'),
        textarea('heroLead', 'Introduction paragraph', { rows: 4 }),
      ],
    },
    {
      id: 'grid',
      label: 'Stories section',
      description: 'The quotes shown here are edited under Testimonials.',
      fields: [
        text('gridEyebrow', 'Heading'),
        text('gridTitle', 'Text under the heading'),
        text('moreTitle', 'Green box heading'),
        textarea('moreText', 'Green box text', { rows: 4 }),
      ],
    },
    {
      id: 'programs',
      label: 'Programs section',
      fields: [
        text('programsEyebrow', 'Heading'),
        text('programsTitle', 'Text under the heading'),
        textarea('programsLead', 'Body text', { rows: 3 }),
      ],
    },
  ],
};

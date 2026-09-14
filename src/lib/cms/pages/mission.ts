import { icon, image, list, text, textarea, media } from '../fields';
import type { ContentItem, MediaValue, PageSchema } from '../types';

export type MissionContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;
  heroImage: MediaValue;

  missionEyebrow: string;
  missionTitle: string;
  missionText: string;
  missionQuote: string;

  visionEyebrow: string;
  visionTitle: string;
  visionText: string;

  modelEyebrow: string;
  modelTitle: string;
  modelLead: string;
  dimensions: ContentItem[];

  frameworkEyebrow: string;
  frameworkTitle: string;
  frameworkLead: string;
  framework: ContentItem[];

  principlesEyebrow: string;
  principlesTitle: string;
  principles: ContentItem[];

};

const defaults: MissionContent = {
  heroEyebrow: 'Why We Exist',
  heroTitle: 'Our Mission',
  heroLead:
    'A faith-based approach to mental health wellness, partnering with families in Uganda to address the temporary insecurities that prevent people from flourishing.',
  heroImage: media(
    '/images/WhatsApp%20Image%202026-05-21%20at%2020.31.36%20%281%29.jpeg',
    'A Healthy Steps Foundation staff member sharing an embrace with a child in Ndejje, Uganda',
  ),

  missionEyebrow: 'Mission Statement',
  missionTitle: 'What We Are Called to Do',
  missionText:
    'To be a bridge to improved mental health wellness through partnerships with families, educators, medical professionals, church, government, and local leaders. To establish relationships with the communities we serve and provide tailored programs for those suffering from mental health challenges in a respectful and dignified manner.',
  missionQuote:
    'We believe that mental health cannot be separated from the physical, economic, and spiritual realities of everyday life. True wellness requires all of these to be addressed together.',

  visionEyebrow: 'Vision Statement',
  visionTitle: 'What We Are Working Toward',
  visionText:
    'A Uganda where every individual, family, and community has access to mental health wellness resources regardless of their income, circumstances, or background.',

  modelEyebrow: 'Our Approach',
  modelTitle: 'Holistic Care for Temporary Crises',
  modelLead:
    'We recognise that the short-term, temporary insecurities families face (food, clothing, medical emergencies, school fees) are not separate from their mental health. They are the same crisis, experienced in different dimensions. Our six programs work together to address all of them.',
  dimensions: [
    { label: 'Spiritual', desc: 'Faith-grounded support that honours the whole person' },
    { label: 'Mental', desc: 'Resources and care for mental health and emotional wellness' },
    { label: 'Physical', desc: 'Food, clothing, and medical care to meet bodily needs' },
    { label: 'Economic', desc: 'Vocational training to build sustainable household income' },
    { label: 'Educational', desc: 'Keeping children in school through tuition support' },
    { label: 'Relational', desc: 'Walking with families, not doing things for them' },
  ],

  frameworkEyebrow: 'Our Framework',
  frameworkTitle: 'How We Build Emotional Resilience',
  frameworkLead:
    'With love and compassion for individuals, families, and communities, we draw on a framework used by professionals and wellness advocates: the 5 Cs of resilience.',
  framework: [
    {
      label: 'Connection',
      desc: 'Nurturing meaningful relationships and a sense of belonging to reduce stress and combat isolation.',
    },
    {
      label: 'Compassion',
      desc: 'Practising empathy, kindness, and forgiveness for self and others.',
    },
    {
      label: 'Coping',
      desc: 'Using healthy, proactive strategies, like mindfulness, journaling, or exercise, to process emotions.',
    },
    {
      label: 'Community',
      desc: 'Engaging with groups, sharing interests, and giving back to feel part of something larger than yourself.',
    },
    {
      label: 'Care',
      desc: 'Prioritising daily self-care and recognising when it is time to get professional support.',
    },
  ],

  principlesEyebrow: 'How We Work',
  principlesTitle: 'The Principles That Guide Us',
  principles: [
    {
      icon: 'BookOpen',
      title: 'Faith-Grounded',
      description:
        'Our work flows from a conviction that every person is made with inherent worth. Faith is not a footnote; it shapes how we serve, how we listen, and how we walk alongside families in crisis.',
    },
    {
      icon: 'Users',
      title: 'Partnership, Not Charity',
      description:
        'We partner with families rather than doing things for them. Every family we serve has strengths, agency, and the capacity to move forward; our role is to come alongside them, not to lead from above.',
    },
    {
      icon: 'Heart',
      title: 'Holistic by Design',
      description:
        "Mental wellness cannot be isolated from hunger, illness, or lack of education. Our six programs work together to address the whole family, because a person's wellbeing is more than any one need.",
    },
    {
      icon: 'Shield',
      title: 'Dignity in Every Interaction',
      description:
        'No family should feel shame for needing help. Our processes are designed to be respectful, private, and honoring, from how we assess needs to how we distribute support.',
    },
    {
      icon: 'Target',
      title: 'As-Needed, Not Dependency',
      description:
        'We provide emergency support through temporary crises, not long-term welfare. Our goal is always to help families stabilise and become self-sufficient, then step back as they move forward.',
    },
    {
      icon: 'Eye',
      title: 'Transparency & Trust',
      description:
        'We are accountable to the families we serve, to our donors, and to our community. We handle every resource entrusted to us with care, honesty, and integrity.',
    },
  ],

};

export const missionSchema: PageSchema<MissionContent> = {
  slug: 'mission',
  label: 'Our Mission',
  description: 'Mission and vision statements, the holistic model, and the guiding principles.',
  group: 'Pages',
  path: '/mission',
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
      id: 'mission',
      label: 'Mission statement',
      fields: [
        text('missionEyebrow', 'Heading'),
        text('missionTitle', 'Text under the heading'),
        textarea('missionText', 'Mission statement', { rows: 6 }),
        textarea('missionQuote', 'Pull quote', {
          rows: 5,
          help: 'The green box beside it. Quotation marks are added automatically.',
        }),
      ],
    },
    {
      id: 'vision',
      label: 'Vision statement',
      fields: [
        text('visionEyebrow', 'Heading'),
        text('visionTitle', 'Text under the heading'),
        textarea('visionText', 'Vision statement', { rows: 4 }),
      ],
    },
    {
      id: 'model',
      label: 'Holistic model',
      fields: [
        text('modelEyebrow', 'Heading'),
        text('modelTitle', 'Text under the heading'),
        textarea('modelLead', 'Body text', { rows: 5 }),
        list('dimensions', 'Dimension cards', {
          itemNoun: 'dimension',
          titleKey: 'label',
          min: 1,
          help: 'These lay out in rows of three.',
          blank: { label: 'New dimension', desc: '' },
          fields: [text('label', 'Label'), textarea('desc', 'Description', { rows: 3 })],
        }),
      ],
    },
    {
      id: 'framework',
      label: 'Resilience framework',
      fields: [
        text('frameworkEyebrow', 'Heading'),
        text('frameworkTitle', 'Text under the heading'),
        textarea('frameworkLead', 'Body text', { rows: 4 }),
        list('framework', 'Framework cards', {
          itemNoun: 'element',
          titleKey: 'label',
          min: 1,
          max: 5,
          help: 'Five reads best. They sit in a single row on a wide screen.',
          blank: { label: 'New element', desc: '' },
          fields: [text('label', 'Label'), textarea('desc', 'Description', { rows: 3 })],
        }),
      ],
    },
    {
      id: 'principles',
      label: 'Guiding principles',
      description: 'The dark green section of cards.',
      fields: [
        text('principlesEyebrow', 'Heading'),
        text('principlesTitle', 'Text under the heading'),
        list('principles', 'Principle cards', {
          itemNoun: 'principle',
          titleKey: 'title',
          min: 1,
          help: 'These lay out in rows of three, so three or six reads best.',
          blank: { icon: 'Heart', title: 'New principle', description: '' },
          fields: [
            icon('icon', 'Icon'),
            text('title', 'Title'),
            textarea('description', 'Description', { rows: 4 }),
          ],
        }),
      ],
    },
  ],
};

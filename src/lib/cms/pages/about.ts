import { icon, image, list, strings, text, textarea, media } from '../fields';
import type { ContentItem, MediaValue, PageSchema } from '../types';

export type AboutContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;
  heroImage: MediaValue;

  storyEyebrow: string;
  storyTitle: string;
  storyParagraphs: string[];
  storyImage: MediaValue;

  purposeEyebrow: string;
  visionTitle: string;
  visionText: string;
  missionTitle: string;
  missionText: string;

  whoEyebrow: string;
  whoTitle: string;
  whoParagraphs: string[];
  eligibilityHeading: string;
  eligibility: string[];

  processEyebrow: string;
  processTitle: string;
  steps: ContentItem[];

  valuesEyebrow: string;
  valuesTitle: string;
  values: ContentItem[];

};

const defaults: AboutContent = {
  heroEyebrow: 'Who We Are',
  heroTitle: 'About Us',
  heroLead:
    'We partner with families across Wakiso, Uganda, to provide holistic mental health support and resources needed to build healthy, whole, and hopeful lives on a temporary basis.',
  heroImage: media(
    '/images/field/mother-child.jpg',
    'A Healthy Steps Foundation worker speaking with a mother carrying her baby at a community outreach in Wakiso, Uganda',
  ),

  storyEyebrow: 'Our Story',
  storyTitle: "Born from a Community's Need",
  storyParagraphs: [
    "Healthy Steps Foundation was born from a deep conviction: that mental health wellness cannot be separated from food on the table, clothes on a child's back, or a parent's ability to earn a living. Families in the surrounding communities are faced with many insecurities. When these insecurities are left unaddressed this leads to permanent burdens on their mental and spiritual well-being.",
    'Rooted in faith and guided by a commitment to serve, we desire to partner with families to teach them new techniques and skills with measurable and lasting outcomes. Our model is holistic, therefore, our goal is to walk alongside those we serve during the most challenging times.',
    'Today, Healthy Steps Foundation runs six integrated programs. We are a community-focused organisation with a heart to serve neighbors as if they were our families.',
  ],
  storyImage: media(
    '/images/field/connection.jpg',
    'A Healthy Steps Foundation volunteer speaking warmly with a woman receiving a food package in Wakiso',
  ),

  purposeEyebrow: 'Our Purpose',
  visionTitle: 'Our Vision',
  visionText:
    'A Uganda where every individual, family, and community has access to mental health wellness resources regardless of their income, circumstances, or background.',
  missionTitle: 'Our Mission',
  missionText:
    'To be a bridge to improved mental health wellness through partnerships with families, educators, medical professionals, church, government, and local leaders. To establish relationships with the communities we serve and provide tailored programs for those suffering from mental health challenges in a respectful and dignified manner.',

  whoEyebrow: 'Who We Serve',
  whoTitle: 'Families in Temporary Crisis',
  whoParagraphs: [
    'We support families who are facing short-term hardship that threatens their mental, physical, or economic wellbeing, on an emergency, temporary basis.',
    'We are not a long-term welfare programme. We help families through their crisis period, providing the specific support they need when they need it, so they can stabilise and move forward with dignity and self-sufficiency.',
    'Healthy Steps Foundation is not a medical organization and does not operate a medical treatment facility. Through committed partnerships with spiritual leaders, volunteer mental health professionals, and local clinics, we connect families to the right resources, respectfully and confidentially.',
  ],
  eligibilityHeading: 'We can help if your family is facing:',
  eligibility: [
    'Food insecurity or hunger in the household',
    'Inability to pay school fees for a child',
    'Lack of basic clothing for family members',
    'A medical emergency with no means to pay',
    'Economic hardship affecting mental health',
    'Need for vocational skills to earn income',
    'Need for mental wellness or spiritual counseling',
  ],

  processEyebrow: 'How We Serve',
  processTitle: 'How It Works',
  steps: [
    {
      title: 'Reach Out',
      description:
        'Call us or email us. There is no complicated application; we respond to need. Urgent cases receive same-day attention.',
    },
    {
      title: 'Compassionate Conversation',
      description:
        "We listen to understand your family's situation. Every conversation is private, judgment-free, and respectful of your dignity from the very first interaction.",
    },
    {
      title: 'Tailored Support',
      description:
        'We match your family with the right program or combination of programs for your specific need: food, clothing, school fees, medical care, and more.',
    },
    {
      title: 'Follow-Up & Stability',
      description:
        'We check in to ensure your situation is stabilising and connect you with other resources as needed, walking alongside you through your crisis period.',
    },
  ],

  valuesEyebrow: 'What Guides Us',
  valuesTitle: 'Our Core Values',
  values: [
    {
      icon: 'BookOpen',
      title: 'Faith-Based',
      description:
        'We are guided by spiritual principles in everything we do. Our faith shapes how we serve, with humility, compassion, and an unshakeable belief in the dignity of every person.',
    },
    {
      icon: 'Users',
      title: 'Partnership',
      description:
        'Every family we serve is a partner in their own healing; we walk with them, not ahead of them.',
    },
    {
      icon: 'Shield',
      title: 'Dignity & Respect',
      description:
        'Every individual deserves to be treated with honour. We ensure our support never diminishes the worth of those we serve, no matter their circumstance.',
    },
    {
      icon: 'Heart',
      title: 'Holistic Wellness',
      description:
        "We address mental, physical, and spiritual health together. True wellness cannot be achieved by treating only one dimension of a person's life.",
    },
    {
      icon: 'Target',
      title: 'Community',
      description:
        'We seek to build stronger families together. We are friends and neighbors committed to changing and improving lives for the betterment of the community.',
    },
    {
      icon: 'Eye',
      title: 'Integrity',
      description:
        'We are transparent with our donors, partners, and the families we serve. Trust is the foundation of everything we do, and we protect it carefully.',
    },
  ],

};

export const aboutSchema: PageSchema<AboutContent> = {
  slug: 'about',
  label: 'About Us',
  group: 'Pages',
  description: 'Our story, vision and mission, who we serve, how we serve, and the six core values.',
  path: '/about',
  defaults,
  groups: [
    {
      id: 'hero',
      label: 'Hero',
      description: 'The green panel and photo at the very top of the page.',
      fields: [
        text('heroEyebrow', 'Small label above the heading'),
        text('heroTitle', 'Heading'),
        textarea('heroLead', 'Introduction paragraph', { rows: 5 }),
        image('heroImage', 'Hero photo'),
      ],
    },
    {
      id: 'story',
      label: 'Our Story',
      fields: [
        text('storyEyebrow', 'Heading'),
        text('storyTitle', 'Text under the heading'),
        strings('storyParagraphs', 'Body text', 'paragraph', {
          help: 'Each entry becomes its own paragraph on the page.',
        }),
        image('storyImage', 'Photo'),
      ],
    },
    {
      id: 'purpose',
      label: 'Vision & Mission',
      description: 'The two white cards side by side.',
      fields: [
        text('purposeEyebrow', 'Small label above the cards'),
        text('visionTitle', 'Left card heading'),
        textarea('visionText', 'Left card text', { rows: 5 }),
        text('missionTitle', 'Right card heading'),
        textarea('missionText', 'Right card text', { rows: 6 }),
      ],
    },
    {
      id: 'who',
      label: 'Who We Serve',
      fields: [
        text('whoEyebrow', 'Heading'),
        text('whoTitle', 'Text under the heading'),
        strings('whoParagraphs', 'Body text', 'paragraph'),
        text('eligibilityHeading', 'Checklist heading'),
        strings('eligibility', 'Checklist items', 'item', { input: 'text' }),
      ],
    },
    {
      id: 'process',
      label: 'How We Serve',
      description: 'Numbering follows the order here automatically.',
      fields: [
        text('processEyebrow', 'Heading'),
        text('processTitle', 'Text under the heading'),
        list('steps', 'Steps', {
          itemNoun: 'step',
          titleKey: 'title',
          min: 1,
          blank: { title: 'New step', description: '' },
          fields: [text('title', 'Step title'), textarea('description', 'Description', { rows: 4 })],
        }),
      ],
    },
    {
      id: 'values',
      label: 'Our Core Values',
      description: 'The dark green section of value cards.',
      fields: [
        text('valuesEyebrow', 'Heading'),
        text('valuesTitle', 'Text under the heading'),
        list('values', 'Value cards', {
          itemNoun: 'value',
          titleKey: 'title',
          min: 1,
          help: 'The cards lay out in rows of three, so three or six reads best.',
          blank: { icon: 'Heart', title: 'New value', description: '' },
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

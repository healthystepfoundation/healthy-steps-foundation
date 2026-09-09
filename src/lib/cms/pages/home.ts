import { image, list, strings, text, textarea, video, media } from '../fields';
import type { ContentItem, MediaValue, PageSchema } from '../types';

export type HomeContent = {
  heroHeadline: string;
  heroLead: string;
  heroDonateLabel: string;
  heroDonateHref: string;
  heroTrustPoints: string[];
  heroImage: MediaValue;

  statsEyebrow: string;
  statsTitle: string;
  stats: ContentItem[];
  statsImage: MediaValue;

  videoEyebrow: string;
  videoTitle: string;
  videoLead: string;
  videoFile: MediaValue;
  videoPoster: MediaValue;
  videoCaptionTitle: string;
  videoCaptionMeta: string;

  galleryPhotos: ContentItem[];
};

const defaults: HomeContent = {
  heroHeadline: 'Every Family Deserves to Be Whole',
  heroLead:
    'A faith-based organization partnering with families in Uganda to improve mental health wellness, providing holistic support across food, clothing, education, medical care, and vocational skills on a temporary basis.',
  heroDonateLabel: 'Donate Now',
  heroDonateHref: '/donate',
  heroTrustPoints: [
    'Faith-grounded',
    'Community-led',
    'Holistic family support',
    'Temporary emergency support',
  ],
  heroImage: media(
    '/images/field/food-relief-handoff.jpg',
    'A Healthy Steps Foundation volunteer handing a food relief bag to a community member in Wakiso, Uganda',
  ),

  statsEyebrow: 'Our Impact',
  statsTitle: 'Real numbers.\nReal families.',
  stats: [
    { value: '1200', suffix: '+', label: 'Families Served' },
    { value: '6', suffix: '', label: 'Active Programs' },
    { value: '500', suffix: '+', label: 'Children in School' },
    { value: '3', suffix: '+', label: 'Years of Service' },
  ],
  statsImage: media(
    '/images/field/beneficiaries-women.jpg',
    'Three women smiling with their Healthy Steps Foundation food packages in Wakiso, Uganda',
  ),

  videoEyebrow: 'Videos and Pictures',
  videoTitle: 'See Healthy Steps in the Field',
  videoLead:
    'Filmed during our June outreach in Wakiso: food packages, medical care, and mental wellness support reaching families, one healthy step at a time.',
  videoFile: media('/outreach-june.mp4', ''),
  videoPoster: media(
    '/images/field/video-poster.jpg',
    'A young woman smiling as she carries a Healthy Steps Foundation food package during the June outreach in Wakiso, Uganda',
  ),
  videoCaptionTitle: 'June Community Outreach',
  videoCaptionMeta: 'Wakiso, Uganda · 1:44',

  galleryPhotos: [
    {
      photo: media(
        '/images/field/connection.jpg',
        'A Healthy Steps volunteer speaking warmly with a woman receiving a food package',
      ),
    },
    {
      photo: media(
        '/images/field/beneficiaries-women.jpg',
        'Three women smiling with their Healthy Steps food packages in Wakiso',
      ),
    },
    {
      photo: media(
        '/images/field/team-joy.jpg',
        'Two Healthy Steps Foundation team members laughing in branded shirts',
      ),
    },
    {
      photo: media(
        '/images/field/food-packages.jpg',
        'Food packages branded with the Healthy Steps Foundation logo',
      ),
    },
    {
      photo: media(
        '/images/field/counseling-circle.jpg',
        'A mental wellness counselling circle during a Healthy Steps outreach',
      ),
    },
    {
      photo: media(
        '/images/field/distribution-handover.jpg',
        'A Healthy Steps team member handing a food package to a community member',
      ),
    },
    {
      photo: media(
        '/images/field/medical-intake.jpg',
        'Healthy Steps staff running a medical intake table with hand sanitiser and gloves',
      ),
    },
  ],
};

export const homeSchema: PageSchema<HomeContent> = {
  slug: 'home',
  label: 'Homepage',
  group: 'Pages',
  description: 'Hero, impact numbers, video and photo gallery.',
  path: '/',
  defaults,
  groups: [
    {
      id: 'hero',
      label: 'Hero',
      description: 'The full-screen photo and headline at the top.',
      fields: [
        text('heroHeadline', 'Headline'),
        textarea('heroLead', 'Introduction paragraph', { rows: 5 }),
        text('heroDonateLabel', 'Main button label'),
        text('heroDonateHref', 'Main button link'),
        strings('heroTrustPoints', 'Small tags', 'tag', { input: 'text' }),
        image('heroImage', 'Background photo'),
      ],
    },
    {
      id: 'stats',
      label: 'Impact numbers',
      fields: [
        text('statsEyebrow', 'Heading'),
        textarea('statsTitle', 'Text under the heading', {
          rows: 2,
          help: 'Shown below the heading, smaller and not bold. Press Enter to break it onto a second line.',
        }),
        list('stats', 'The numbers', {
          itemNoun: 'number',
          titleKey: 'label',
          min: 1,
          max: 4,
          help: 'Four reads best. They sit in a 2×2 grid. Plain digits count up on scroll; anything else is shown as written.',
          blank: { value: '', suffix: '', label: '' },
          fields: [
            text('value', 'Number', { placeholder: 'e.g. 1200' }),
            text('suffix', 'After the number', { placeholder: 'e.g. +' }),
            text('label', 'What it counts', { placeholder: 'e.g. Families Served' }),
          ],
        }),
        image('statsImage', 'Photo'),
      ],
    },
    {
      id: 'video',
      label: 'Video',
      fields: [
        text('videoEyebrow', 'Heading'),
        text('videoTitle', 'Text under the heading', {
          help: 'Shown below the heading, smaller and not bold.',
        }),
        textarea('videoLead', 'Body text', { rows: 4 }),
        video('videoFile', 'Video file'),
        image('videoPoster', 'Still image shown before play'),
        text('videoCaptionTitle', 'Caption on the video'),
        text('videoCaptionMeta', 'Caption small print', { placeholder: 'e.g. Wakiso, Uganda · 1:44' }),
      ],
    },
    {
      id: 'gallery',
      label: 'Photo gallery',
      description: 'The photo mosaic shown with the video in the Videos and Pictures section.',
      fields: [
        list('galleryPhotos', 'Photos', {
          itemNoun: 'photo',
          titleKey: 'size',
          min: 1,
          help: 'Photos appear as equal-sized tiles in the order listed. Visitors tap a photo to see it full size.',
          blank: { photo: { src: '', alt: '' } },
          fields: [image('photo', 'Photo')],
        }),
      ],
    },
  ],
};

import { image, list, strings, text, textarea, media } from '../fields';
import type { ContentItem, PageSchema } from '../types';
import { NEWS_UPDATES } from '@/lib/constants';

export type NewsContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;

  posts: ContentItem[];
  salutation: string;
  signOffPrefix: string;

  earlierHeading: string;

  giveEyebrow: string;
  giveTitle: string;
  giveOnlineTitle: string;
  giveOnlineText: string;
  giveCheckTitle: string;
  giveCheckIntro: string;

  ctaEyebrow: string;
  ctaTitle: string;
  ctaLead: string;
  ctaEmailLabel: string;
  ctaPhoneLabel: string;
};

const defaults: NewsContent = {
  heroEyebrow: 'Foundation News',
  heroTitle: 'Updates from Healthy Steps Foundation',
  heroLead:
    'Recent events, fundraising news, and what is next for the families we serve in Ndejje, Uganda.',

  posts: NEWS_UPDATES.map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    image: media(
      post.image,
      'Healthy Steps Foundation volunteers distributing staple food bags in Kampala, Uganda',
    ),
    body: post.body,
    signOffName: post.signOff.name,
    signOffTitle: post.signOff.title,
  })),
  salutation: 'Dear Friends,',
  signOffPrefix: 'Gratefully,',

  earlierHeading: 'Earlier Updates',

  giveEyebrow: 'Give in Response',
  giveTitle: 'Support the Next Outreach',
  giveOnlineTitle: 'Give Online',
  giveOnlineText:
    "Donate by SWIFT bank transfer directly to Healthy Steps Foundation's dfcu Bank account.",
  giveCheckTitle: 'Give by Check',
  giveCheckIntro: 'Make checks payable to',

  ctaEyebrow: 'Stay Connected',
  ctaTitle: 'Have Questions About an Event?',
  ctaLead:
    'Reach out any time. We would love to share more about what your prayers and donations make possible.',
  ctaEmailLabel: 'Email Us',
  ctaPhoneLabel: 'Call Us',
};

export const newsSchema: PageSchema<NewsContent> = {
  slug: 'news',
  label: 'News',
  description: 'The newsletter updates page, and the posts themselves.',
  group: 'Pages',
  path: '/news',
  defaults,
  groups: [
    {
      id: 'hero',
      label: 'Hero',
      description: 'The photo behind the hero comes from the newest post below.',
      fields: [
        text('heroEyebrow', 'Small label above the heading'),
        textarea('heroTitle', 'Heading', { rows: 2 }),
        textarea('heroLead', 'Introduction paragraph', { rows: 3 }),
      ],
    },
    {
      id: 'posts',
      label: 'Updates',
      description:
        'The newest post is shown in full as a letter; any others are listed underneath as short summaries.',
      fields: [
        list('posts', 'Posts', {
          itemNoun: 'update',
          titleKey: 'title',
          min: 1,
          help: 'Put the newest first. The one at the top is the one shown in full.',
          blank: {
            slug: '',
            title: 'New update',
            date: '',
            excerpt: '',
            image: { src: '', alt: '' },
            body: [''],
            signOffName: '',
            signOffTitle: '',
          },
          fields: [
            text('title', 'Title'),
            text('date', 'Date', {
              placeholder: '2026-06-13',
              help: 'Year first, then month, then day, for example 2026-06-13 for 13 June 2026.',
            }),
            textarea('excerpt', 'Short summary', {
              rows: 3,
              help: 'Shown in the list of earlier updates.',
            }),
            image('image', 'Photo'),
            strings('body', 'Letter text', 'paragraph'),
            text('signOffName', 'Signed by (name)'),
            text('signOffTitle', 'Signed by (role)'),
            text('slug', 'Internal reference', {
              help: 'A short unique name used behind the scenes. Letters, numbers and dashes.',
            }),
          ],
        }),
        text('salutation', 'Opening greeting', { placeholder: 'Dear Friends,' }),
        text('signOffPrefix', 'Closing word', { placeholder: 'Gratefully,' }),
        text('earlierHeading', 'Heading above the older updates'),
      ],
    },
    {
      id: 'give',
      label: 'Give in response',
      description: 'The two white cards. Bank and mailing details come from the Donate page.',
      fields: [
        text('giveEyebrow', 'Heading'),
        text('giveTitle', 'Text under the heading'),
        text('giveOnlineTitle', 'First card heading'),
        textarea('giveOnlineText', 'First card text', { rows: 3 }),
        text('giveCheckTitle', 'Second card heading'),
        text('giveCheckIntro', 'Second card opening words', {
          help: 'The payable-to name, memo line and address follow automatically.',
        }),
      ],
    },
    {
      id: 'cta',
      label: 'Closing call to action',
      fields: [
        text('ctaEyebrow', 'Heading'),
        textarea('ctaTitle', 'Text under the heading', { rows: 2 }),
        textarea('ctaLead', 'Body text', { rows: 3 }),
        text('ctaEmailLabel', 'Email button label'),
        text('ctaPhoneLabel', 'Phone button label'),
      ],
    },
  ],
};

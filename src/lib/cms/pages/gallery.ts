import { image, list, text, textarea, video, media } from '../fields';
import type { ContentItem, ListField, MediaValue, PageSchema } from '../types';

/**
 * The Gallery page: one "chapter" per outreach, each a video plus a photo grid.
 *
 * The two chapters are fixed slots rather than a list of events because a list
 * row cannot hold a list of its own (the editor's lists are one level deep). To
 * feature a newer outreach, staff overwrite the first slot and move the older
 * one down; adding a third slot is a small developer change in this file and
 * `gallery/page.tsx`.
 */
export type GalleryContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;
  heroImage: MediaValue;

  event1Title: string;
  event1Date: string;
  event1Place: string;
  event1Text: string;
  event1Video: MediaValue;
  event1Poster: MediaValue;
  event1VideoCaption: string;
  event1Photos: ContentItem[];

  event2Title: string;
  event2Date: string;
  event2Place: string;
  event2Text: string;
  event2Video: MediaValue;
  event2Poster: MediaValue;
  event2VideoCaption: string;
  event2Photos: ContentItem[];
};

const HV = '/images/events/2026-10-10-humble-vessel';
const UW = '/images/events/2026-10-03-ujumbe-wa-upendo';

function photos(entries: [string, string][]): ContentItem[] {
  return entries.map(([src, alt]) => ({ photo: media(src, alt) }));
}

const defaults: GalleryContent = {
  heroEyebrow: 'Gallery',
  heroTitle: 'Moments from our outreaches',
  heroLead:
    'Photographs and video from our time with families and children in Uganda. Tap any photo to see it full size.',
  heroImage: media(
    `${HV}/girls-celebrate.jpg`,
    'Girls in school uniform raising their new gift bags in celebration at the Healthy Steps back-to-school outreach',
  ),

  event1Title: 'Back to School at Humble Vessel Medical Center',
  event1Date: '2026-10-10',
  event1Place: 'Humble Vessel Medical Center',
  event1Text:
    'The second of our three back-to-school outreaches was held with Humble Vessel Medical Center. Children went home with new backpacks, families received blankets and gift bags, the medical team spoke with mothers, and volunteers braided hair.',
  event1Video: media('/videos/outreach-2026-10-10-humble-vessel.mp4', ''),
  event1Poster: media(
    `${HV}/boy-backpack-thumbs-up.jpg`,
    'A smiling boy giving a thumbs up while holding his new black backpack',
  ),
  event1VideoCaption: 'Humble Vessel outreach · 1:00',
  event1Photos: photos([
    [`${HV}/humble-vessel-sign.jpg`, 'A mother holding her toddler and giving a thumbs up in front of the Humble Vessel Medical Center sign'],
    [`${HV}/boy-backpack-thumbs-up.jpg`, 'A smiling boy giving a thumbs up while holding his new black backpack'],
    [`${HV}/blanket-mother-daughter.jpg`, 'A mother smiling at her young daughter as she holds a new yellow blanket'],
    [`${HV}/mothers-clapping.jpg`, 'Mothers seated with their babies, clapping along during the outreach'],
    [`${HV}/hair-braiding.jpg`, 'A volunteer braiding a young girl’s hair'],
    [`${HV}/volunteer-with-toddler.jpg`, 'A Healthy Steps volunteer crouching beside a toddler holding a colourful blanket'],
    [`${HV}/gathering-wide.jpg`, 'Families seated in a long line along the clinic wall, waiting for the outreach to begin'],
    [`${HV}/nurse-speaking.jpg`, 'A medical team member in blue scrubs speaking to the gathered families'],
    [`${HV}/boy-new-backpack.jpg`, 'A boy in a blue jacket smiling with his new backpack'],
    [`${HV}/mother-baby-sling.jpg`, 'A smiling mother carrying her baby on her back in a blue sling'],
    [`${HV}/team-and-nurse.jpg`, 'Two Healthy Steps team members and a medical team member addressing the families'],
    [`${HV}/nurse-with-child.jpg`, 'A nurse handing something to a young boy'],
    [`${HV}/girl-pink-backpack.jpg`, 'A girl walking beside her mother wearing a new pink backpack'],
    [`${HV}/volunteer-with-family.jpg`, 'A Healthy Steps volunteer sitting with a mother and her children outside the clinic'],
    [`${HV}/girls-celebrate.jpg`, 'Girls in school uniform raising their new gift bags in celebration'],
    [`${HV}/children-gift-bags.jpg`, 'Children opening their gift bags among the trees'],
    [`${HV}/mother-baby-gifts.jpg`, 'A mother holding her baby and a gift bag outside the clinic'],
    [`${HV}/girl-blanket.jpg`, 'A girl carrying a new folded blanket in her arms'],
  ]),

  event2Title: 'Back to School with Ujumbe Wa Upendo',
  event2Date: '2026-10-03',
  event2Place: 'Ujumbe Wa Upendo',
  event2Text:
    'Our first back-to-school outreach of the season was hosted with Ujumbe Wa Upendo, whose name means "Message of Love". Children received backpacks, notebooks and gift bags, volunteers braided hair, and families were welcomed to a medical camp.',
  event2Video: media('/videos/outreach-2026-10-03-ujumbe-wa-upendo.mp4', ''),
  event2Poster: media(
    `${UW}/notebooks-thumbs-up.jpg`,
    'Children smiling and giving a thumbs up as they hold up their new notebooks',
  ),
  event2VideoCaption: 'Ujumbe Wa Upendo outreach · 2:48',
  event2Photos: photos([
    [`${UW}/notebooks-thumbs-up.jpg`, 'Children smiling and giving a thumbs up as they hold up their new notebooks'],
    [`${UW}/boys-laughing.jpg`, 'Two boys laughing together as they look at their gifts'],
    [`${UW}/braiding-smile.jpg`, 'A girl smiling while a volunteer braids her hair'],
    [`${UW}/children-new-backpacks.jpg`, 'A large group of children waving and wearing their new backpacks'],
    [`${UW}/two-boys-bags.jpg`, 'Two young boys sitting side by side holding their gift bags'],
    [`${UW}/team-welcome.jpg`, 'Healthy Steps team members welcoming the children seated under the tent'],
    [`${UW}/mothers-and-children.jpg`, 'Mothers and children sitting together and smiling with their gift bags'],
    [`${UW}/boy-blue-backpack.jpg`, 'A small boy holding up his new blue backpack'],
    [`${UW}/gathering-tent.jpg`, 'Children gathered on colourful mats under the outreach tent'],
    [`${UW}/volunteer-handing-gift.jpg`, 'A Healthy Steps volunteer handing a gift to a boy'],
    [`${UW}/mother-smiling.jpg`, 'A smiling mother with her children and their gift bags'],
    [`${UW}/hair-braiding.jpg`, 'A volunteer carefully braiding a young girl’s hair'],
    [`${UW}/volunteer-laughing.jpg`, 'A Healthy Steps volunteer laughing as she hands out gifts'],
    [`${UW}/backpacks-raised.jpg`, 'Children holding their new backpacks up high outside the house'],
    [`${UW}/volunteer-with-boy.jpg`, 'A volunteer handing a gift bag to a young boy on the porch'],
    [`${UW}/children-gift-bags.jpg`, 'Children looking inside their new gift bags'],
    [`${UW}/little-boy.jpg`, 'A little boy playing with a small toy'],
    [`${UW}/team.jpg`, 'The Healthy Steps team together under the outreach tent'],
  ]),
};

function photoList(key: 'event1Photos' | 'event2Photos'): ListField<'event1Photos' | 'event2Photos'> {
  return list(key, 'Photos', {
    itemNoun: 'photo',
    titleKey: 'photo',
    min: 1,
    help: 'Shown as equal-sized tiles in this order; the first eight show straight away and the rest appear when a visitor taps "Show all". Visitors can open any photo full size.',
    blank: { photo: { src: '', alt: '' } },
    fields: [image('photo', 'Photo')],
  });
}

const dateHelp =
  'Year first, then month, then day, for example 2026-10-10 for 10 October 2026.';

export const gallerySchema: PageSchema<GalleryContent> = {
  slug: 'gallery',
  label: 'Gallery',
  description: 'Photos and videos from recent outreaches.',
  group: 'Pages',
  path: '/gallery',
  defaults,
  groups: [
    {
      id: 'hero',
      label: 'Hero',
      fields: [
        text('heroEyebrow', 'Heading'),
        text('heroTitle', 'Text under the heading'),
        textarea('heroLead', 'Introduction paragraph', { rows: 3 }),
        image('heroImage', 'Background photo'),
      ],
    },
    {
      id: 'event1',
      label: 'First outreach (shown at the top)',
      description:
        'To feature a newer outreach, copy this one into the second slot first, then replace it here.',
      removable: true,
      fields: [
        text('event1Title', 'Outreach name'),
        text('event1Date', 'Date', { placeholder: '2026-10-10', help: dateHelp }),
        text('event1Place', 'Where it was held'),
        textarea('event1Text', 'What happened', { rows: 4 }),
        video('event1Video', 'Video file'),
        image('event1Poster', 'Still image shown before the video plays'),
        text('event1VideoCaption', 'Caption on the video', { placeholder: 'e.g. Humble Vessel outreach · 1:00' }),
        photoList('event1Photos'),
      ],
    },
    {
      id: 'event2',
      label: 'Second outreach',
      removable: true,
      fields: [
        text('event2Title', 'Outreach name'),
        text('event2Date', 'Date', { placeholder: '2026-10-03', help: dateHelp }),
        text('event2Place', 'Where it was held'),
        textarea('event2Text', 'What happened', { rows: 4 }),
        video('event2Video', 'Video file'),
        image('event2Poster', 'Still image shown before the video plays'),
        text('event2VideoCaption', 'Caption on the video', { placeholder: 'e.g. Ujumbe Wa Upendo outreach · 2:48' }),
        photoList('event2Photos'),
      ],
    },
  ],
};

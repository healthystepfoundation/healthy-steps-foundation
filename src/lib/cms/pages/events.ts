import { list, text, textarea } from '../fields';
import type { ContentItem, PageSchema } from '../types';
import { UPCOMING_EVENTS } from '@/lib/constants';

export type EventsContent = {
  bannerLabel: string;
  bannerHeadline: string;
  items: ContentItem[];
};

const defaults: EventsContent = {
  bannerLabel: 'Upcoming Outreach',
  bannerHeadline: 'Back to School Events, October 3, 10, and 17',
  items: UPCOMING_EVENTS.map((event) => ({
    slug: event.slug,
    title: event.title,
    date: event.date,
    startTime: event.startTime,
    endTime: event.endTime,
    location: event.location,
    description: event.description,
  })),
};

export const eventsSchema: PageSchema<EventsContent> = {
  slug: 'events',
  label: 'Upcoming Events',
  description: 'The outreach dates in the banner across the top of the homepage.',
  group: 'Shared across pages',
  path: '/',
  defaults,
  groups: [
    {
      id: 'banner',
      label: 'Banner wording',
      description: 'The sentence shown in the banner itself.',
      fields: [
        text('bannerLabel', 'Bold label', {
          placeholder: 'Upcoming Outreach',
          help: 'The bold words before the colon.',
        }),
        text('bannerHeadline', 'Banner text', {
          placeholder: 'Back to School Events, October 3, 10, and 17',
          help: 'Shown after the label. Leave empty to show the next event and its date automatically.',
        }),
      ],
    },
    {
      id: 'items',
      label: 'Events',
      description:
        'The "Add to calendar" link uses the next event that has not happened yet, and the banner hides itself once every date here has passed. Past events can be left in place or deleted.',
      fields: [
        list('items', 'Events', {
          itemNoun: 'event',
          titleKey: 'title',
          blank: {
            slug: '',
            title: 'New event',
            date: '',
            startTime: '10:00',
            endTime: '12:00',
            location: '',
            description: '',
          },
          fields: [
            text('title', 'Event name'),
            text('date', 'Date', {
              placeholder: '2026-10-03',
              help: 'Year first, then month, then day, for example 2026-10-03 for 3 October 2026.',
            }),
            text('startTime', 'Start time', { placeholder: '10:00', help: '24-hour clock.' }),
            text('endTime', 'End time', { placeholder: '12:00' }),
            text('location', 'Location'),
            textarea('description', 'Description', {
              rows: 3,
              help: 'Used in the calendar entry when someone taps "Add to calendar".',
            }),
            text('slug', 'Internal reference', {
              help: 'A short unique name used behind the scenes, e.g. back-to-school-oct-3. Letters, numbers and dashes.',
            }),
          ],
        }),
      ],
    },
  ],
};

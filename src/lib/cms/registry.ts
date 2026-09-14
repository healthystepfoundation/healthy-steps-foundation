import type { PageContent, PageSchema } from './types';
import { homeSchema } from './pages/home';
import { aboutSchema } from './pages/about';
import { staffSchema } from './pages/staff';
import { programsIndexSchema } from './pages/programs';
import { donateSchema } from './pages/donate';
import { contactSchema } from './pages/contact';
import { getHelpSchema } from './pages/get-help';
import { storiesSchema } from './pages/stories';
import { newsSchema } from './pages/news';
import { siteSchema } from './pages/site';
import { testimonialsSchema } from './pages/testimonials';
import { eventsSchema } from './pages/events';
import { PROGRAM_SCHEMAS } from './pages/program';

/**
 * Widens a page-specific schema to the generic one the admin UI consumes.
 *
 * `PageSchema<T>` is invariant in T — `keyof T` types the field keys, which is
 * what makes a mistyped key a compile error in `pages/*.ts`. That safety is
 * worth one cast at the boundary where those precise types stop mattering.
 */
function widen<T extends PageContent>(schema: PageSchema<T>): PageSchema {
  return schema as unknown as PageSchema;
}

/**
 * Every page the content editor can open, in the order they appear in the admin.
 *
 * Adding a page to the CMS is: write its schema in `pages/`, add it here, and
 * read it in the page component. The admin UI needs no changes.
 */
export const PAGE_SCHEMAS: PageSchema[] = [
  widen(homeSchema),
  widen(aboutSchema),
  widen(staffSchema),
  widen(programsIndexSchema),
  widen(getHelpSchema),
  widen(storiesSchema),
  widen(newsSchema),
  widen(donateSchema),
  widen(contactSchema),
  ...PROGRAM_SCHEMAS.map(widen),
  widen(testimonialsSchema),
  widen(eventsSchema),
  widen(siteSchema),
];

export function findPageSchema(slug: string): PageSchema | undefined {
  return PAGE_SCHEMAS.find((schema) => schema.slug === slug);
}

/** The admin list, split under its group headings, in registry order. */
export function groupedPageSchemas(): { label: string; schemas: PageSchema[] }[] {
  const groups: { label: string; schemas: PageSchema[] }[] = [];

  for (const schema of PAGE_SCHEMAS) {
    const label = schema.group ?? 'Pages';
    const existing = groups.find((group) => group.label === label);
    if (existing) existing.schemas.push(schema);
    else groups.push({ label, schemas: [schema] });
  }

  return groups;
}

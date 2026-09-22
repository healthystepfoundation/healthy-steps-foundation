import type {
  ContentItem,
  ContentValue,
  Field,
  LeafField,
  LeafValue,
  MediaValue,
  PageContent,
  PageSchema,
} from './types';

/**
 * Merging and diffing stored content against the defaults declared in code.
 *
 * Pure — no Supabase, no `server-only` — because the same code runs on the read
 * path (public pages), on the write path (validating what the admin form posts)
 * and in the browser (the editor's "changed since default" indicator).
 */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isMediaValue(value: unknown): value is MediaValue {
  return isRecord(value) && typeof value.src === 'string';
}

/** Every field on the page, flattened out of its groups. */
export function schemaFields<T extends PageContent>(schema: PageSchema<T>): Field[] {
  return schema.groups.flatMap((group) => group.fields);
}

/**
 * Reserved content key holding the ids of sections staff have removed from the
 * page. It is not a declared field — the merge handles it directly, and only
 * ids of groups marked `removable` survive, so bad data can never hide a hero.
 */
export const HIDDEN_SECTIONS_KEY = 'hiddenSections';

function removableIds<T extends PageContent>(schema: PageSchema<T>): string[] {
  return schema.groups.filter((group) => group.removable).map((group) => group.id);
}

function coerceHidden(raw: unknown, removable: string[]): string[] {
  if (!Array.isArray(raw)) return [];
  return removable.filter((id) => raw.includes(id));
}

/** Whether staff have removed this section in the editor. */
export function sectionHidden(content: PageContent, groupId: string): boolean {
  const hidden = content[HIDDEN_SECTIONS_KEY];
  return Array.isArray(hidden) && (hidden as unknown[]).includes(groupId);
}

function coerceLeaf(field: LeafField, raw: unknown, fallback: LeafValue): LeafValue {
  switch (field.type) {
    case 'text':
    case 'textarea':
      // An empty string is a legitimate edit here — an editor may want a label gone.
      return typeof raw === 'string' ? raw : fallback;

    case 'select':
    case 'icon':
      // These drive a lookup, so a blank would render nothing. Blank means "unset".
      return typeof raw === 'string' && raw.trim() !== '' ? raw : fallback;

    case 'strings':
      return Array.isArray(raw) ? raw.filter((item): item is string => typeof item === 'string') : fallback;

    case 'image':
    case 'video': {
      const fb: MediaValue = isMediaValue(fallback) ? fallback : { src: '', alt: '' };
      if (!isMediaValue(raw)) return fb;
      // A cleared src falls back rather than rendering a broken <Image>.
      const src = raw.src.trim() === '' ? fb.src : raw.src;
      const alt = typeof raw.alt === 'string' ? raw.alt : fb.alt;
      return { src, alt };
    }
  }
}

function coerceItem(fields: LeafField[], raw: unknown, blank: ContentItem): ContentItem {
  const source = isRecord(raw) ? raw : {};
  const item: ContentItem = {};
  for (const field of fields) {
    item[field.key] = coerceLeaf(field, source[field.key], blank[field.key] ?? '');
  }
  return item;
}

function coerceField(field: Field, raw: unknown, fallback: ContentValue): ContentValue {
  if (field.type !== 'list') {
    return coerceLeaf(field, raw, fallback as LeafValue);
  }

  if (!Array.isArray(raw)) return fallback;
  const rows = raw.map((row) => coerceItem(field.fields, row, field.blank));
  // A list the layout depends on (min) should not be emptied into a blank section.
  if (rows.length === 0 && (field.min ?? 0) > 0) return fallback;
  return rows;
}

/**
 * Overlays stored overrides onto the schema defaults.
 *
 * Unknown keys are dropped and wrong-shaped values fall back, so the return value
 * is always safe to render — a hand-edited or stale `site_content` row cannot
 * take a page down.
 */
export function mergeContent<T extends PageContent>(schema: PageSchema<T>, stored: unknown): T {
  const overrides = isRecord(stored) ? stored : {};
  const merged: PageContent = {};

  for (const field of schemaFields(schema)) {
    const fallback = schema.defaults[field.key];
    if (fallback === undefined) continue;
    merged[field.key] = coerceField(field, overrides[field.key], fallback);
  }

  const removable = removableIds(schema);
  if (removable.length > 0) {
    merged[HIDDEN_SECTIONS_KEY] = coerceHidden(overrides[HIDDEN_SECTIONS_KEY], removable);
  }

  return merged as T;
}

export function valuesEqual(a: ContentValue, b: ContentValue): boolean {
  if (typeof a === 'string' || typeof b === 'string') return a === b;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((entry, i) => {
      const other = b[i];
      if (typeof entry === 'string' || typeof other === 'string') return entry === other;
      if (entry === undefined || other === undefined) return false;
      const entryKeys = Object.keys(entry as ContentItem);
      const otherKeys = Object.keys(other as ContentItem);
      if (entryKeys.length !== otherKeys.length) return false;
      return entryKeys.every((key) =>
        valuesEqual((entry as ContentItem)[key] ?? '', (other as ContentItem)[key] ?? ''),
      );
    });
  }

  if (isMediaValue(a) && isMediaValue(b)) return a.src === b.src && a.alt === b.alt;
  return false;
}

/**
 * Reduces a full content object to only what differs from the defaults.
 *
 * Storing the diff rather than the whole page is what lets a later copy change in
 * code still reach the live site for every field nobody has touched — and makes
 * "revert to original" a delete rather than a second source of truth.
 */
export function diffFromDefaults<T extends PageContent>(
  schema: PageSchema<T>,
  content: T,
): PageContent {
  const diff: PageContent = {};
  for (const field of schemaFields(schema)) {
    const value = content[field.key];
    const fallback = schema.defaults[field.key];
    if (value === undefined || fallback === undefined) continue;
    if (!valuesEqual(value, fallback)) diff[field.key] = value;
  }

  const hidden = coerceHidden(content[HIDDEN_SECTIONS_KEY], removableIds(schema));
  if (hidden.length > 0) diff[HIDDEN_SECTIONS_KEY] = hidden;

  return diff;
}

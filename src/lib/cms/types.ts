/**
 * Content model for the site editor.
 *
 * A page's editable copy is a flat object of named fields. "Flat" is deliberate:
 * it makes storage a single JSONB blob, makes the merge in `merge.ts` a one-level
 * walk, and keeps the generated admin form from needing nested state.
 *
 * The shape of every field is declared once, in `pages/*.ts`, and both the public
 * page and the admin form are driven from that one declaration.
 */

/** An image or video slot. `alt` is stored alongside `src` so the two can never drift. */
export interface MediaValue {
  src: string;
  alt: string;
}

/** Anything that can live in a single field, or inside one row of a list field. */
export type LeafValue = string | string[] | MediaValue;

/** One row of a list field, e.g. a single core value or staff member. */
export type ContentItem = Record<string, LeafValue>;

export type ContentValue = LeafValue | ContentItem[];

/** A whole page's content, keyed by field name. */
export type PageContent = Record<string, ContentValue>;

// ─── Field definitions ────────────────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
}

interface FieldBase<K extends string> {
  key: K;
  label: string;
  /** Shown under the input. Say what the field controls in plain language. */
  help?: string;
}

export interface TextField<K extends string = string> extends FieldBase<K> {
  type: 'text';
  placeholder?: string;
}

export interface TextAreaField<K extends string = string> extends FieldBase<K> {
  type: 'textarea';
  rows?: number;
}

/** A repeatable list of plain strings — body paragraphs, short chips. */
export interface StringsField<K extends string = string> extends FieldBase<K> {
  type: 'strings';
  /** Singular noun for the add button, e.g. "paragraph". */
  itemNoun: string;
  input?: 'text' | 'textarea';
}

export interface ImageField<K extends string = string> extends FieldBase<K> {
  type: 'image';
}

export interface VideoField<K extends string = string> extends FieldBase<K> {
  type: 'video';
}

export interface SelectField<K extends string = string> extends FieldBase<K> {
  type: 'select';
  options: SelectOption[];
}

/** Picks one of the curated Lucide icons in `CONTENT_ICON_MAP`. */
export interface IconField<K extends string = string> extends FieldBase<K> {
  type: 'icon';
}

export type LeafField<K extends string = string> =
  | TextField<K>
  | TextAreaField<K>
  | StringsField<K>
  | ImageField<K>
  | VideoField<K>
  | SelectField<K>
  | IconField<K>;

/** A repeatable group — core values, staff members, gallery photos. */
export interface ListField<K extends string = string> extends FieldBase<K> {
  type: 'list';
  /** Singular noun for the add/remove buttons, e.g. "staff member". */
  itemNoun: string;
  /** Sub-field whose value labels each collapsed row. */
  titleKey: string;
  fields: LeafField[];
  /** The row an editor gets when they press "Add". */
  blank: ContentItem;
  min?: number;
  max?: number;
}

export type Field<K extends string = string> = LeafField<K> | ListField<K>;

export interface FieldGroup<K extends string = string> {
  /** Stable id, used as the accordion key in the editor. */
  id: string;
  /** Section name as it appears on the live page, e.g. "Our Story". */
  label: string;
  description?: string;
  /**
   * Marks a section staff may remove from the live page in the editor.
   * Only set on sections the page renders fine without — never a hero,
   * a form, or the section that is the page's reason to exist. Hidden ids
   * are stored under the reserved `hiddenSections` content key, and the
   * page component must gate the section with `sectionHidden()`.
   */
  removable?: boolean;
  fields: Field<K>[];
}

export interface PageSchema<T extends PageContent = PageContent> {
  /** URL segment in the admin, and the primary key in `site_content`. */
  slug: string;
  label: string;
  description: string;
  /** Heading this entry sits under in the admin list. */
  group?: string;
  /** Live path, revalidated on save. */
  path: string;
  /** Other paths whose output embeds this page's content. */
  extraPaths?: string[];
  /**
   * Set when the content appears in the shared layout (header/footer). Revalidates
   * every page rather than trying to enumerate them.
   */
  revalidateLayout?: boolean;
  defaults: T;
  groups: FieldGroup<Extract<keyof T, string>>[];
}

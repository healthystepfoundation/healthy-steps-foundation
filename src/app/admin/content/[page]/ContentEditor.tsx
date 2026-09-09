'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, ChevronDown, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { valuesEqual } from '@/lib/cms/merge';
import type { ContentValue, PageContent, PageSchema } from '@/lib/cms/types';
import FieldInput from './FieldInput';

interface ContentEditorProps {
  schema: PageSchema;
  initial: PageContent;
}

type Status = 'idle' | 'saving' | 'saved' | 'error';

export default function ContentEditor({ schema, initial }: ContentEditorProps): React.JSX.Element {
  const [content, setContent] = useState<PageContent>(initial);
  /** What is currently saved — the comparison point for "unsaved changes". */
  const [baseline, setBaseline] = useState<PageContent>(initial);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [openGroups, setOpenGroups] = useState<string[]>(
    schema.groups[0] ? [schema.groups[0].id] : [],
  );

  const dirty = useMemo(
    () => schema.groups.flatMap((g) => g.fields).some((field) => {
      const current = content[field.key];
      const saved = baseline[field.key];
      if (current === undefined || saved === undefined) return current !== saved;
      return !valuesEqual(current, saved);
    }),
    [content, baseline, schema],
  );

  // Leaving with unsaved edits loses them — this is the only guard against that.
  useEffect(() => {
    if (!dirty) return;
    function warn(event: BeforeUnloadEvent): void {
      event.preventDefault();
    }
    window.addEventListener('beforeunload', warn);
    return (): void => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const setField = useCallback((key: string, value: ContentValue): void => {
    setContent((prev) => ({ ...prev, [key]: value }));
    setStatus('idle');
  }, []);

  async function handleSave(): Promise<void> {
    setStatus('saving');
    setError(null);
    try {
      const res = await fetch(`/api/admin/content/${schema.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      const json = (await res.json()) as { success: boolean; error?: string };

      if (!json.success) {
        setError(json.error ?? 'The save failed. Please try again.');
        setStatus('error');
        return;
      }
      setBaseline(content);
      setStatus('saved');
    } catch {
      setError("We couldn't reach the server. Please try again.");
      setStatus('error');
    }
  }

  function toggleGroup(id: string): void {
    setOpenGroups((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));
  }

  const allOpen = openGroups.length === schema.groups.length;

  return (
    <div className="pb-28">
      <Link
        href="/admin/content"
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-warm-gray-500 transition-colors hover:text-forest-green-600"
      >
        <ArrowLeft size={15} />
        All pages
      </Link>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-warm-gray-900">{schema.label}</h1>
          <p className="mt-1 text-sm text-warm-gray-500">{schema.description}</p>
        </div>
        <a
          href={schema.path}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-warm-gray-200 px-4 py-2 text-sm font-medium text-warm-gray-600 transition-colors hover:border-forest-green-400 hover:text-forest-green-700"
        >
          View page
          <ExternalLink size={14} />
        </a>
      </div>

      <button
        type="button"
        onClick={(): void =>
          setOpenGroups(allOpen ? [] : schema.groups.map((group) => group.id))
        }
        className="mb-4 text-sm font-medium text-forest-green-600 transition-colors hover:text-forest-green-700"
      >
        {allOpen ? 'Collapse all sections' : 'Open all sections'}
      </button>

      <div className="space-y-3">
        {schema.groups.map((group) => {
          const open = openGroups.includes(group.id);
          const changed = group.fields.filter((field) => {
            const value = content[field.key];
            const original = schema.defaults[field.key];
            return value !== undefined && original !== undefined && !valuesEqual(value, original);
          }).length;

          return (
            <section
              key={group.id}
              className="overflow-hidden rounded-2xl border border-warm-gray-200 bg-white shadow-soft"
            >
              <h2>
                <button
                  type="button"
                  onClick={(): void => toggleGroup(group.id)}
                  aria-expanded={open}
                  className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-warm-white"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-warm-gray-900">{group.label}</span>
                    {group.description && (
                      <span className="mt-0.5 block text-sm text-warm-gray-500">
                        {group.description}
                      </span>
                    )}
                  </span>
                  {changed > 0 && (
                    <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                      {changed} changed
                    </span>
                  )}
                  <ChevronDown
                    size={18}
                    className={cn(
                      'shrink-0 text-warm-gray-400 transition-transform duration-300',
                      open && 'rotate-180',
                    )}
                  />
                </button>
              </h2>

              {open && (
                <div className="space-y-6 border-t border-warm-gray-100 p-5">
                  {group.fields.map((field) => {
                    const value = content[field.key] ?? '';
                    const original = schema.defaults[field.key] ?? '';
                    return (
                      <FieldInput
                        key={field.key}
                        field={field}
                        value={value}
                        onChange={(next): void => setField(field.key, next)}
                        isOriginal={valuesEqual(value, original)}
                        onReset={(): void => setField(field.key, original)}
                      />
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Save bar — pinned so it is reachable from anywhere in a long form. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-warm-gray-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4">
          <p className="min-w-0 text-sm" aria-live="polite">
            {status === 'error' ? (
              <span className="text-error">{error}</span>
            ) : status === 'saved' && !dirty ? (
              <span className="inline-flex items-center gap-1.5 font-medium text-forest-green-700">
                <Check size={15} />
                Saved. The live page is updating now
              </span>
            ) : dirty ? (
              <span className="text-warm-gray-500">You have unsaved changes</span>
            ) : (
              <span className="text-warm-gray-400">No changes yet</span>
            )}
          </p>

          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty || status === 'saving'}
            className="shrink-0 rounded-full bg-amber-500 px-6 py-2.5 text-sm font-bold text-forest-green-900 transition-all duration-300 hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-warm-gray-200 disabled:text-warm-gray-400"
          >
            {status === 'saving' ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Regenerates src/lib/cms/media-manifest.ts from whatever is in /public.
//
// The content editor's photo picker needs a list of the images that ship with the
// site. It cannot read the filesystem at runtime: in production, /public is
// served from the CDN and is not guaranteed to exist inside the serverless
// function bundle. So the list is baked into a module at author time instead.
//
// Run `npm run media:manifest` after adding files to /public.

import { readdir, writeFile } from 'node:fs/promises';
import { join, relative, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const PUBLIC_DIR = join(ROOT, 'public');
const OUT = join(ROOT, 'src/lib/cms/media-manifest.ts');

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg']);
const VIDEO_EXT = new Set(['.mp4', '.webm', '.mov']);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

/** "/images/field/mother-child.jpg" — each segment encoded so spaces and (1) survive. */
function toWebPath(absolute) {
  const rel = relative(PUBLIC_DIR, absolute);
  return '/' + rel.split(/[\\/]/).map(encodeURIComponent).join('/');
}

/** "Mother child" — a filename a non-technical editor can scan. */
function toLabel(absolute) {
  return basename(absolute, extname(absolute))
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const files = await walk(PUBLIC_DIR);
const assets = files
  .map((file) => ({ file, ext: extname(file).toLowerCase() }))
  .filter(({ ext }) => IMAGE_EXT.has(ext) || VIDEO_EXT.has(ext))
  .map(({ file, ext }) => ({
    src: toWebPath(file),
    label: toLabel(file),
    kind: VIDEO_EXT.has(ext) ? 'video' : 'image',
  }))
  .sort((a, b) => a.src.localeCompare(b.src));

const body = assets
  .map((a) => `  { src: '${a.src}', label: ${JSON.stringify(a.label)}, kind: '${a.kind}' },`)
  .join('\n');

const source = `// GENERATED FILE — do not edit by hand.
// Run \`npm run media:manifest\` to regenerate after adding files to /public.
//
// The images and video that ship with the site, offered in the content editor's
// picker alongside anything uploaded to Supabase Storage.

export interface ManifestAsset {
  src: string;
  label: string;
  kind: 'image' | 'video';
}

export const PUBLIC_MEDIA: ManifestAsset[] = [
${body}
];
`;

await writeFile(OUT, source, 'utf8');
console.log(`Wrote ${assets.length} assets to ${relative(ROOT, OUT)}`);

# PROGRESS — Healthy Steps Foundation Website

Running log of what has shipped, what is blocked, and what is next.
`CLAUDE.md` is the project brief (architecture, design rules, conventions); this file is the
timeline. When they disagree, trust this file for *status* and `CLAUDE.md` for *how things work*.

**Last updated**: 2026-09-22
**Phase**: 1 — feature complete, pre-launch
**Deployed to**: Vercel, via the GitHub integration on `main` (moved off Netlify 2026-09-09)
**Domain**: healthystepsfoundation.org — bought, pointed at Vercel, and verified in Resend

---

## Launch readiness at a glance

| # | Blocker | Owner | Status |
|---|---------|-------|--------|
| 1 | Real impact statistics | Client | ⛔ Outstanding — placeholder numbers still live. Editable in the CMS (Homepage → Impact numbers), so this no longer needs a developer |
| 2 | Supabase `site_content` table + `site-media` bucket | User | ✅ **Working** — confirmed indirectly on 2026-08-29: the live homepage renders a CMS-saved image served from Supabase Storage (that is what tripped Netlify's secrets scan). Saves and uploads are real |
| 3 | Resend env vars in Vercel | User | 🟡 Nearly done — the API key exists and healthystepsfoundation.org is verified in Resend. Remaining: set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` (e.g. `Healthy Steps Foundation <giving@healthystepsfoundation.org>`) in the Vercel dashboard and redeploy. Claude cannot do this: the Vercel account connected to its session is a different one and does not contain this project |
| 4 | Verify the first Vercel deploy is green | User | 🟡 The site moved from Netlify to Vercel on 2026-09-09; env vars are being moved to the Vercel dashboard by hand. Add `CRON_SECRET` while there — it now gates **two** cron routes (reminders + the Supabase keep-alive) — then confirm the deploy and both cron jobs appear green in Vercel |
| 5 | Final cross-device smoke test | User | ⚠️ Not started |
| 6 | Update the saved "Watch Videos" heading in the editor | User / client | ⚠️ One manual edit: `/admin/content` → Homepage → Video → Heading → "Videos and Pictures". The saved override shadows the new code default |
| 7 | Sync `CLAUDE.md` and `README.md` with the trimmed site | Developer | ⚠️ Both still describe the pre-September homepage, program pages, footer and Food Closet name |

Everything else needed for launch is built.

### Next steps, in order

1. **Finish env vars in the Vercel dashboard and redeploy** — `SUPABASE_URL`,
   `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `CRON_SECRET`, plus
   the two new Resend vars (`RESEND_API_KEY`, `RESEND_FROM_EMAIL` on the verified
   healthystepsfoundation.org domain). Then check the deploy is green and that **both** cron
   jobs (recurring-reminders 06:00 UTC, keep-alive 07:00 UTC) appear under Cron Jobs.
2. **End-to-end donation smoke test on production** — submit a $25 test pledge with a real
   inbox, confirm the pledge email + PDF arrives, mark it received in `/admin/donations`, and
   confirm the receipt email + PDF arrives.
3. **Change the saved video-section heading** to "Videos and Pictures" in `/admin/content`, and
   while in the editor, re-save any field whose saved text still shows an em dash (the 2026-09-09
   copy pass only changed the code defaults; saved overrides shadow them).
4. **Visual QA on a phone** — the four-section homepage, the enlarged header, the video+gallery
   grid and lightbox, the two-column footer, and the new heading hierarchy on inner pages.
   The 2026-09-21 de-AI pass and horizontal-scroll fix were verified in emulation only.
5. Get the real impact statistics and a clothing-market photograph from the client; both are
   theirs to enter in the editor, not a developer task.
6. Bring `CLAUDE.md` and `README.md` in line with the site as it now is.

---

## Timeline

### 2026-09-22 (evening) — Check Details box editable + optional link (client request)

The client messaged: they want to add a link in the Check Details box on the Donate page
(the box with "Make payable to / Memo / Mailing address") and "I don't have access to that
box. I need access to it."

Both delivered, without giving up the no-divergence rule that had kept those values in code:

- **The check details are now editable** at `/admin/content` → Donate → Check giving panel:
  payable-to, memo / note line, and mailing address, plus two new link fields (link text +
  link address). When the link address is set, a link (with external-link icon, opens in a
  new tab) renders under the three rows in the Check Details box **and** in the pledge
  success modal's repeat of that box. Empty link address = no link, exactly as before.
- **Single source preserved a new way.** A new `getCheckDetails()` in `cms/collections.ts`
  merges the CMS value over `US_CHECK_DETAILS` and is now the only read path: the donate
  page (passed down through `DonateFormCopy`), the News give card, the pledge PDF and the
  receipt PDF all use it, so an edit in the admin reaches every surface at once, including
  the PDFs emailed to donors. The editor help text says so.
- **Emptied fields fall back to the code values** (`US_CHECK_DETAILS` stays in
  `constants.ts` as default + fallback): blank payment instructions on a mailed-check PDF
  would be worse than stale ones. The donate page passes the resolved values so the on-page
  box can never disagree with the PDFs either.
- All five CMS keys are new, so no saved override is orphaned. `CLAUDE.md`'s "US check
  details are not in the CMS" claims updated.

**Follow-up 6, same evening**: the check panel is one numbered sequence now. Each
instruction line ("Mail it to First Baptist Sweetwater") is a bold step with a green
number, and the pledge and email steps continue the count dynamically
(`checkSteps.length + 1/+ 2`), so adding an instruction in the editor renumbers
everything correctly. Editor labels renamed to "Pledge step" / "Email step" since the
numbers are no longer fixed.

**Follow-up 5, same evening**: the heading wasn't showing on the live site. Diagnosed by
fetching the production page: the saved donate override has `checkStepsTitle: ""` — the
client emptied the field back when it was the "How Check Giving Works" step heading, and
the empty save shadowed the new default. (The saved instructions list is clean: just
"Mail it to First Baptist Sweetwater".) Fix: an emptied panel heading now falls back to
the code default in `donate/page.tsx`, same philosophy as the check-details fallback —
the panel needs its heading. Live check also confirmed today's deploys are all live.

**Follow-up 4, same evening**: the instruction lines ("Mail it to First Baptist
Sweetwater") lost their amber numbered circles and are now plain bold text under the
panel heading, per the client.

**Follow-up 3, same evening**: the "Check Details" step is gone entirely, per the client.
The white details box (payable to / memo / mailing address / optional link) now sits
directly under the "Mail it to First Baptist Sweetwater" instruction inside the
"Giving Details for US Donors" section, with no heading or green circle of its own; the
remaining steps renumbered to 1 (Confirm Your Pledge) and 2 (Prefer to Just Email Us).
The `checkDetailsTitle` field was removed with its element (orphaning any saved override
for it, by design — the heading no longer renders).

**Follow-up 2, same evening**: "Giving Details for US Donors" is now the check panel's
heading, per the client. The first section's green "1" circle is gone: the old
"How Check Giving Works" step heading is now a plain serif panel heading (new default
"Giving Details for US Donors"), and the remaining green circles renumbered 2/3/4 →
1/2/3 (editor labels updated to match). ⚠️ The client appears to have typed
"Giving Details for US Donors" as a line in the Instructions list in the editor — a
saved override we cannot change from code. After deploy they (or the user) must open
`/admin/content` → Donate → Check giving panel, delete that instruction line, and check
the "Panel heading" field shows the new text (re-save or reset if an old override
shadows it).

**Follow-up, same evening**: the client also asked "can something be added before confirm
your pledge". Two more fields in the same editor group ("Extra box before the pledge:
heading / text") render an amber note box between the Check Details box and the Confirm
Your Pledge form. Both default to empty, so nothing shows until the client writes
something; blank lines in the text become paragraphs. The client hasn't said what they
want the box to say, so it ships empty for them to fill in.

Verified: `npm run test:cms` green (35), TypeScript clean, production build green (26 routes).
⚠️ Not yet done: telling the client where the new fields live (Donate → Check giving panel,
under the Step 2 heading) — they asked for this by message and will go looking.

### 2026-09-22 (later) — Horizontal logo + removable sections in the content editor

**Logo, take two.** The user supplied a horizontal lockup (mark left, wordmark right, 1848×851)
that reads better in a navbar than the morning's square version. Re-encoded to webp
(ImageMagick lossy; ⚠️ a first attempt with `cwebp` produced a palette-mode webp that made
sharp/`next/image` hang forever on large transforms — logo and heroes rendered blank; if images
ever vanish site-wide after replacing an image, suspect the encoding and re-encode with
`magick`). Same `/HSF_logo.webp` path; header/drawer/footer `next/image` dims corrected to the
2.17:1 ratio (drawer back to h-11, footer back to h-14); PDF letterhead regenerated with wide
logo boxes again. Verified with CDP screenshots at 1440/390: header at rest, mobile, footer
pill, no overflow.

**Removable sections (client request: edit more than the admin allowed).** Staff can now remove
whole sections from a page in `/admin/content`, and bring them back later, without a developer:

- A group marked `removable: true` in its schema shows a "Remove from page" / "Put back on the
  page" toggle in the editor; removed sections get a dashed border, struck-through label and a
  "Removed from page" badge, and their fields keep their text so nothing is lost.
- Hidden ids are stored under a reserved `hiddenSections` key in the page's saved diff. The
  merge only accepts ids of groups actually marked removable, so bad data can never hide a
  hero or a form (8 new assertions in `npm run test:cms`, 35 total).
- Pages gate rendering with `sectionHidden(content, '<groupId>')` from `merge.ts`; programs
  carry it as `ProgramView.donateStripHidden`.
- Removable now: homepage stats / video / gallery (video+gallery are one on-page section that
  only disappears when both are removed); About story / purpose / who / process / values;
  Staff numbers strip / team photo; Programs why / connect; each program's donate strip;
  Donate sidebar (form widens to full width) / bottom strip; Contact green strip; Get Help
  hours / promise / cta; Stories programs chips; News give / cta.
- Deliberately NOT removable: every hero, the giving/contact forms, the staff grid, the
  program cards grid, the news posts, and the footer.

Verified: build green (26 routes), CMS tests green, editor toggle exercised in a logged-in
browser session (not saved).

### 2026-09-22 — New stacked logo (client request)

The client supplied a new logo: the leaf-footprint mark stacked above "HEALTHY STEPS
Foundation / A path to mental wellness", square (500×500) where the old lockup was horizontal
(1600×538). Supplied as identical png and webp; the webp won (86KB vs 118KB, same pixels) and
replaced `public/HSF_logo.webp` at the same path, so every reference (header, drawer, footer,
media manifest, any saved CMS override) keeps working with no orphaned keys.

Because the aspect ratio changed, the `next/image` width/height props were corrected to square
in the header (224×224), drawer (112×112, shown h-12) and footer (160×160, shown h-20 so the
wordmark stays legible in the white pill). The PDF letterheads were updated too: `pdf/logo.ts`
regenerated from the new artwork (300px PNG data URI) and the logo boxes in the receipt and
pledge PDFs made square (62×62 / 56×56, `objectFit: contain`).

Verified with CDP-emulated screenshots at 1440px and 390px: header at rest and compressed on
both, mobile drawer, footer pill, and a 390px overflow measurement (scrollWidth 390, no
horizontal scroll). The favicon already uses the same leaf-footprint mark, unchanged.
`public/HSFlogo.png` (an old lockup, still pickable in the editor's media list) was left in
place in case a saved override references it — worth deleting once confirmed unused.

### 2026-09-22 — Donate page: the giving-form boxes are now editable in the CMS

The client asked for more of the Donate page to be editable than the admin panel allowed. The
donate schema previously covered only the hero, the two headings above the form, the sidebar
cards and the bottom strip; everything inside the giving area was hardcoded. Now editable, in
three new editor groups on `/admin/content` → Donate:

- **How to give boxes** — the "How would you like to give?" prompt and both method boxes
  (title + small text for International Transfer and US check).
- **SWIFT transfer form** — the three step headings, the submit button label, and the
  small print under the button.
- **Check giving panel** — the Zero Transfer Fees box (title + text), the numbered
  instructions (a strings list, so more steps can be added), the four step headings, the
  pledge intro text, the submit button label, and the "Prefer to Just Email Us?" text.

Deliberately still in code: the payable-to / memo / mailing address, the SWIFT bank details,
the amounts and the $45 fee (must match the bank and the emails), the form field labels and
validation messages, and both success modals (their wording parallels the confirmation
emails). The check fee text default mentions "$45" — the editor field carries a help note to
keep it matching the real fee if it ever changes.

Plumbing: the form components are `'use client'`, so `donate/page.tsx` fetches once and
passes a `DonateFormCopy` slice (exported from `cms/pages/donate.ts`) down through
`DonatePageClient` into `DonationForm` and `CheckDonationPanel`. All keys are new, so no
saved override is orphaned.

Verified: production build green (26 routes), `npm run test:cms` green.

### 2026-09-21 — Receipts, de-AI polish, keep-alive cron, new logo + favicon (`575fade`..`a1832f2`, 7 commits)

One long session, seven commits, all pushed and building green:

**Per-program donate strip, editable** (`575fade`). The dark Support band on program pages ended
with one generic sentence listing food, fees, training and care. Each program now has its own
`donateBlurb` naming what a gift to that program funds, declared in the program schema so each
program's editor screen gained a "Support strip" section.

**Header shake fixed** (`8be49a1`). Compressing the header removes ~56px of height; with a single
12px scroll cutoff that height change could push scrollY back under the threshold and oscillate.
The threshold now has hysteresis: compress past 96px, expand under 8px.

**Sharper logo** (`ffb868e`). The client supplied a 1600×538 transparent webp; it replaced the
soft 250×100 `HSF_logo.png` everywhere (header, drawer, footer, media manifest), with the
`next/image` width/height props corrected to the real aspect ratio. Old png deleted.

**Official donation receipt** (`eef95d9`). "Mark received" now emails a US-nonprofit-style
receipt PDF (`src/lib/pdf/donation-receipt.tsx`): logo letterhead, receipt no. and date received,
donor/payment cards, designation table, the standard no-goods-or-services statement, and a
signature block. Deliberately no 501(c)(3)/EIN claims — HSF is Uganda-registered; check receipts
point US donors to First Baptist Sweetwater's own acknowledgment (⚠️ client should confirm this
wording). Both PDFs share the logo letterhead (base64 PNG in `pdf/logo.ts`, since @react-pdf
cannot decode webp and `/public` is not on the serverless filesystem); donor emails share a
branded HTML shell; the pledge email subject no longer claims funds were received.

**De-AI polish pass** (`98d7fd7`), at the user's request — presentation only, no copy changes.
Buttons are flat fills now (gradient, sheen sweep, glow shadows and hover lift removed); the
homepage hero overlay lightened so the photo keeps its real colour; trust tags became a quiet
dotted text line; the SCROLL cue and the header's reading-progress bar are gone; the impact
stats lost their boxed grid and the amber blur smudge. Verified with CDP full-page screenshots
at 1440px and 390px, before and after.

**Real mobile bug found during that audit**: every page had ~55px of horizontal scroll on
phones. `cn()` is a plain join (no tailwind-merge), so the header Donate button's
`hidden sm:inline-flex` lost to the `inline-flex` inside `buttonStyles` — the button never hid
and pushed the header wider than the viewport. Fixed with a wrapper span; the `cn()` trap is
documented in `CLAUDE.md`.

**Supabase keep-alive cron** (`88c440f`). Supabase pauses free-plan projects after ~a week of
inactivity. A second Vercel Cron (`/api/cron/keep-alive`, daily 07:00 UTC) runs two head-only
count queries. Independent of the reminders cron on purpose; gated by the same `CRON_SECRET`.
⚠️ Vercel Hobby allows exactly 2 daily crons per project — both slots are now used.

**Favicon** (`a1832f2`). The tab icon was still the Next.js template triangle. Now the
leaf-and-footprint mark cropped from the logo: `app/favicon.ico` (48px PNG-in-ICO),
`app/icon.png` (512 transparent), `app/apple-icon.png` (180 on white).

**Resend status**: the client bought healthystepsfoundation.org, pointed it at Vercel and
verified it in Resend. All code is ready; only `RESEND_API_KEY` + `RESEND_FROM_EMAIL` in the
Vercel dashboard (and a redeploy) stand between here and live donor emails. The Vercel account
connected to Claude's session is a different one, so this is the user's manual step.

### 2026-09-14 (later the same day) — Mission page removed, hero hierarchy swapped site-wide

Follow-up instructions from the user, same session as the round below:

- **The Our Mission page is deleted entirely** — route, CMS schema, registry entry, and its
  "Our Mission" link in the header's About dropdown. `/mission` now 301-redirects to `/about`
  (`next.config.ts`), where the mission statement still lives in the Vision & Mission cards.
  Any saved editor overrides for the mission page are ignored (the schema is gone).
- **Hero hierarchy swapped on all eight inner pages** (About, Staff, Programs, Donate,
  Contact, Get Help, Stories, News), matching what the September rounds did to section
  headings: the former small eyebrow ("Who We Are", "The Team", "Give Today"…) is now the
  large serif `<h1>`, and the former heading ("About Us", "Meet Our Team"…) sits under it as
  a regular-weight serif subtitle. CMS keys unchanged, so saved text keeps applying; the
  editor labels are now "Heading" / "Text under the heading". The homepage hero (headline
  only, no eyebrow) and the program heroes (name + description) are untouched.
- **About page: the Our Purpose section gained the photo** from the deleted Where We Work
  section (`field/distribution-wide.jpg`), shown full-width under the Vision and Mission
  cards and editable as "Photo under the cards".
- **The footer blurb is back, without "faith-based"** — the user clarified the earlier
  instruction: the sentence under the footer logo should stay, it is only "A faith-based"
  that had to go. New default: "An organization partnering with families in Wakiso, Uganda
  to improve mental health wellness through food, clothing, education, medical care and
  vocational skills, offered on a temporary basis." Same `footerBlurb` key as before, so
  ⚠️ **a previously saved footer override (which contains the old faith-based wording) will
  shadow this** and must be reset or re-saved in /admin/content → Footer.

Verified: production build green (26 routes — one fewer, the mission page), `npm run
test:cms` green.

### 2026-09-14 — Third client feedback round: copy corrections + editable events banner

The client's emailed corrections, applied across the CMS defaults, plus one feature request.

**The events-banner sentence is now editable.** The events list was already in the admin
(Shared → Upcoming Events), but the banner's displayed line ("Next Outreach: …") was hardcoded
and showed only the next single event. The Upcoming Events editor gained a "Banner wording"
group: a bold label (default "Upcoming Outreach") and a banner text (default
"Back to School Events, October 3, 10, and 17"). When the banner text is empty the banner
falls back to the automatic "next event, date" line. The banner still hides once every event
date has passed, and "Add to calendar" still uses the next upcoming event. The Oct 10 default
event was renamed from "Community Outreach" to "Back to School Outreach" to match the client's
"Back to School Events, October 3, 10, and 17".

**Copy corrections, by page:**
- **Homepage**: hero lead reads "…improve mental health wellness **by** providing…"; the
  Our Impact subtitle is now "Real numbers. Real families support programs." (literal
  application of "add 'support programs' to the end of the sentence" — worth confirming the
  intended phrasing); the video section is now "**Healthy Steps In Action**" with subtitle
  "June outreach in Makerere Kikoni" and body "Healthy Steps provided food packages and
  medical care to the community." (location corrected from Wakiso; the video caption small
  print now also says Makerere Kikoni).
- **About Us**: hero lead is the client's new sentence, with the "100 to 300 families" goal
  sentence deleted; Our Story paragraphs 1 and 2 rewritten to the client's wording; the
  mission card is the client's new bridge-partnership statement (also applied to the Our
  Mission page so the two stay identical — one grammar fix: "in a respectful and dignified
  manner", the client wrote "respectfully"); **the whole Where We Work section is deleted**
  (page section, schema fields and defaults; the following two sections swapped backgrounds
  to keep the alternation); Who We Serve drops "in Ndejje Division, Wakiso"; the eligibility
  list's last item is "…spiritual counseling" (was "resources"); How We Serve step 1 drops
  "or visit us in Ndejje" (call or email only); the Partnership value starts at "Every
  family…"; the Community value reads "We seek to build stronger families together. We are
  friends and neighbors committed to changing and improving lives for the betterment of the
  community." (deliberately no Ndejje — the client does not want outreach to sound
  restricted).
- **Staff**: hero lead is the client's new two-sentence version; Isaac's bio ends at
  "holistic family care." (Ndejje, Wakiso deleted); the numbers-strip captions are
  "Our team is committed" (100%) and "Every Program has purpose" (6).
- **Donate**: the "Your Gift at Work" sidebar card is **removed entirely** (page, schema
  fields, defaults) — the client says those gift amounts are not correct.
- **Footer (every page)**: the "A faith-based organization…" blurb under the logo is
  **removed entirely** — the client does not want the statement repeated on every page. The
  field is gone from the Footer editor too.

⚠️ **Saved CMS overrides shadow all of these code-default changes.** Any of these fields that
staff have saved in `/admin/content` will keep showing the old text until re-saved or reset
there. After deploy, compare the live pages against this list and reset/re-save any field
still showing the old wording.

⚠️ **Orphaned overrides, by design**: the Where We Work fields, `footerBlurb`, and
`giftTitle`/`giftExamples` were removed with their page elements, so any saved text for them
is silently dropped. Nothing user-visible is lost because the elements are gone.

Verified: production build green (27 routes), `npm run test:cms` green, lint unchanged (only
the pre-existing `CurrencyConverter.tsx` error).

### 2026-09-09 — Program hero trim + em dashes purged from all copy (`1fed49b`, `b15ef13`)

Two follow-ups the same day as the Vercel move, both continuing the client's
"nothing duplicated, nothing artificial" direction:

**Program heroes lost their last duplicate elements** (`1fed49b`). The "All Programs" button
(duplicated the navbar's Programs menu) and the "Our Programs" pill badge above the program name
are both removed from `ProgramHero.tsx`, which renders the hero on all six program pages. A
program hero now reads: name, description, "Support This Program". This was the only hero
anywhere still linking to `/programs`; the homepage hero's version went in the August round.

**Every em dash removed from user-facing copy** (`b15ef13`, 27 files) so the content reads
naturally, at the user's request. Each occurrence was rewritten (commas, colons, or split into
two sentences), not mechanically replaced, across page copy, CMS defaults in
`src/lib/cms/pages/*.ts`, the donation forms and popup, the pledge PDF, metadata descriptions,
alt text and aria-labels, and the admin editor's labels and help text. Untouched on purpose:
code comments (never rendered) and the currency converter's "—" empty-value placeholder,
which is a glyph, not prose.

⚠️ **Saved CMS overrides can still contain em dashes.** These edits change the code defaults;
any text staff have saved in `/admin/content` shadows them and keeps whatever punctuation it
was saved with. Skim the live pages after deploy and re-save any field still showing one.

### 2026-09-09 — Deploy target moved from Netlify to Vercel (`98478cf`)

The user connected the GitHub repo to Vercel; Vercel now builds and deploys `main` directly
(it detects Next.js natively — no build config needed). Changes on our side:

- **The Netlify scheduled function became a Vercel Cron job.**
  `netlify/functions/recurring-reminders.ts` is deleted; the daily reminder run now lives at
  `src/app/api/cron/recurring-reminders/route.ts`, scheduled by the new `vercel.json`
  (`0 6 * * *`, same 06:00 UTC as before). The route requires the
  `Authorization: Bearer ${CRON_SECRET}` header Vercel sends with cron invocations — without
  it anyone could trigger reminder emails to donors — so **`CRON_SECRET` is a new required
  env var** (any random secret, e.g. `openssl rand -hex 32`).
- **`netlify.toml` is deleted.** Its `SECRETS_SCAN_OMIT_KEYS` workaround is moot — Vercel has
  no equivalent secrets scanner blocking the build.
- `reminders.ts` / `donation-row.ts` keep their self-contained clients (harmless), but the
  comments explaining the Netlify bundler constraint are gone; `README.md` and `CLAUDE.md`
  deployment sections updated.

Env vars are the user's manual step: everything Netlify had, plus `CRON_SECRET`, into the
Vercel project settings. The admin "run now" reminders route is unchanged, so reminders can
still be triggered by hand if the cron misbehaves.

### 2026-09-02 → 2026-09-03 — Second feedback round: strip the site down (`2e35dea`..`e4b79c5`, 8 commits)

A live session with the client's owner, one instruction at a time. The theme this round: less
repetition, bigger section titles, and nothing on a page that the navbar already offers.

**Section headings, site-wide.** Every section now follows the pattern the client set for
"Our Impact" in August: the former small uppercase label is the large serif heading, and the old
heading sits under it as a regular-weight serif subtitle. Done first on the homepage
("What We Do", "Stories of Hope", "Our Community", "Partner With Us"), then across all inner
pages in one pass (24 sections on About, Staff, Mission, Programs, program pages, Contact,
Get Help, Stories and News). Page heroes were left as they were. CMS keys are unchanged, so
saved text keeps applying; only the editor labels changed ("Heading" / "Text under the heading").

**Homepage trimmed to four sections.** Events banner → hero → Our Impact → Videos and Pictures.
Removed, at the client's request, because programs and stories have their own pages: the
"What We Do" program grid, "Stories of Hope" testimonials, the "Our Community" photo band and
the "Partner With Us" closing card. `ProgramsSection.tsx` and `TestimonialsSection.tsx` are
deleted; their editor fields are gone from the Homepage schema.

**Header.** Tried a flat nav with every page as a top-level link (`32f269e`), reverted the same
day (`4eab7b1`) — the client wants Our Staff and Our Mission kept under an About dropdown. The
header is exactly as it was before this round.

**Get Help → About Us.** "Who We Serve" (families in temporary crisis + eligibility checklist)
and the four-step process (now labelled "How We Serve") moved to About Us, between Where We
Work and Our Core Values. Their editor fields moved with them.

**Program pages.** The Program Impact figures and the How It Works steps are removed from all
six pages — from the page, `constants.ts`, the types, the program editor schema and the
collection mapping. A program page is now: hero, About This Program + Who We Serve box, photo,
fund-specific donate strip. **Food Closet is renamed Food Pantry** everywhere it is displayed
(menus, cards, footer, fund list, testimonial tag, copy, README). The URL slug and donation
fund key stay `food-closet` so existing links and recorded pledges keep working.

**Duplicate links and CTAs removed** ("anything duplicate of what's in the navbar"):
- Footer: the Programs and Explore columns, the donate button and the "Send us a message"
  link. The footer is now the brand block and the "Reach Us" contact column — the client asked
  for the contacts to stay.
- Mobile drawer: the phone/email lines (the footer has them on every page).
- Events banner: the "Support This Outreach" link (the hero's Donate Now is directly beneath).
- Closing CTA sections on About, Staff, Mission, Programs and Stories.
- Program pages: the All Programs button and the Related Programs grid.
- Get Help: the Send a Message button, the six program cards and the donate prompt. The
  phone/email block stays.
- Stories: the Explore All Programs button (the program-name chips stay; they are not links).
- News: the Donate Now button inside the Give Online card.
- Contact: the two quick-link cards (Get Help, Donate).
Kept deliberately: the homepage hero's Donate Now (the client asked for it in August) and the
fund-specific "Donate to This Program" on program pages.

⚠️ **Orphaned overrides.** Every removed section also removed its editor fields, so any text
staff had saved for them (homepage programs/testimonials/community/CTA, all five closing CTAs,
Get Help programs + message button, program impact/steps, footer column headings, contact
quick links) is no longer read. Nothing user-visible is lost because the elements are gone.

Verified: production build green (26 routes), TypeScript clean, lint clean, `npm run test:cms`
green, and headless-Chrome screenshots of the header at 1280px, About and Get Help. The Chrome
extension was not connected, so no interactive/phone check yet.

### 2026-08-29 → 2026-08-31 — Client feedback round: heroes, header, homepage sections (`dba94b9`..`5ebb70e`, 14 commits)

A live review session with the client's corrections, applied one at a time. The theme: strip
decoration, put the brand in the header, and let real content lead.

**Heroes (homepage + donate).** The white logo cards are gone from both heroes — the page led with
the brand twice (header + hero) and no message. Visible headlines are back: "Every Family Deserves
to Be Whole" (home) and "Donate to Healthy Steps Foundation" (donate), both editable. The CMS
field `heroScreenReaderText` was renamed to `heroHeadline` on both pages since the text is visible
again. The homepage hero also lost its location pill, its "Our Programs" button, and the
"How we serve" label + shield icon above the trust tags — it now reads headline → lead →
Donate Now → tags.

**Header.** In exchange, the header logo grew twice (now `h-20/h-24/h-28` at rest, with the
`next/image` request bumped to 440×126 so it stays sharp) and the bar got taller (`py-4`); the
scrolled state compresses proportionally. Desktop nav links went from 15px to 17px.

**Stats section.** Hierarchy swap: "Our Impact" (previously the small eyebrow) is now the big
serif heading; the former heading text sits under it, same serif, regular weight, one step
smaller. The floating white caption card on the photo (and the sparkle icon inside it) is gone —
the photo stands alone. CMS keys unchanged, only editor labels; saved text keeps applying.

**Video section became "Videos and Pictures".** Same eyebrow/heading swap. The standalone
gallery section further down the homepage was merged in: `GallerySection.tsx` is deleted and the
photo mosaic now lives directly with the video, on the dark background, reusing the same
`galleryPhotos` CMS list. Through three rounds of feedback the video shrank from full-width
standalone → 2×2 tile in the mosaic → a single cell the same size as every photo. All tiles are
equal-sized now (the bento large/wide spans and the editor's "Tile size" select are removed), and
tapping any photo opens a lightbox at natural size (close: backdrop, X, or Escape).

**SectionHeading** gained optional `eyebrow` (can be omitted) and `eyebrowClassName`/
`titleClassName` overrides, which is how the two sections diverge without forking the pattern.

⚠️ **Renames orphaned three saved overrides by design** (`heroScreenReaderText`,
`heroLocation`, `heroProgramsLabel/Href`, `heroTrustLabel`, gallery heading fields) — all fields
whose on-page element was removed, so nothing user-visible was lost. The one that matters:
**the video-section heading override saved as "Watch Videos" still shadows the new
"Videos and Pictures" default** and must be re-saved in the editor (blocker 6 above).

### 2026-08-29 — Netlify deploy failed on secrets scanning; Supabase confirmed live (`a162bd9`)

The production deploy compiled cleanly but died in Netlify's **secrets scanner**: the value of
`SUPABASE_URL` was found in the rendered homepage HTML. Cause: someone has saved content in the
editor with an uploaded photo — Supabase Storage URLs embed the project URL. That URL is public
by design (it ships in every Supabase client app); the fix was
`SECRETS_SCAN_OMIT_KEYS = "SUPABASE_URL"` in `netlify.toml`. The service-role key and admin
secrets remain scanned.

**Silver lining, and it's big:** this failure is proof that the Supabase table, the storage
bucket, env vars in Netlify, a real CMS save, *and* a real photo upload all work in production —
the exact chain that had never been exercised. Blocker 2 is closed by evidence.

### 2026-08-17 — Supabase setup for the content editor: one trap found

Pasting `supabase/schema.sql` whole into the Supabase SQL editor failed with:

```
ERROR: 42P01: relation "storage.buckets" does not exist
```

**Cause.** The file ended with an `insert into storage.buckets (...)` to create the media bucket.
On a project where the Storage page has never been opened, that schema does not exist yet.
Opening Storage in the dashboard is what provisions it.

**Why it mattered more than it looks.** The Supabase SQL editor runs a pasted script as a single
transaction, so that one failing statement at the bottom **rolled back the `site_content` table
created at the top**. The run looked like it had done nothing at all, which is exactly what it had
done.

**Fix.** The `insert` is removed from `schema.sql` and replaced with a comment explaining why it
must not come back, and how to create the bucket instead: Storage → New bucket → `site-media` →
Public ON. `CLAUDE.md` carries the same warning.

The correct order is now: run the SQL (creates the table), then create the bucket in the dashboard.
Without the bucket, everything works except uploading *new* photos — the editor still runs and the
picker still offers every image that ships in `/public`.

⚠️ Still unconfirmed at the time of writing: whether the re-run succeeded. Nothing downstream of a
real save has been exercised.

### 2026-08-15 — Real photographs replace the stock program images (`872877f`)

The client supplied five real photographs and asked for the stock imagery to go, particularly
anywhere a stock photo of children was standing in for the children they actually serve.

| Program | Now shows | Was |
|---|---|---|
| Food Closet | Staff handing a food bag through the distribution window | Stock |
| Clothing Closet | Mother carrying an HSF bag home with her child | Stock |
| Children Tuition | Boy holding up a new school backpack | Stock |
| Adult Vocation | *unchanged* — tailor at a sewing machine | Unsplash, kept on request |
| Family Medical | Medical partners screening two women at an outreach | Stock |
| Resource Materials | Staff crouching with children, one carrying a box of supplies | Unsplash |

- The five stock files are **deleted**, not just unreferenced, so they can no longer be picked by
  mistake in the content editor.
- Adult Vocation was left alone as instructed — it shows a sewing machine and no faces, so it
  illustrates the trade rather than standing in for a real person.
- Each program now carries `imageAlt` describing what is actually in the photo. Previously the alt
  text was the program name repeated, which told a screen-reader user nothing.
- A sixth supplied photo (a second frame of the medical screening) went into the field library as
  `field/medical-screening-wide.jpg`, available in the editor's picker.

⚠️ **The client gave no clothing photograph.** Clothing Closet is using a real HSF photo of a
family carrying an HSF bag home — honest, but not literally the clothing market. Worth asking for
one; swapping it is a 30-second job in the editor now, no developer needed.

⚠️ **Two photos came through WhatsApp and are portrait and recompressed**
(902×1280 and 810×1080). They crop to the middle band in the 16:10 cards and will look soft on a
large desktop hero — most traffic is mobile, where they are fine. The un-compressed originals off
the client's phone would be a straight improvement, and a drop-in replacement.

### 2026-08-15 — Content editor, pass 2: everything else (`4d9abc9`)

The remaining 16 pages are converted. **Every page on the site is now editable** at
`/admin/content`, grouped as Pages (10), Programs (6, one screen each) and Shared across pages
(Testimonials, Upcoming Events, Footer).

- **Programs** get one editor each rather than six rows in a list — their steps and impact figures
  are lists of their own, and nesting two levels deep produces a form nobody can use. Built by a
  factory from `PROGRAMS`, so all six stay identical in shape.
- **Testimonials, events and news posts** are add/edit/delete/reorder lists. Adding a news post now
  actually shows: the newest is the featured letter, and any others appear as an "Earlier updates"
  list that simply is not rendered while there is only one.
- **One database round trip per page render.** `content.ts` loads the whole table once through
  React's `cache()`, so a page reading its own copy plus the footer plus all six programs still
  costs a single query.
- **Fixed a real bug**: each program's description holds several paragraphs separated by blank
  lines, but the detail page rendered it inside one `<p>`, so it displayed as a single run-on
  block. It is now a proper paragraph list. Program photos also carry their own alt text instead
  of repeating the program name.
- Deliberately **not** in the CMS: contact details, bank details and the bank fee (they also go
  into receipts, PDFs and reminder emails — a half-edited value would leave the site and the emails
  disagreeing), and each program's URL/fund keys (routing, not copy). `CLAUDE.md` lists these.

Verified: production build green (26 routes), TypeScript clean, lint unchanged from before this
work. All 12 marketing pages fetched and spot-checked for content — 22 distinctive strings from
every converted section, all present. All 15 editor screens load with their accordion sections
intact. **`npm run test:cms` — 27 new assertions** on the merge/diff logic, including the save
round-trip, junk-input fallback and list reorder/delete. Still untested: a real save, which needs
Supabase.

### 2026-08-15 — Content editor, pass 1 (`4d9abc9`)

Staff can now change words and photos themselves at `/admin/content`, behind the existing admin
password. Homepage, About Us and Our Staff converted first, to check the editing experience before
rolling it across the rest. *(Both passes landed in the single commit `4d9abc9` — they are split
here because they were built and reviewed as two steps, not because there are two commits.)*

- **Every field is declared once**, in `src/lib/cms/pages/*.ts` — the same declaration is both the
  copy the site ships with and the form the editor sees. Architecture detail is in `CLAUDE.md` →
  "CONTENT EDITOR (CMS)". Adding a page needs no admin UI work; the form builds itself.
- **Only the diff is stored.** `site_content` holds just the fields someone actually changed, so a
  later copy fix in code still reaches every untouched field, and "Reset to original" is a delete
  rather than a second source of truth.
- **Photos**: upload to Supabase Storage, or pick from the 66 images already in `/public`
  (`npm run media:manifest` regenerates that list). Alt text is stored next to each image so the
  two cannot drift apart.
- Editable per page: headings, eyebrow labels, body paragraphs, button labels *and* links, images
  with alt text, icons, and repeatable lists — team members, core values, impact numbers, gallery
  tiles — with add / delete / reorder.
- `STAFF_MEMBERS` and `IMPACT_STATS` were **removed** from `constants.ts`. They live in the staff
  and home schemas now; keeping a second copy is exactly the drift this was built to stop.
- Saving calls `revalidatePath`, so edits appear on the live site without a rebuild.
- ⚠️ Renaming a field key orphans any saved override for it — the merge drops unknown keys.

Verified at the time: production build green (29 routes — pass 2 later reduced this to 26 by
dropping a needless `generateStaticParams`), TypeScript clean, no new lint findings. Login,
auth rejection, both editor screens, the 66-asset media API, and the save + unknown-page error
paths were all exercised over HTTP. **The one path that could not be tested is a real save**, which
needs Supabase.

### 2026-08-03 — Homepage logo + honest donate copy (`67894ff`)
- Homepage hero headline "Every Family Deserves to Be Whole" replaced by the **HSF logo**,
  matching the donate page. The line survives as screen-reader text inside the `<h1>`, so the
  page keeps one top-level heading and search engines still index the phrase.
- Donate copy said US donors could give "by check or online", which reads as a card checkout.
  **There is no card checkout.** Copy is now "by check or by SWIFT bank transfer", and the method
  picker reads "US Donors — Give by Check".
- ⚠️ Both heroes now lead with a logo rather than a sentence. A logo does not tell a first-time
  visitor why they should care. If it reads flat in review, add a short line under the logo
  rather than reverting.

### 2026-07-30 — Client content corrections (`9ab1dfc`)
Applied the client's marked-up corrections:
- **Donate**: logo replaces the hero headline; "Two Ways to Give" + "Safe & Transparent" cards
  collapse into one **Secure Giving** card; `$500` now reads "Covers Family Medical and counseling
  support for a full year"; bank-fee wording corrected; donation summary gained a
  **"Total received is"** line (a $50 gift not covering the fee shows −$45 → $5, clamped at zero);
  check giving trimmed to "Mail it to First Baptist Sweetwater" plus the payable-to / memo /
  address rows.
- **Staff**: hero is now "Meet Our Team" with the client's wording.
- **About**: hero is now "About Us", body opens "We are a faith-based organization partnering…".
- "as-needed basis" → **"temporary basis"** in the footer, Family Medical description and
  Programs menu.
- **Donation pop-up removed** from every page. `DonationPopup.tsx` is still in
  `src/components/donation/` if it is ever wanted back.
- Vision and Our Story already matched the client's text — left untouched.
- Kept the check pledge-confirmation form despite "delete the rest": removing it would break the
  backend that records pledges and emails the PDF.

### 2026-07-30 — Premium UI pass (`2e13713`)
Full visual/interaction overhaul. Detail lives in `CLAUDE.md` → "UI SYSTEM"; the highlights:
- **Fonts were never loading.** `--font-sans`/`--font-serif` named `'Inter'`/`'Merriweather'`
  literally, but `next/font` emits hashed family names. Every page fell back to system fonts.
- **17 nested `<Link><Button>` pairs** across 8 pages produced `<a>` wrapping `<button>` — invalid
  HTML that double-announces to screen readers. Replaced with `ButtonLink` / `buttonStyles()`.
- **Mobile drawer was inside `<header>`**, whose `backdrop-filter` makes it a containing block for
  `position: fixed` — the drawer would have been clipped to header height once scrolled.
- Header rebuilt: frosted glass on scroll, reading-progress bar, Programs mega-menu, active-route
  underlines, animated drawer. The old dropdowns were CSS `group-hover` only and unreachable by
  keyboard.
- Design tokens (warm-ink elevation scale, shared easing), `SectionHeading`, redesigned program /
  staff / testimonial cards, hero parallax and grain.
- Accessibility: skip link, global focus ring, `prefers-reduced-motion`, dark-on-amber CTAs
  (white on amber-500 failed contrast).

### 2026-07-30 — Real testimonials (`447a232`)
- Removed three **invented** placeholder testimonials (Grace N., John K., Sarah M.).
- Added two real ones from the Makerere Kikoni outreach: **Charles Kasibante** (medical partner)
  and **Patricia Kayeny** (beneficiary). Quotes verbatim apart from dropping spoken
  self-introductions and one typo fix.
- Both grids were built for three cards; they now adapt to two and return to three automatically
  when a third story is added.
- ❗ Never re-add fabricated testimonials.

### 2026-07-17 and earlier
- Operational content extracted from the client's Operational Manual and Programs docs (`b192a2b`).
- Stakeholder-meeting decisions applied (`868c6d3`).
- dfcu SWIFT/BIC (`DFCUUGKA`) and the US check address (3800 Wekiva Rd., Longwood, FL 32779)
  filled in; News page added (`b23dec1`).
- Donation backend built (`6f43e9b`): Supabase pledges, PDF pledge confirmations via Resend,
  `/admin/donations`, recurring reminders as a Netlify scheduled function.
- 19 pages, design system, and all real photography shipped before that.

---

## Known risks

**~~The last three pushes have no completed local production build behind them.~~ RESOLVED
2026-08-15.** `next build` now completes cleanly (29 routes) after a fresh `npm install` — the
`next/font/google` woff2 fetches from `fonts.gstatic.com` succeeded this time. The failure was
environmental, not in the source. ESLint still has the one pre-existing error
(`CurrencyConverter.tsx:118`).
*If it recurs: self-host the two fonts via `next/font/local` and drop the build-time network
dependency.*

**`node_modules` keeps emptying itself.** It was corrupted twice in one session (truncated
`next/package.json` and `@edge-runtime/primitives`, stray `routes.d 2.ts` files in `.next`), on
2026-08-15 it was found completely empty, and **it happened again on 2026-09-21** (`next` binary
gone mid-session). That is a file-sync tool (iCloud/Dropbox) writing into the project directory.
Reinstalling fixes it, and it will keep recurring until the folder is excluded from sync.

**No real-device QA yet.** Everything has been verified by local production builds plus headless
screenshots (2026-09-03: header at 1280px, About, Get Help; 2026-09-21: full-page CDP captures
of Home, Programs, Donate, About at 1440px and 390px, including overflow measurements at
360/390/430px — which is how the mobile horizontal-scroll bug was caught). Still untested on an
actual phone: the video+photo lightbox, the drawer, and touch behaviour generally.

~~**A real save has never run.**~~ **RESOLVED 2026-08-29** — the Netlify secrets-scan failure
proved a saved CMS edit with an uploaded Supabase Storage photo is rendering on the live
homepage. Save, upload, and `next/image` remote loading all work in production.

**Everything since late August is unverified in production** (`dba94b9`..`a1832f2` — the August
round, the September trim, and the seven 2026-09-21 commits including the receipt system, the
de-AI pass and the new crons). All build clean locally (26 routes, CMS tests green). Confirm the
Vercel deploy and both cron jobs before assuming the site is fine.

**Saved CMS overrides can shadow code changes.** Now that real saves exist, editing a default in
`src/lib/cms/pages/*.ts` only shows where staff have not saved that field — the "Watch Videos"
heading is one live example, and the 2026-09-09 em dash removal is another (any saved field can
still carry an em dash until re-saved). When a copy change does not appear, check `/admin/content` before
suspecting the deploy.

**`CLAUDE.md` and `README.md` are behind the site.** `CLAUDE.md` still describes the hero logo,
a six-section homepage with programs and testimonials, program pages with impact figures and
steps, a four-column footer, the `ProgramStep`/`ProgramImpactStat` types and the "Food Closet"
name. `README.md` was updated for the rename only. Trust this file for status; sync both when
the dust settles on the client's feedback (blocker 7).

**The site is now very lean, by instruction.** The homepage has no programs, no stories and no
closing call to action; inner pages have no cross-links except the navbar and the footer's
contact column. That is what the client asked for, twice over. If engagement or SEO suffers
after launch, the first things to consider re-adding are a program grid on the homepage and
Related Programs on program pages — both were removed in `e436812` / `e4b79c5` and are easy to
restore from history.

---

## Open questions for the client

0. **Two readings from the 2026-09-14 corrections to confirm:**
   - "Under Our Impact add 'support programs' to the end of the sentence" was applied
     literally as "Real numbers. Real families support programs." — confirm that phrasing
     (alternative: "Real family support programs").
   - The new mission statement was applied with "in a respectful and dignified manner"
     (the client's email said "respectfully", read as a typo).

1. **A photograph of the clothing market** — nothing in the supplied set or the existing library
   shows it, so Clothing Closet is using a related HSF photo instead.
2. **Un-compressed originals** of the food-closet and children-tuition photos, straight off the
   phone rather than through WhatsApp.
3. **Patricia Kayeny's location** — her testimonial does not say where she lives. Currently labelled
   "Makerere Kikoni Outreach" because the support she describes matches that event; needs confirming.
4. **Impact statistics** — the homepage impact numbers still hold invented values (1200+ families, 500+
   children, 3+ years). These are public-facing claims about a charity and should not go live
   unverified.
5. **Food Pantry URL** — the name changed but the address is still `/programs/food-closet`. Do
   they want `/programs/food-pantry` too? That needs a redirect and a new fund key, so it is a
   deliberate change rather than a rename.
6. **"How We Serve"** — Get Help had no section by that name, so the four-step "How It Works"
   process was the one moved to About Us. Confirm that is the section they meant.
7. **Receipt tax wording (2026-09-21)** — the new donation receipt PDF deliberately makes no
   US 501(c)(3)/EIN claims: SWIFT receipts say tax treatment depends on the donor's country,
   and check receipts point donors to First Baptist Sweetwater's own acknowledgment. The client
   should read one and confirm the wording matches the real arrangement with the church.

---

## Phase 2 (post-launch)

Analytics, SEO metadata and OG images, dark mode, and a fuller Stories experience. `Get Help` and
`Stories` are no longer placeholders — both shipped — so the original Phase 2 list in `CLAUDE.md`
overstates what is left.

~~**Content editor, pass 2**~~ — done 2026-08-15.

# HEALTHY STEPS FOUNDATION - WEBSITE PROJECT BRIEF

## PROJECT OVERVIEW
Building a professional NGO website for Healthy Steps Foundation, a Uganda-based faith-based mental health and family support organization. Built with Next.js 16.2.3, TypeScript (strict), Tailwind CSS v4, and Framer Motion v12.

## ORGANIZATION DETAILS
- **Name**: Healthy Steps Foundation
- **Location**: Uganda, Central Region, Wakiso, Ndejje Division, Ndejje Ward, Mirimu
- **Contacts**:
  - Phone: +256756231553 / +256782818734
  - Email: healthystepsfoundation@gmail.com

## REAL STAFF (confirmed from client documents)
| Name | Title | Photo file |
|------|-------|------------|
| Isaac Oyirwoth | Director | `/public/Picture1.jpg` |
| Sharon Blue | Director | `/public/Picture4.jpg` |
| Pius Olockywinu | Secretary | `/public/Picture3.jpg` |

All three are live in `STAFF_MEMBERS` in `src/lib/constants.ts`.

---

## ORGANIZATIONAL APPROACH

### Philosophy
Healthy Steps Foundation takes a **holistic approach** to mental health wellness by addressing the **short-term and temporary insecurities** that affect overall wellbeing. Mental health cannot be separated from physical needs, economic stability, education, and spiritual health.

### Real Mission Statement (from client)
> *"Healthy Steps Foundation is a faith-based organization that seeks to partner with families to improve mental health wellness. Our holistic approach includes researching and introducing techniques and programs designed to treat individuals suffering with mental health challenges in a respectful and dignified manner."*

### Service Model
- **Faith-Based**: Rooted in spiritual principles — faith shapes how we serve
- **Partnership**: We work *with* families, not just *for* them
- **Dignified**: Respectful treatment of every individual — no shame in needing help
- **As-Needed Basis**: Emergency, crisis-response support — not long-term welfare
- **Holistic**: Addressing spiritual, mental, physical, and economic wellness together
- **Temporary Support**: Helping families through crisis periods toward self-sufficiency

### Program Limitations (enforce these in all content)
- **School Tuition**: Maximum **one semester** per family
- **Adult Vocation**: **One adult family member** per family
- **All Programs**: As-needed, emergency basis — not ongoing welfare

---

## TECHNOLOGY STACK (ACTUAL — do not change)

| Tool | Version | Notes |
|------|---------|-------|
| Next.js | 16.2.3 | App Router, Turbopack |
| TypeScript | Strict mode | No `any` types |
| Tailwind CSS | v4 | CSS `@theme` block — no tailwind.config.js |
| Framer Motion | v12 | `type Variants`, `ease: 'easeOut' as const` |
| Lucide React | latest | Icons throughout |
| React Hook Form | latest | + Zod via `@hookform/resolvers/zod` |
| next/font | built-in | Inter (sans) + Merriweather (serif) |

### Critical Tailwind v4 Notes
- Config is in `src/app/globals.css` via `@theme { ... }` — **no tailwind.config.js**
- Custom colors use CSS variable naming: `--color-forest-green-900`, etc.
- Plugins: `@plugin "@tailwindcss/forms"` and `@plugin "@tailwindcss/typography"`

### Critical Framer Motion v12 Notes
- Always `import { type Variants } from 'framer-motion'` when defining variant objects
- Use `ease: 'easeOut' as const` (not plain string) to satisfy TypeScript
- `FadeUp` component (`src/components/ui/FadeUp.tsx`) is the standard scroll animation wrapper

### Vercel Deployment (confirmed real target — 2026-09-09)
- Deploys via the GitHub → Vercel integration on pushes to `main`. No build config needed —
  Vercel detects Next.js natively.
- `vercel.json` at root exists **only** to declare the cron schedules:
  `/api/cron/recurring-reminders` (daily, 06:00 UTC) and `/api/cron/keep-alive`
  (daily, 07:00 UTC — a trivial Supabase query so the free-plan project is never
  paused for inactivity). Vercel's Hobby plan allows exactly 2 crons per project,
  both daily — do not add a third or increase the frequency.
- `netlify.toml` and `netlify/functions/` were removed (2026-09-09) — Netlify was the previous
  target; the scheduled function became a Vercel Cron-invoked App Router route. Do not re-add
  Netlify config without confirming a switch back.

---

## CURRENT BUILD STATUS (as of 2026-05-22)

### ✅ COMPLETED — All 18 pages build and pass TypeScript

#### Pages Built
| Page | Route | Status |
|------|-------|--------|
| Homepage | `/` | ✅ Complete — real field photos, Community Documentary design |
| About Us | `/about` | ✅ Complete — real field photos throughout |
| Our Staff | `/staff` | ✅ Complete — real staff names, titles, headshots |
| Our Mission | `/mission` | ✅ Complete — full page with real content |
| Programs Overview | `/programs` | ✅ Complete — real field photos |
| Food Closet | `/programs/food-closet` | ✅ Complete |
| Clothing Closet | `/programs/clothing-closet` | ✅ Complete |
| Children Tuition | `/programs/children-tuition` | ✅ Complete |
| Adult Vocation | `/programs/adult-vocation` | ✅ Complete — Ugandan tailoring photo |
| Family Medical | `/programs/family-medical` | ✅ Complete |
| Resource Materials | `/programs/resource-materials` | ✅ Complete — Ugandan classroom photo |
| Donate | `/donate` | ✅ Complete — awaiting SWIFT details |
| Contact | `/contact` | ✅ Complete — real photo hero, contact strip, form, live map |
| Get Help | `/get-help` | ⏳ Placeholder shell — Phase 2 |
| Stories | `/stories` | ⏳ Placeholder shell — Phase 2 |
| News | `/news` | ✅ Complete — fundraising newsletter updates, driven by `NEWS_UPDATES` in constants.ts |

#### Components Built
- `Header.tsx` — sticky, dropdown nav, mobile drawer, HSF_logo.png
- `Footer.tsx` — 4-column grid, logo, links, contact
- `FadeUp.tsx` — standard scroll-animation wrapper (used on all pages)
- `HeroSection.tsx` — homepage hero (full-bleed real field photo + Framer Motion)
- `StatsSection.tsx` — animated counters + real field photo (50/50 grid)
- `ProgramsSection.tsx` — staggered program card grid
- `TestimonialsSection.tsx` — 3-card layout on `bg-forest-green-50`
- `ProgramCard.tsx` — real program photos, hover scale, links to slug
- `ProgramHero.tsx` — individual program full-bleed overlay hero
- `StaffCard.tsx` — real headshot with `object-top` crop + `sizes`; initials fallback
- `ContactForm.tsx` — React Hook Form + Zod, 6 subject options, success state
- `DonationForm.tsx` — 3-step form with SWIFT success modal
- `DonationPopup.tsx` — sessionStorage-gated popup, 5s delay
- `AmountSelector.tsx`, `FundSelector.tsx`, `BankFeeCheckbox.tsx`
- `Button.tsx`, `Input.tsx`

#### Data & Logic
- `src/lib/constants.ts` — all static data (PROGRAMS, STAFF_MEMBERS, TESTIMONIALS, IMPACT_STATS, SWIFT_DETAILS, ORG)
- `src/lib/validations.ts` — Zod `donationSchema` + `contactSchema`
- `src/lib/utils.ts` — `formatCurrency`, `calculateDonationTotals`, `cn`
- `src/types/index.ts` — all TypeScript interfaces (`Program.image` is required, not optional)

### ⏳ PENDING — Blocking launch
- [x] **SWIFT bank details** — dfcu Bank details filled into `SWIFT_DETAILS` (2026-07-13),
      including `swiftBicCode: 'DFCUUGKA'` (confirmed 2026-07-17).
- [x] **US check mailing address** — `US_CHECK_DETAILS.mailingAddress` filled in (2026-07-17):
      `3800 Wekiva Rd., Longwood, FL 32779`, sourced from the client's "Fund Raising News letter"
      (checks payable to First Baptist Sweetwater Church, HSF on the FOR line).
- [ ] **Real impact statistics** — fill into `IMPACT_STATS` in `src/lib/constants.ts`
- [x] **Real testimonials** — two real testimonials from the Makerere Kikoni outreach are live in
      `TESTIMONIALS` (2026-07-30): Charles Kasibante (medical partner) and Patricia Kayeny
      (beneficiary). The three placeholder testimonials (Grace N., John K., Sarah M.) were removed —
      they were invented. Never re-add fabricated testimonials.
- [ ] **Donation backend env vars** — see "DONATION SYSTEM (BACKEND)" section below; code is built
      but needs Supabase/Resend accounts + env vars before it can run end-to-end.
- [ ] **Testing + deployment** — final Vercel deploy and smoke test

---

## PHOTOS & IMAGES

### Real HSF Field Photos (19 WhatsApp photos in `/public/images/`)
All named `WhatsApp Image 2026-05-21 at 20.31.XX (N).jpeg`. Usage map:

| File | Used on |
|------|---------|
| `20.31.38.jpeg` | (superseded) — homepage hero now uses `/public/images/field/food-relief-handoff.jpg` |
| `20.31.38 (5).jpeg` | Homepage stats section |
| `20.31.35.jpeg` | Homepage photo break section |
| `20.31.37.jpeg` | About page hero |
| `20.31.38 (1).jpeg` | About page — Our Story |
| `20.31.38 (18).jpeg` | About page — Where We Work |
| `20.31.38 (14).jpeg` | Staff page hero |
| `20.31.38 (13).jpeg` | Staff page team photo |
| `20.31.36 (1).jpeg` | Mission page hero |
| `20.31.34 (1).jpeg` | Programs overview hero |
| `20.31.38 (11).jpeg` | Contact page hero (intake/registration scene) |

Remaining photos `(2)–(4)`, `(6)–(10)`, `(12)`, `(15)–(17)`, `20.31.33`, `20.31.34`, `20.31.34 (2)`, `20.31.36` are **available for future use** (Get Help, Stories, etc.).

### Program Images (`/public/images/programs/`)
All real HSF photographs. **The stock/Unsplash program photos were deleted on 2026-08-15** at the
client's instruction — they do not want any stock imagery on the site, and they especially did not
want stock photographs of children standing in for the children they actually serve.

| File | Content | Source |
|------|---------|--------|
| `programs/food-closet-handoff.jpg` | Staff handing a food bag through the distribution window | Real HSF (2026-07-30) |
| `programs/clothing-closet-family.jpg` | Mother carrying an HSF bag home with her child, greeted by a volunteer | Real HSF (2026-05-21) |
| `programs/children-tuition-backpack.jpg` | Boy holding up a new school backpack at a back-to-school outreach | Real HSF (2026-07-30) |
| `program-adult-vocation.jpg` | Ugandan tailor at a sewing machine | Unsplash — **kept deliberately**: no faces, so it illustrates the trade rather than standing in for a real beneficiary |
| `programs/family-medical-screening.jpg` | Medical partners screening two women at an outreach clinic | Real HSF (2026-07-30) |
| `programs/resource-materials-outreach.jpg` | Staff member crouching to speak with children, one carrying a box of supplies | Real HSF (2026-07-30) |

⚠️ **Do not re-add stock photography of beneficiaries.** If a program needs a new photo, ask the
client for one, or use an existing real photo. Staff can now swap any program photo themselves in
the content editor (Programs → *program* → Program photo) without a developer.

⚠️ **Two of these are portrait and lower resolution** (`food-closet-handoff` 902×1280,
`children-tuition-backpack` 810×1080) because they came through WhatsApp, which recompresses.
They crop to the middle band in the 16:10 cards and look soft on a large desktop hero. Subject
accuracy beat resolution here, but if the client can send the un-compressed originals off the
phone, replacing them is a drop-in via the content editor.

Each program also carries `imageAlt` in `PROGRAMS` describing what is actually in the photo,
rather than repeating the program name.

### Staff Headshots (`/public/`)
- `Picture1.jpg` → Isaac Oyirwoth (Director)
- `Picture3.jpg` → Pius Olockywinu (Secretary)
- `Picture4.jpg` → Sharon Blue (Director)

---

## DESIGN SYSTEM — "Community Documentary"

All pages follow these six rules (stored in memory at `.claude/projects/.../memory/project-design-system.md`):

### Rule 1 — Amber is accent only
Amber (`amber-400`/`amber-500`) is used for: accent rules (`w-10 h-0.5 bg-amber-500`), CTA buttons, icon backgrounds on light. Never as a large section background.

### Rule 2 — Section heading pattern (apply everywhere)
```tsx
<div className="w-10 h-0.5 bg-amber-500 mb-4" />
<p className="text-sm font-semibold uppercase tracking-widest text-warm-gray-400 mb-3">Label</p>
<h2 className="text-3xl sm:text-4xl font-bold font-serif text-warm-gray-900">Heading</h2>
```
On dark (`bg-forest-green-900`): replace `text-warm-gray-400` with `text-forest-green-300`, use `bg-amber-400`.

### Rule 3 — Photo-anchored heroes (two variants)
**Full-bleed overlay** (most pages):
```tsx
<section className="relative min-h-[70vh] flex items-center overflow-hidden">
  <Image src={PHOTO} alt="..." fill className="object-cover object-center" priority sizes="100vw" />
  <div className="absolute inset-0 bg-gradient-to-r from-forest-green-900/95 via-forest-green-900/70 to-forest-green-900/20" />
  <div className="absolute inset-0 bg-gradient-to-t from-forest-green-900/55 via-transparent to-transparent" />
  <div className="relative z-10 container mx-auto px-6 py-28">...</div>
</section>
```
**Split-screen** (About, Mission): `grid grid-cols-1 lg:grid-cols-2 min-h-[78vh]` — left panel `bg-forest-green-900`, right panel `next/image fill`.

### Rule 4 — Two background colours per page
Alternate between `bg-warm-white`, `bg-white`, `bg-forest-green-50`, and `bg-forest-green-900`. Never use `bg-amber-500` as a section background.

### Rule 5 — Stats use large forest-green serif numbers
```tsx
<div className="text-5xl sm:text-6xl font-black text-forest-green-600 font-serif mb-2">{value}</div>
```
Not white-on-amber. Stats sections use `bg-white` or `bg-warm-white`.

### Rule 6 — Program/content cards
Real photos at top (`aspect-[16/10]`, `object-cover`, hover scale). No icon-in-whitespace pattern.

---

## UI SYSTEM (premium pass — 2026-07-30)

A shared visual/interaction layer sits on top of the Community Documentary rules. **Use these
primitives instead of hand-rolling classes** — that is what keeps the site looking like one product.

### Tokens in `globals.css` `@theme`
| Token | Utility | Use for |
|-------|---------|---------|
| `--shadow-soft` | `shadow-soft` | Resting cards, form fields, small chips |
| `--shadow-lift` | `shadow-lift` | Hovered cards, the contact form |
| `--shadow-float` | `shadow-float` | Modals, drawers, floating captions, hero photos |
| `--shadow-glow-amber` / `--shadow-glow-green` | `shadow-glow-amber` | CTA hover glow only |
| `--ease-out-expo` etc. | `ease-[cubic-bezier(0.16,1,0.3,1)]` | Every transition longer than 200ms |
| `--animate-float-slow`, `--animate-shimmer`, `--animate-marquee` | `animate-float-slow` … | Ambient motion |

Shadows are tinted with the warm ink colour, not black — do **not** go back to `shadow-md`/`shadow-xl`.

### Component classes (`@layer components`)
- `.grain-overlay` — film-grain wash for photo heroes. Needs `position: relative` on the element.
- `.link-sweep` — underline that draws in from the left on hover/focus.
- `.sheen` — light sweep on hover. **No longer used by `Button`** (2026-09-21 de-AI pass); only add
  it back deliberately, never to CTAs.

### Primitives — reach for these first
| Need | Use | Notes |
|------|-----|-------|
| Button | `Button` from `ui/Button` | Variants: `primary` (amber gradient), `secondary`, `outline`, `ghost`, `onDark` |
| Button that navigates | `ButtonLink` | **Never** `<Link><Button>` — `<a>` wrapping `<button>` is invalid HTML and double-announces to screen readers |
| `tel:` / `mailto:` styled as a button | `buttonStyles(variant, size, className)` on a plain `<a>` | Must stay a real anchor, not a next/link route |
| Section heading | `SectionHeading` from `ui/SectionHeading` | Props: `eyebrow`, `title`, `lead`, `tone` (`light`/`dark`), `align` |
| Program icon | `programIcon(program.icon)` from `lib/icons` | Single source of truth — do not re-declare local icon maps |
| Form field chrome | `fieldClasses` / `fieldErrorClasses` from `ui/Input` | Shared by `Input`, `<select>`, `<textarea>` |

Buttons are **pill-shaped** (`rounded-full`) site-wide. Primary CTAs are dark text on amber, not
white on amber — white on amber-500 failed contrast.

⚠️ **De-AI pass (2026-09-21): buttons are flat.** The amber gradient, `.sheen` sweep,
`shadow-glow-*` hovers and the hover lift/scale were removed from `Button` — solid fills with
plain colour transitions only. Also removed: the homepage hero's SCROLL cue and chip-styled trust
tags (now a quiet dotted text line), the header's reading-progress bar, and the stats section's
boxed grid + amber blur blob. Do not re-add decorative gloss to CTAs or the header.

⚠️ **`cn()` does not resolve Tailwind conflicts** (it is a plain join, no tailwind-merge). Never
pass a class to `Button`/`ButtonLink` that fights one already in `buttonStyles` — e.g.
`className="hidden sm:inline-flex"` lost to the base `inline-flex`, which kept the header's
Donate button visible on phones and forced ~55px of horizontal scroll site-wide. Hide a button by
wrapping it (`<span className="hidden sm:block">`).

### Header behaviour (`layout/Header.tsx`)
- Sticky; compresses (logo + padding shrink) and switches to frosted glass on scroll, with
  hysteresis (compress past 96px, expand under 8px) so the ~56px height change cannot flip the
  state back and shake the bar.
- ~~Reading-progress bar~~ removed 2026-09-21 (blog gimmick; its spring overshoot also left an
  amber sliver at the left edge).
- `About` and `Programs` are Framer Motion dropdowns that open on hover **and** on click/focus, and
  close on Escape, outside blur, or route change. The old CSS `group-hover` version was unreachable
  by keyboard.
- Active route gets an amber underline via `usePathname`.
- ⚠️ The mobile drawer is a **sibling of `<header>`, not a child**. The header's `backdrop-filter`
  makes it a containing block for `position: fixed`, which would clip the drawer to the header's
  height. Do not move it back inside.

### Global UX
- Skip-to-content link in `(marketing)/layout.tsx`, targeting `#main-content`.
- `BackToTop` (`layout/BackToTop.tsx`) — appears after ~1 viewport, ring fills with scroll progress.
- Global `:focus-visible` ring, branded scrollbar, `::selection`, and a
  `prefers-reduced-motion` block that neutralises every animation and transition.

⚠️ **Fonts**: `--font-sans` / `--font-serif` in `@theme` MUST reference `var(--font-inter)` /
`var(--font-merriweather)` — the variables `next/font` sets in `layout.tsx`. They previously named
`'Inter'` / `'Merriweather'` literally, which silently fell back to system fonts because next/font
emits hashed family names.

---

## CONTENT THAT IS REAL (from client)

### Program Short Descriptions (all in constants.ts)
- **Food Closet**: "Emergency food support that meets immediate food insecurities for families in need."
- **Clothing Closet**: "Basic wardrobe essentials provided on an as-needed basis to maintain dignity and confidence."
- **Children Tuition**: "School tuition assistance to keep children in education, supporting up to one semester per family."
- **Adult Vocation**: "Vocational skills training for one adult family member in farming, tailoring, or mechanics."
- **Family Medical**: "Medical support on an as-needed basis to address health emergencies and basic healthcare needs."
- **Resource Materials**: "Spiritual, mental wellness, and vocational resource materials to support holistic family development."

### Core Values (real — used on About and Mission pages)
1. **Faith-Based** — Guided by spiritual principles
2. **Partnership** — Work alongside families, not for them
3. **Dignity & Respect** — Honour every individual
4. **Holistic Wellness** — Mental, physical, and spiritual health together
5. **Community** — Neighbours walking with neighbours
6. **Integrity** — Transparent with donors, partners, and families

---

## SITE STRUCTURE

### Navigation
```
Logo (left)                                    Donate Button (amber, right)
├── Home (dropdown)
│   ├── About Us
│   ├── Our Staff
│   └── Our Mission
├── Programs (dropdown)
│   ├── All Programs
│   ├── Food Closet
│   ├── Clothing Closet
│   ├── Children Tuition
│   ├── Adult Vocation
│   ├── Family Medical
│   └── Resource Materials
├── Get Help
├── Stories
├── News
└── Contact
```

### Route Group
All marketing pages live in `src/app/(marketing)/` with a shared layout that wraps `Header` + `Footer` + `DonationPopup`.

---

## DONATION FLOW (CRITICAL FEATURE)

### Two Payment Methods
`/donate` (`DonatePageClient.tsx`) lets donors pick one of two manual (non-real-time) methods —
no payment is ever taken through this website itself:
1. **SWIFT bank transfer** (`DonationForm.tsx`) — international donors, dfcu Bank Uganda.
2. **US check giving** (`CheckDonationPanel.tsx`) — US donors mail a check to First Baptist
   Sweetwater (partner church), zero transfer fees.

Both forms submit to the same `POST /api/donations` endpoint (`method: 'swift' | 'us-check'`) —
see "DONATION SYSTEM (BACKEND)" below for what actually happens on submit.

### Donation Form Fields (`src/lib/validations.ts` → `donationSchema`)
- `method`: `'swift' | 'us-check'`
- `firstName`, `lastName`, `email`, `phone?`, `country`
- `type`: `'one-time' | 'recurring'`
- `recurringFrequency?`: `'monthly' | 'quarterly' | 'annually'`
- `amount`: quick buttons $25/$50/$100/$250/$500 or custom
- `fund`: one of 7 fund slugs (6 programs + `where-needed-most`)
- `coverBankFee`: boolean checkbox (SWIFT only — check giving has no fee, always `false`)
- `companyWebsite`: honeypot field, must stay empty (hidden input, bots that autofill trip it)
- Calculated server-side via `calculateDonationTotals` in `src/lib/utils.ts`: `donationAmount`,
  `bankFee` ($45), `totalAmount`

### SWIFT Bank Details (`src/lib/constants.ts` → `SWIFT_DETAILS`)
dfcu Bank, Kampala Road branch — filled in 2026-07-13, `swiftBicCode` confirmed 2026-07-17:
```typescript
export const SWIFT_DETAILS = {
  bankName: 'dfcu Bank',
  accountHolder: 'Healthy Steps Foundation',
  accountNumberUsd: '02660018653045',
  accountNumberUgx: '01660018653014',
  swiftBicCode: 'DFCUUGKA',
  branch: 'dfcu Kampala Road',
  branchAddress: '8H7H+HJ6, Kampala Road, Kampala',
};
```
`US_CHECK_DETAILS.mailingAddress` is filled in as `'3800 Wekiva Rd., Longwood, FL 32779'`
(First Baptist Sweetwater's address, sourced from the client's newsletter).

### Donation Popup
- Fires **5 seconds** after any page load
- Once per session (`sessionStorage` key: `hsf_popup_shown`)
- Quick donate $50 / $100 → routes to `/donate?amount=X&fund=where-needed-most&type=one-time`
- Backdrop click or X button closes

---

## DONATION SYSTEM (BACKEND) — built 2026-07-13

Submitting either donation form now does real work, not just a client-side modal:
1. `POST /api/donations` validates, computes totals, and inserts a row into Supabase (`donations`
   table — see `supabase/schema.sql`), which returns a generated `invoice_number`
   (`HSF-{year}-{6-digit sequence}`).
2. A PDF **pledge confirmation** (not a payment receipt — funds haven't arrived yet) is rendered
   with `@react-pdf/renderer` (`src/lib/pdf/donation-pledge.tsx`) and emailed to the donor via
   Resend (`src/lib/email.ts`), attached to the confirmation email.
3. Recurring donors get periodic reminder emails since SWIFT/check giving is manual — a Vercel
   Cron job (schedule in `vercel.json`, daily at 06:00 UTC) hits
   `src/app/api/cron/recurring-reminders/route.ts`, which requires the
   `Authorization: Bearer ${CRON_SECRET}` header Vercel sends and calls
   `runDueRecurringReminders()` in `src/lib/reminders.ts`.
4. Staff can see all submitted pledges and mark them "received" at `/admin/donations`, gated by a
   single shared password (`src/middleware.ts` + `src/lib/admin-auth.ts`, signed session cookie,
   12h TTL).

### Required env vars (`.env.local` locally, Vercel dashboard for production)
`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (needs a
verified sending domain in Resend — a Gmail address won't work), `ADMIN_PASSWORD`,
`ADMIN_SESSION_SECRET` (random 32+ byte secret, e.g. `openssl rand -hex 32`), and
`CRON_SECRET` (random secret; Vercel automatically sends it as a Bearer header when invoking
cron routes — the reminders cron refuses to run without it). Supabase env vars are live in
production; Resend is still outstanding.

### Key files
`supabase/schema.sql` (run once in Supabase's SQL editor), `src/app/api/donations/route.ts`,
`src/app/api/admin/**`, `src/app/admin/**`, `src/lib/{supabase,email,admin-auth,reminders,donation-row}.ts`,
`src/lib/pdf/donation-pledge.tsx`, `src/app/api/cron/recurring-reminders/route.ts` + `vercel.json`.

---

## CONTENT EDITOR (CMS) — built 2026-08-15

Staff change the words and photos themselves at `/admin/content`, behind the same password as
`/admin/donations`. **All 19 marketing pages are covered**, grouped in the admin as:

| Group | Entries |
|-------|---------|
| Pages | Homepage, About Us, Our Staff, Our Mission, Programs overview, Get Help, Stories, News, Donate, Contact |
| Programs | One entry per program — Food Closet, Clothing Closet, Children Tuition, Adult Vocation, Family Medical, Resource Materials |
| Shared across pages | Testimonials, Upcoming Events, Footer |

### The one rule
**Every editable field is declared once, in `src/lib/cms/pages/<page>.ts`.** That declaration is
both the default value the site ships with *and* the form the editor sees. There is no second
source of truth to keep in sync — that is the whole point.

### How it fits together
| File | Role |
|------|------|
| `src/lib/cms/types.ts` | The content model and the field-definition types |
| `src/lib/cms/fields.ts` | `text()`, `textarea()`, `strings()`, `image()`, `video()`, `select()`, `icon()`, `list()` |
| `src/lib/cms/pages/*.ts` | Per-page content type + defaults + form layout |
| `src/lib/cms/pages/program.ts` | `makeProgramSchema()` — builds one editor per entry in `PROGRAMS` |
| `src/lib/cms/registry.ts` | `PAGE_SCHEMAS` + `groupedPageSchemas()` — the list the admin shows |
| `src/lib/cms/collections.ts` | `getPrograms()`, `getTestimonials()`, `getUpcomingEvents()`, `getNewsUpdates()` |
| `src/lib/cms/merge.ts` | Pure merge/diff. Runs on the server AND in the browser |
| `src/lib/cms/merge.test.ts` | `npm run test:cms` — 27 checks on the merge. No framework, no deps |
| `src/lib/cms/content.ts` | `getPageContent()` / `savePageContent()` (server-only) |
| `src/lib/cms/media.ts` | Supabase Storage uploads + the picker's asset list |
| `src/lib/cms/media-manifest.ts` | **Generated.** `npm run media:manifest` after adding to `/public` |
| `src/app/admin/content/**` | The editor UI — generated entirely from the schema |
| `src/app/api/admin/content/[page]` | Save + `revalidatePath` |
| `src/app/api/admin/media` | List + upload |

### Adding a page to the CMS
1. Write `src/lib/cms/pages/<page>.ts` — a content type, a `defaults` object holding the copy that
   is in the page today, and `groups` describing the form.
2. Add it to `PAGE_SCHEMAS` in `registry.ts` (wrapped in `widen()`).
3. In the page component: `const content = await getPageContent(<page>Schema)` and replace the
   hardcoded strings with `content.x`. The page becomes `async`.
4. No admin UI changes. The form builds itself.

### Things that will bite you
⚠️ **Only the diff is stored.** `site_content.content` holds just the fields someone has actually
changed. Untouched fields keep reading from code, so a copy fix in `pages/*.ts` still reaches the
live site. The flip side: **renaming a field key orphans any saved override for it** — the merge
drops unknown keys. Migrate deliberately if you rename.

⚠️ **`PageSchema<T>` is invariant in `T`.** `keyof T` types the field keys, which is what makes a
mistyped key a compile error. That is why `registry.ts` needs the `widen()` cast — don't "simplify"
it away without replacing the key checking.

⚠️ **Client components take content as props.** The home components (`HeroSection`, `StatsSection`,
…) and `Header` are `'use client'`, so the server page or layout fetches once and passes `content`
down. Never call `getPageContent` from a client component — it is `server-only`.

⚠️ **One query per render, via `cache()`.** `content.ts` loads the whole `site_content` table once
and memoises it for the render. A page reading its own content plus the footer plus all six
programs still costs a single round trip — so call the helpers freely, but do not add a second
un-cached client.

⚠️ **Contact details are NOT in the CMS.** `ORG` in `constants.ts` stays the single source for the
email address, phone numbers and physical address, because the same values go into donation
receipts, pledge PDFs and reminder emails. Editing them in one place only would leave the site and
the emails disagreeing. One line in `constants.ts` changes all of them at once. Same reasoning for
`SWIFT_DETAILS` and `BANK_FEE_USD` — they must match what the bank says.
**Exception (2026-09-22): the US check details ARE editable** (Donate → Check giving panel), at
the client's request. The no-divergence rule is kept a different way: the donate page, the News
give card and both donation PDFs all read them through `getCheckDetails()` in
`cms/collections.ts`, which merges the CMS value over `US_CHECK_DETAILS` (the fallback for
emptied fields). Never read `US_CHECK_DETAILS` directly in a page or PDF.

⚠️ **A program's `slug`, `fund` and `relatedSlugs` are not editable.** They are routing and
donation-fund keys, not copy; a typo would break a URL or misdirect a gift. `getPrograms()` always
takes them from `PROGRAMS` in `constants.ts` and merges only the copy on top.

⚠️ **Images need `remotePatterns`.** Uploads live on Supabase Storage, so `next.config.ts` allows
`**.supabase.co/storage/v1/object/public/**`. A self-hosted Supabase host is picked up from
`SUPABASE_URL` at build time.

⚠️ **A cleared image or icon falls back to the default** rather than rendering a broken `<Image>`.
Text fields may legitimately be emptied; images and icons may not.

⚠️ **`STAFF_MEMBERS` and `IMPACT_STATS` are gone from `constants.ts`** — they live in the staff and
home schemas now. Do not re-add them; two copies is the drift problem this replaced.

⚠️ **`PROGRAMS`, `TESTIMONIALS`, `UPCOMING_EVENTS` and `NEWS_UPDATES` are still in `constants.ts`,
but only as the CMS defaults.** Pages must read them through `collections.ts`, never import the
constant directly — importing the constant renders the shipped copy and silently ignores every
edit. `ProgramView` (not `Program`) is the type pages and components take.

### Running the checks
`npm run test:cms` — 27 assertions on the merge/diff, including the save round-trip
(`merge(diff) === edited`). No test framework and no dependencies; it runs on node's built-in type
stripping, which is why `allowImportingTsExtensions` is on in `tsconfig.json`.

### Requirements to actually run
**No new env vars** — the CMS reuses `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`
and `ADMIN_SESSION_SECRET` from the donation backend. Two setup steps:

1. Run the `site_content` block in `supabase/schema.sql` (SQL editor, same project as donations).
2. Create the `site-media` bucket in the **dashboard** — Storage → New bucket → public ON.
   ⚠️ Not in SQL: on a project where Storage has never been opened, `storage.buckets` does not
   exist yet, and because the SQL editor runs a pasted script as one transaction, that failure also
   rolls back the `site_content` table created above it.

**Without any of this the site still renders the copy that ships in code** — the editor loads and
the media picker works off `/public`, but saving reports that the database is not connected.
Without only the bucket, everything works except uploading new photos.

---

## BRAND COLORS & TYPOGRAPHY

### Brand Colors
- **Forest Green**: `forest-green-50` through `forest-green-900` (primary brand)
- **Amber**: `amber-400` / `amber-500` / `amber-600` (accent only — not section backgrounds)
- **Warm White**: `warm-white` (page backgrounds)
- **Warm Gray**: `warm-gray-400` through `warm-gray-900` (text)

### Typography
- **Serif** (`font-serif`): Merriweather — headings, hero text, stats numbers
- **Sans** (`font-sans`): Inter — body, UI elements

### Animation Pattern
```tsx
<FadeUp delay={0.1}>
  <YourContent />
</FadeUp>
```
Stagger sibling elements with `delay={i * 0.08}`.

### Logo
- File: `/public/HSF_logo.png` (horizontal logo)
- Header: `className="h-12 sm:h-14 md:h-20 w-auto object-contain"`
- Footer: white pill background `rounded-2xl px-5 py-3`, `h-14 w-auto`

---

## CODING STANDARDS

### File Organization
```
src/
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx         ← Header + Footer + DonationPopup
│   │   ├── page.tsx           ← Homepage
│   │   ├── about/page.tsx
│   │   ├── staff/page.tsx
│   │   ├── mission/page.tsx
│   │   ├── programs/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── donate/page.tsx
│   │   ├── contact/page.tsx   ← COMPLETE (form + live map)
│   │   ├── get-help/page.tsx  ← placeholder — Phase 2
│   │   ├── stories/page.tsx   ← placeholder — Phase 2
│   │   └── news/page.tsx      ← fundraising newsletter updates (NEWS_UPDATES)
│   ├── layout.tsx             ← Root layout (fonts)
│   └── globals.css            ← Tailwind v4 @theme config
├── components/
│   ├── layout/Header.tsx, Footer.tsx
│   ├── home/HeroSection.tsx, StatsSection.tsx, ProgramsSection.tsx, TestimonialsSection.tsx
│   ├── contact/ContactForm.tsx
│   ├── donation/DonationForm.tsx, DonationPopup.tsx, AmountSelector.tsx, FundSelector.tsx, BankFeeCheckbox.tsx
│   ├── programs/ProgramCard.tsx, ProgramHero.tsx
│   ├── staff/StaffCard.tsx
│   └── ui/Button.tsx, Input.tsx, FadeUp.tsx
├── lib/
│   ├── constants.ts           ← All static data — edit here for content updates
│   ├── utils.ts
│   └── validations.ts         ← donationSchema + contactSchema
└── types/index.ts             ← Program.image is required (not optional)
```

### TypeScript Rules
- Strict mode enabled — no `any` types
- Explicit return types on all functions
- Interface over type for objects
- Props interfaces named `ComponentNameProps`

### Component Rules
- Server Components by default
- `'use client'` only for: forms, animations, state, browser APIs
- All client components that use Framer Motion must be in separate files

### Styling Rules
- Tailwind utility classes only
- Mobile-first: `sm:` → `md:` → `lg:` breakpoints
- Hero text sizing: `text-4xl sm:text-5xl lg:text-6xl` (never plain `text-5xl`)
- `next/image` with `fill` always needs `sizes` prop

---

## BUILD PHASES

### Phase 1: MVP Launch ← NEARLY COMPLETE
- [x] Project setup (Next.js 16, TypeScript, Tailwind v4, Framer Motion v12)
- [x] Design system (globals.css @theme, brand tokens)
- [x] Root layout + marketing layout
- [x] Header (sticky, dropdowns, mobile drawer)
- [x] Footer (4-column, logo, links)
- [x] Homepage (real photo hero, stats + photo, programs, testimonials, CTA)
- [x] About Us page (real photos, story, mission, vision, values, Uganda context)
- [x] Our Staff page (real headshots — Isaac, Sharon, Pius)
- [x] Our Mission page (full page — mission, vision, holistic model, principles)
- [x] Programs overview page (real field photos)
- [x] All 6 individual program pages (`/programs/[slug]`)
- [x] Donate page (3-step form, SWIFT modal, trust sidebar)
- [x] Contact page (real photo hero, contact strip, form, Google Maps embed)
- [x] Donation popup modal (sessionStorage, 5s delay)
- [x] FadeUp scroll animations on all pages
- [x] Community Documentary design system applied across all pages
- [x] Real program content from client (all 6 descriptions updated)
- [x] Real mission statement and core values updated
- [x] Real staff data (Isaac Oyirwoth, Sharon Blue, Pius Olockywinu)
- [x] 19 real HSF field photos integrated throughout
- [x] All non-African/non-Ugandan stock photos replaced
- [x] Mobile responsive (all pages, `text-4xl sm:text-5xl lg:text-6xl` pattern)
- [x] Vercel deployment via GitHub integration; reminders as a Vercel Cron route (Netlify
      config removed 2026-09-09)
- [x] Real donation backend — Supabase + Resend + PDF invoicing + admin view + recurring
      reminders (see "DONATION SYSTEM (BACKEND)" section) — code complete, awaiting env vars
- [x] SWIFT bank details — dfcu Bank filled in, `swiftBicCode: 'DFCUUGKA'` confirmed (2026-07-17)
- [x] US check mailing address — `3800 Wekiva Rd., Longwood, FL 32779` (2026-07-17, from client's
      Fund Raising News letter)
- [x] News page (`/news`) — fundraising newsletter content, driven by `NEWS_UPDATES` (2026-07-17)
- [ ] **Real impact statistics** (awaiting from client)
- [x] **Real testimonials** — Charles Kasibante + Patricia Kayeny, Makerere Kikoni (2026-07-30)
- [ ] Final testing + go-live on Vercel

### Phase 2: Enhancement (30-60 days post-launch)
- [ ] Get Help page — eligibility, application process, resources
- [ ] Stories page — testimonial cards with full story view
- [ ] Email confirmation system for donors
- [ ] Database for donation submission tracking
- [ ] Admin dashboard
- [ ] Analytics integration
- [ ] SEO optimization (metadata, OG images, sitemap)
- [ ] Dark mode toggle

---

## HOW TO UPDATE CONTENT (for non-dev updates)

**Almost nothing here needs a developer any more.** Staff edit every page's wording and photos at
`/admin/content` — see "CONTENT EDITOR (CMS)" above.

Still a code change, deliberately:

| Content | Where | Why not in the CMS |
|---------|-------|--------------------|
| Email, phone numbers, address | `ORG` in `constants.ts` | Also used in receipts, PDFs and reminder emails — must not diverge |
| SWIFT bank details | `SWIFT_DETAILS` | Must match the bank and the confirmation emails |
| ~~US check details~~ | Editable since 2026-09-22 at `/admin/content` → Donate → Check giving panel | PDFs and the News card read the same CMS value via `getCheckDetails()` |
| Bank fee amount | `BANK_FEE_USD` | Feeds the donation total calculation |
| Donation amount buttons | `DONATION_AMOUNTS` | Feeds form validation |
| Program URL / fund keys | `PROGRAMS` → `slug`, `fund`, `relatedSlugs` | Routing and fund routing, not copy |
| Navigation menu structure | `Header.tsx`, `Footer.tsx` | Site structure, not copy |

---

## IMPORTANT NOTES

⚠️ **Bank Fee**: `BANK_FEE_USD = 45` (not $50 as previously stated). Donors actively choose whether to cover it. Never hide this cost.

⚠️ **SWIFT Details**: Not sensitive — meant to be shared for receiving payments. Safe to display publicly.

⚠️ **Recurring Donations**: SWIFT is manual. "Recurring" means the donor sets up recurring transfers at their bank. Email reminders in Phase 2.

⚠️ **As-Needed Framing**: Never describe programs as "long-term" or "ongoing welfare." Always use: "as-needed," "emergency basis," "temporary crisis," "through their crisis period."

⚠️ **Faith-Based Language**: Always acknowledge the faith foundation — "faith-grounded," "spiritual," "faith-based." This is core to the organization's identity.

⚠️ **Mobile First**: 70%+ of Uganda web traffic is mobile. Every component must work on small screens first.

⚠️ **Tailwind v4**: There is NO `tailwind.config.js`. All config is in `globals.css` via `@theme {}`. Do not create a tailwind config file.

⚠️ **Program.image is required**: `src/types/index.ts` — `image: string` (not `image?: string`). All 6 programs have images defined.

⚠️ **Google Maps iframe**: The contact page embeds Google Maps via `<iframe>` (no API key needed). The `MAP_SRC` constant is in `contact/page.tsx`. No CSP changes needed.

---

## SESSION WORKFLOW

### Starting a New Session
1. Say: **"Read CLAUDE.md first"**
2. Claude reads this file to get full project context
3. No re-explaining needed — all state is here

### To Update Content Only
1. Edit `src/lib/constants.ts` for data changes
2. Edit specific page files for copy changes
3. Run `npm run build` to verify — must show 18 pages, 0 errors

### To Build a New Page
1. Create `src/app/(marketing)/[page-name]/page.tsx`
2. Use `FadeUp` for scroll animations
3. Hero: full-bleed overlay with a real HSF field photo (see photo map above)
4. Follow section heading pattern: amber rule + label + serif heading
5. Alternate `bg-warm-white` / `bg-white` / `bg-forest-green-50` / `bg-forest-green-900`
6. Run `npm run build` to verify

---

**Last Updated**: 2026-09-09
**Version**: 3.4 — deploy target moved from Netlify to Vercel (GitHub integration); recurring
reminders are now a Vercel Cron route (`/api/cron/recurring-reminders`, needs `CRON_SECRET`)
**Status**: Phase 1 — Feature Complete (19 pages), real donation backend built (Supabase + Resend
+ PDF invoicing + admin view + recurring reminders). Content editor covers all 19 pages plus
programs, testimonials, events and the footer. dfcu SWIFT/BIC code and US check mailing address
are confirmed. Awaiting real impact stats and Supabase/Resend account provisioning from client.
**Next Step**: Provision Supabase/Resend accounts + env vars (unblocks both the donation backend
AND the content editor) → get real impact stats from client → visual QA of the editor on a phone →
go live on Vercel

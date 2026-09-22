import type { Program, Testimonial, NewsUpdate, UpcomingEvent } from '@/types';

// Organization details
export const ORG = {
  name: 'Healthy Steps Foundation',
  email: 'healthystepsfoundation@gmail.com',
  phone: ['+256756231553', '+256782818734'],
  location: {
    country: 'Uganda',
    region: 'Central Region',
    district: 'Wakiso',
    division: 'Ndejje Division',
    ward: 'Ndejje Ward',
    village: 'Mirimu',
  },
} as const;

// SWIFT bank details — dfcu Bank (Kampala Road branch)
export const SWIFT_DETAILS = {
  bankName: 'dfcu Bank',
  accountHolder: 'Healthy Steps Foundation',
  accountNumberUsd: '02660018653045',
  accountNumberUgx: '01660018653014',
  swiftBicCode: 'DFCUUGKA',
  branch: 'dfcu Kampala Road',
  branchAddress: '8H7H+HJ6, Kampala Road, Kampala',
} as const;

export const BANK_FEE_USD = 45;

// US donors: checks payable to First Baptist Sweetwater, designated to HSF.
// Since 2026-09-22 these are the CMS defaults (and the fallback for emptied
// fields): the donate page, the News give card and both donation PDFs all read
// them through getCheckDetails() in cms/collections.ts, never directly.
export const US_CHECK_DETAILS = {
  payableTo: 'First Baptist Sweetwater',
  memo: 'Healthy Steps Foundation',
  mailingAddress: '3800 Wekiva Rd., Longwood, FL 32779',
} as const;

export const DONATION_AMOUNTS = [25, 50, 100, 250, 500] as const;

// ─── Programs ─────────────────────────────────────────────────────────────────
export const PROGRAMS: Program[] = [
  {
    slug: 'food-closet',
    name: 'Food Pantry',
    shortDescription: 'Emergency food support that meets immediate food insecurities for families in need.',
    description:
      'Our food pantry provides emergency food assistance to families facing temporary food insecurities. We understand that mental wellness and physical health are deeply connected. Hunger creates additional stress for families already struggling with mental health challenges, and a family cannot begin to address emotional or spiritual wellness when basic nutritional needs go unmet.\n\nItems are distributed weekly on Saturdays, from 10am to 12 noon, at a location announced the Sunday before. The pantry is stocked with nutritious staples, and we work with each family to assess their immediate needs and provide enough food to help them through their crisis period while they work toward long-term stability. Our approach is respectful and dignified; no family should feel ashamed for needing support during a difficult season.',
    icon: 'UtensilsCrossed',
    image: '/images/programs/food-closet-handoff.jpg',
    imageAlt:
      'A Healthy Steps Foundation staff member handing a bag of food through the distribution window to a woman collecting it, in Wakiso, Uganda',
    fund: 'food-closet',
    whoWeServe:
      'Families facing temporary food insecurity due to job loss, illness, or crisis. We serve single-parent households, elderly-headed families caring for grandchildren, and any household where children are at risk of going hungry.',
    donateBlurb:
      'Your donation goes directly to this program, funding emergency food for families in Ndejje who need it most.',
    relatedSlugs: ['family-medical', 'children-tuition'],
  },
  {
    slug: 'clothing-closet',
    name: 'Clothing Closet',
    shortDescription: 'A weekly low-cost clothing market, priced from UGX 1,000 per item, that keeps every gift a dignified choice.',
    description:
      'Our clothing closet ensures families have access to basic wardrobe needs. We believe that having proper clothing is essential for mental wellness, self-esteem, and the ability to participate fully in community life, work, and education. When a child cannot attend school because they lack a uniform, or a parent feels unable to seek work due to inadequate clothing, the ripple effect on mental health is real.\n\nItems are for purchase at UGX 1,000 each, with shoes and suitcases up to UGX 10,000, at a weekly market held Saturdays from 10am to 12 noon at a location announced the Sunday before. Every shilling received is treated as a donation back to the foundation. Pricing keeps the closet dignified and sustainable rather than a handout; families choose what they need and pay what they can afford for it, for children, adults, and the elderly alike.',
    icon: 'Shirt',
    image: '/images/programs/clothing-closet-family.jpg',
    imageAlt:
      'A mother carrying a Healthy Steps Foundation bag home with her young child, greeted by a volunteer on the path in Ndejje',
    fund: 'clothing-closet',
    whoWeServe:
      'Families facing temporary wardrobe needs due to crisis or hardship. This includes children who need school uniforms to attend class, families recovering from loss, and individuals who lack seasonally appropriate clothing.',
    donateBlurb:
      'Your donation goes directly to this program, keeping affordable clothing within reach for families in Ndejje who need it most.',
    relatedSlugs: ['food-closet', 'children-tuition'],
  },
  {
    slug: 'children-tuition',
    name: 'Children Tuition',
    shortDescription: 'School tuition assistance to keep children in education, supporting up to one semester per family.',
    description:
      'Education is a pathway to breaking cycles of poverty and mental health struggles. Our tuition assistance program ensures children can remain in school even when families face temporary financial hardships. When a child is sent home for unpaid fees, or worse, drops out entirely, the impact on that child\'s mental health, sense of belonging, and future prospects is severe.\n\nWe provide tuition support on an emergency, temporary basis, covering up to one semester per household rather than every child in the family home. This critical intervention prevents children from dropping out during family crises and maintains their educational progress and sense of normalcy. Fees are paid directly to the school to ensure the funds reach their intended purpose.',
    icon: 'GraduationCap',
    image: '/images/programs/children-tuition-backpack.jpg',
    imageAlt:
      'A boy smiling as he holds up a new school backpack he received at a Healthy Steps Foundation back-to-school outreach',
    fund: 'children-tuition',
    whoWeServe:
      'Children whose families face temporary financial hardship that puts their education at immediate risk. We prioritise children already enrolled who are at risk of being sent home or dropping out due to unpaid school fees.',
    donateBlurb:
      'Your donation goes directly to this program, funding school fees that keep children in the classroom through a family crisis.',
    relatedSlugs: ['food-closet', 'resource-materials'],
  },
  {
    slug: 'adult-vocation',
    name: 'Adult Vocational Training',
    shortDescription: 'Vocational skills training for one adult family member in farming, tailoring, or mechanics.',
    description:
      'Economic insecurity is a major contributor to mental health challenges. Our adult vocational program empowers one adult family member with practical skills that lead to sustainable income and long-term family stability. When a parent can provide for their family, the mental health of the entire household improves.\n\nWe offer training in three key areas based on local job market needs: farming techniques, tailoring, and mechanics. Each program provides hands-on training, mentorship, and the tools needed to start generating income. By investing in one family member\'s vocational skills, we create a ripple effect that improves mental wellness for the entire family through increased economic security and restored dignity.',
    icon: 'Briefcase',
    image: '/images/program-adult-vocation.jpg',
    imageAlt:
      'A tailor at work on a sewing machine, of the kind the vocational training programme teaches',
    fund: 'adult-vocation',
    whoWeServe:
      'One adult family member per household, prioritising those already experiencing mental health challenges worsened by economic insecurity. We serve unemployed adults, single parents seeking income, and caregivers who need sustainable skills to support their families.',
    donateBlurb:
      'Your donation goes directly to this program, funding vocational training that helps one family member build a sustainable income.',
    relatedSlugs: ['food-closet', 'family-medical'],
  },
  {
    slug: 'family-medical',
    name: 'Family Medical',
    shortDescription: 'Medical support on a temporary basis to address health emergencies and basic healthcare needs.',
    description:
      'Physical health and mental wellness are inseparable. Our family medical support program addresses healthcare needs that might otherwise go untreated due to financial barriers, preventing physical ailments from compounding mental health struggles. When a parent is ill and cannot access care, the stress on the entire family deepens. When a child\'s illness goes untreated, their development and education suffer.\n\nWe provide medical assistance on a case-by-case basis, through partnership with local clinics, for families facing health emergencies or unable to access basic healthcare. This includes clinic visits, medications, and essential treatments that support overall family wellness. We also provide mental health treatment support as part of our holistic approach to family care. Healthy Steps Foundation is not a medical organisation and does not operate a treatment facility of its own; we connect families to the right care through trusted local partners.',
    icon: 'Stethoscope',
    image: '/images/programs/family-medical-screening.jpg',
    imageAlt:
      'Healthy Steps Foundation medical partners screening two women for blood pressure at a community outreach clinic',
    fund: 'family-medical',
    whoWeServe:
      'Families without the financial means to access healthcare when they need it most. This includes families with children requiring urgent care, pregnant mothers, elderly members, and individuals whose physical health is affecting their mental wellness.',
    donateBlurb:
      'Your donation goes directly to this program, funding medical care for families in Ndejje facing health emergencies.',
    relatedSlugs: ['food-closet', 'resource-materials'],
  },
  {
    slug: 'resource-materials',
    name: 'Resource Materials',
    shortDescription: 'Counseling, financial coaching, and therapeutic and spiritual resources to support holistic family development.',
    description:
      'Knowledge and guided support are as important as meeting a family\'s immediate physical needs. This program brings together our counseling services, financial counseling, therapeutic alternatives, and spiritual and mental wellness materials, all in one holistic bucket of support. We believe mental health cannot be separated from spiritual health, so equipping families with the right people and the right resources matters as much as any material gift.\n\nCounseling with spiritual and mental health professionals is available by appointment only (no walk-ins), provided by volunteers who do not reside on location. Financial counseling helps families build a practical budget and a healthier relationship with money. Therapeutic alternatives, including art, music, and poetic expression, help facilitate mindfulness and relaxation. Written and spiritual resource materials round out the program, available in multiple formats for different literacy levels and learning styles.',
    icon: 'BookOpen',
    image: '/images/programs/resource-materials-outreach.jpg',
    imageAlt:
      'A Healthy Steps Foundation team member crouching to speak with children at an outreach, one of them carrying a box of supplies',
    fund: 'resource-materials',
    whoWeServe:
      'Families across all our programs who benefit from educational and spiritual resources. We also serve community leaders, teachers, and faith leaders who multiply the impact of these materials within their own networks.',
    donateBlurb:
      'Your donation goes directly to this program, funding counseling and resource materials that support holistic family wellness.',
    relatedSlugs: ['children-tuition', 'family-medical'],
  },
];

export const FUND_LABELS: Record<string, string> = {
  'food-closet': 'Food Pantry',
  'clothing-closet': 'Clothing Closet',
  'children-tuition': 'Children Tuition',
  'adult-vocation': 'Adult Vocational Training',
  'family-medical': 'Family Medical',
  'resource-materials': 'Resource Materials',
  'where-needed-most': 'Where Needed Most',
};

// ─── Staff ────────────────────────────────────────────────────────────────────
// Team members now live in the content editor (Site Content → Our Staff), not
// here — keeping a copy in code as well is what caused edits to drift.
// See src/lib/cms/pages/staff.ts for the values the site ships with.

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Charles Kasibante',
    location: 'Makerere Kikoni, Kampala',
    quote:
      'It is such a pleasure and a privilege to serve this community of Makerere Kikoni. We thank Healthy Steps Foundation for inviting us to be a part of such a great partnership in serving the people. We have been able to screen and treat people for hypertension and diabetes mellitus. In addition to medical services, through other partnerships the community was also given bags with essential food items. We thank God for enabling all of us to make such a great impact in the community. May God bless whoever donated to this occasion. Bless you all.',
    program: 'Family Medical',
  },
  {
    id: 't2',
    name: 'Patricia Kayeny',
    location: 'Makerere Kikoni Outreach',
    quote:
      'I would like to take this opportunity to thank Healthy Steps Foundation for supporting us with food items, including soap, sugar, cooking oil, and posho, as well as providing medical consultation. Indeed, it was the hand of God, as this support came at the very time I needed it most. I thank you so much, and may God bless you richly.',
    program: 'Food Pantry & Family Medical',
  },
];

// ─── Impact Stats ─────────────────────────────────────────────────────────────
// The homepage impact numbers now live in the content editor
// (Site Content → Homepage → Impact numbers). See src/lib/cms/pages/home.ts.

// ─── Upcoming Events ────────────────────────────────────────────────────────────
// Sourced from HSF's community outreach calendar. Community Outreach and Back to
// School rotate between Ndejje, Bukasa, and Makerere Kikoni; the exact village is
// announced the Sunday before, so location stays general until then.
export const UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    slug: 'back-to-school-oct-3',
    title: 'Back to School Outreach',
    date: '2026-10-03',
    startTime: '10:00',
    endTime: '12:00',
    location: 'Location announced the Sunday before',
    description:
      'School supplies and support to help children head back to class, first come, first served.',
  },
  {
    slug: 'back-to-school-oct-10',
    title: 'Back to School Outreach',
    date: '2026-10-10',
    startTime: '10:00',
    endTime: '12:00',
    location: 'Location announced the Sunday before',
    description:
      'School supplies and support to help children head back to class, first come, first served.',
  },
  {
    slug: 'back-to-school-oct-17',
    title: 'Back to School Outreach',
    date: '2026-10-17',
    startTime: '10:00',
    endTime: '12:00',
    location: 'Location announced the Sunday before',
    description:
      'School supplies and support to help children head back to class, first come, first served.',
  },
  {
    slug: 'volunteer-gathering-oct-23',
    title: 'Volunteer Gathering',
    date: '2026-10-23',
    startTime: '17:00',
    endTime: '19:00',
    location: 'HSF office',
    description: 'Volunteers gather to plan and strategise for upcoming community needs.',
  },
];

// ─── News & Fundraising Updates ────────────────────────────────────────────────
export const NEWS_UPDATES: NewsUpdate[] = [
  {
    slug: 'summer-2026-events',
    title: 'Healthy Steps Foundation Events',
    date: '2026-06-13',
    excerpt:
      'From a drumming and paint night in Longwood, Florida to a staple food distribution for 100 villagers in Kampala: recapping recent HSF events, and what is next for back-to-school and Christmas.',
    image: '/images/field/distribution-wide.jpg',
    body: [
      'Thank you for participating and donating to recent Healthy Steps Foundation (HSF) events. On May 23, 2026, our organization sponsored the African Drumming, and Paint and Refreshments events in Longwood, Florida. Both events showcased your talents and provided fun and laughter.',
      'On June 13, 2026, HSF held an event in Kampala, Uganda. The event provided staple food items such as sugar, posho (corn flour), oil, and soap for 100 villagers. Unfortunately, many had to be turned away due to limited inventory.',
      'Planning for future events is already underway. In October we seek to host a back-to-school day and provide paper, pencils, pens, folders, notebooks, backpacks, and binders. In December we are planning a Christmas Extravaganza. Due to the generosity of a local Florida organization, we have been blessed with an assortment of toys. This event will also include a clothing market and a food giveaway. The children will be treated with bouncy houses, face painting, balloon twisting, and ice cream.',
      'It is our hope that with each outreach opportunity the number of families served increases. All of these wonderful events are successful because of your continued prayers and love.',
      "What can you do? First and foremost, we need your prayers. Many of you are aware of the Ebola outbreak that has and continues to impact parts of Africa. Considering Uganda's population of approximately 53 million people, with many living on $1.04 per day, news of such a devastating condition further cripples the economy. Therefore, it is easy to understand why a gift of sugar, posho, oil, and soap is so appreciated.",
      'If you would like to pray and donate, please make checks out to First Baptist Sweetwater Church and put Healthy Steps Foundation on the FOR line. The address to mail your checks is 3800 Wekiva Rd., Longwood, FL 32779.',
    ],
    signOff: { name: 'Isaac Oyirwoth', title: 'Director' },
  },
];

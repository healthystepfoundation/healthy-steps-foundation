import { US_CHECK_DETAILS } from '@/lib/constants';
import { icon, image, list, strings, text, textarea, media } from '../fields';
import type { ContentItem, MediaValue, PageSchema } from '../types';

export type DonateContent = {
  heroEyebrow: string;
  heroHeadline: string;
  heroLead: string;
  heroImage: MediaValue;

  formTitle: string;
  formLead: string;

  methodPrompt: string;
  methodSwiftLabel: string;
  methodSwiftSublabel: string;
  methodCheckLabel: string;
  methodCheckSublabel: string;

  swiftStep1Title: string;
  swiftStep2Title: string;
  swiftStep3Title: string;
  swiftSubmitLabel: string;
  swiftDisclaimer: string;

  checkFeeTitle: string;
  checkFeeText: string;
  checkStepsTitle: string;
  checkSteps: string[];
  checkDetailsTitle: string;
  checkPayableTo: string;
  checkMemo: string;
  checkMailingAddress: string;
  checkLinkLabel: string;
  checkLinkUrl: string;
  checkPledgeTitle: string;
  checkPledgeText: string;
  checkSubmitLabel: string;
  checkEmailTitle: string;
  checkEmailText: string;

  secureTitle: string;
  secureText: string;

  questionsTitle: string;
  questionsText: string;

  trustPoints: ContentItem[];
};

/**
 * The slice of the donate content that the client-side giving form needs.
 * The server page fetches once and passes this down as a prop, since the
 * form components are 'use client' and cannot call getPageContent themselves.
 */
export type DonateFormCopy = Pick<
  DonateContent,
  | 'methodPrompt'
  | 'methodSwiftLabel'
  | 'methodSwiftSublabel'
  | 'methodCheckLabel'
  | 'methodCheckSublabel'
  | 'swiftStep1Title'
  | 'swiftStep2Title'
  | 'swiftStep3Title'
  | 'swiftSubmitLabel'
  | 'swiftDisclaimer'
  | 'checkFeeTitle'
  | 'checkFeeText'
  | 'checkStepsTitle'
  | 'checkSteps'
  | 'checkDetailsTitle'
  | 'checkPayableTo'
  | 'checkMemo'
  | 'checkMailingAddress'
  | 'checkLinkLabel'
  | 'checkLinkUrl'
  | 'checkPledgeTitle'
  | 'checkPledgeText'
  | 'checkSubmitLabel'
  | 'checkEmailTitle'
  | 'checkEmailText'
>;

const defaults: DonateContent = {
  heroEyebrow: 'Give Today',
  heroHeadline: 'Donate to Healthy Steps Foundation',
  heroLead:
    'Every gift, no matter the size, reaches a real family in Wakiso, Uganda. US donors can give by check or by SWIFT bank transfer. International donors must use SWIFT bank transfer.',
  heroImage: media(
    '/images/WhatsApp Image 2026-05-21 at 20.31.38 (2).jpeg',
    'Community members supported by Healthy Steps Foundation in Ndejje, Wakiso, Uganda',
  ),

  formTitle: 'Make Your Gift',
  formLead:
    "Choose how you'd like to give below. US donors can give by check or by SWIFT bank transfer. International donors must use SWIFT bank transfer.",

  methodPrompt: 'How would you like to give?',
  methodSwiftLabel: 'International Transfer',
  methodSwiftSublabel: 'SWIFT bank transfer, available worldwide',
  methodCheckLabel: 'US Donors: Give by Check',
  methodCheckSublabel: 'Zero transfer fee when you donate by check',

  swiftStep1Title: 'Gift Details',
  swiftStep2Title: 'Bank Transfer Fee',
  swiftStep3Title: 'Your Information',
  swiftSubmitLabel: 'Get Transfer Instructions',
  swiftDisclaimer:
    'By proceeding, you agree to complete a SWIFT bank transfer using the instructions provided. No payment is taken through this website.',

  checkFeeTitle: 'Zero Transfer Fees',
  checkFeeText:
    'Giving by check avoids the $45 SWIFT transfer fee, so every dollar of your gift reaches families in Wakiso, Uganda.',
  checkStepsTitle: 'How Check Giving Works',
  checkSteps: ['Mail it to First Baptist Sweetwater'],
  checkDetailsTitle: 'Check Details',
  checkPayableTo: US_CHECK_DETAILS.payableTo,
  checkMemo: US_CHECK_DETAILS.memo,
  checkMailingAddress: US_CHECK_DETAILS.mailingAddress,
  checkLinkLabel: '',
  checkLinkUrl: '',
  checkPledgeTitle: 'Confirm Your Pledge',
  checkPledgeText:
    "Tell us what you're giving so we can send you an invoice for your records and follow up once your check arrives.",
  checkSubmitLabel: 'Confirm Pledge',
  checkEmailTitle: 'Prefer to Just Email Us?',
  checkEmailText:
    "Once your check is in the mail, you can also reach us directly and we'll confirm receipt and send a personal thank-you within 2 business days.",

  secureTitle: 'Secure Giving',
  secureText: 'SWIFT or check. No card data is ever stored.',

  questionsTitle: 'Questions?',
  questionsText: "We're happy to help. Reach out any time.",

  trustPoints: [
    {
      icon: 'Shield',
      label: 'Secure Giving',
      desc: 'SWIFT or check. No card data is ever stored',
    },
    {
      icon: 'Heart',
      label: '100% to Families',
      desc: 'Give by check or cover the bank fee so every cent reaches those in need',
    },
    {
      icon: 'Mail',
      label: 'Confirmed in 48 hrs',
      desc: 'We acknowledge every gift personally within 2 business days',
    },
  ],
};

export const donateSchema: PageSchema<DonateContent> = {
  slug: 'donate',
  label: 'Donate',
  description: 'The donate page wording around the giving form.',
  group: 'Pages',
  path: '/donate',
  defaults,
  groups: [
    {
      id: 'hero',
      label: 'Hero',
      description: 'The full-width photo and headline at the top of the donate page.',
      fields: [
        text('heroEyebrow', 'Heading'),
        text('heroHeadline', 'Text under the heading'),
        textarea('heroLead', 'Introduction paragraph', { rows: 4 }),
        image('heroImage', 'Background photo'),
      ],
    },
    {
      id: 'form',
      label: 'Giving form',
      description:
        'The wording above the form. The bank details, amounts and fee are set in the code, since they must match what the bank and the confirmation emails say.',
      fields: [
        text('formTitle', 'Heading'),
        textarea('formLead', 'Body text', { rows: 3 }),
      ],
    },
    {
      id: 'method',
      label: 'How to give boxes',
      description: 'The two boxes where a donor picks between SWIFT transfer and check.',
      fields: [
        text('methodPrompt', 'Question above the boxes'),
        text('methodSwiftLabel', 'International Transfer box: title'),
        text('methodSwiftSublabel', 'International Transfer box: small text'),
        text('methodCheckLabel', 'Check box: title'),
        text('methodCheckSublabel', 'Check box: small text'),
      ],
    },
    {
      id: 'swift-form',
      label: 'SWIFT transfer form',
      description:
        'The wording inside the international transfer form. The field labels, amounts, fee and the bank details in the confirmation are set in the code.',
      fields: [
        text('swiftStep1Title', 'Step 1 heading'),
        text('swiftStep2Title', 'Step 2 heading'),
        text('swiftStep3Title', 'Step 3 heading'),
        text('swiftSubmitLabel', 'Submit button'),
        textarea('swiftDisclaimer', 'Small print under the button', { rows: 3 }),
      ],
    },
    {
      id: 'check',
      label: 'Check giving panel',
      description:
        'The boxes shown when a donor picks check giving. The payable-to, memo and mailing address also print on the pledge and receipt PDFs emailed to donors, so keep them exactly as the church expects.',
      fields: [
        text('checkFeeTitle', 'Green box: title'),
        textarea('checkFeeText', 'Green box: text', {
          rows: 3,
          help: 'If this mentions the transfer fee amount, keep it matching the real fee.',
        }),
        text('checkStepsTitle', 'Step 1 heading'),
        strings('checkSteps', 'Instructions', 'instruction', {
          input: 'text',
          help: 'Each instruction shows as its own numbered line.',
        }),
        text('checkDetailsTitle', 'Step 2 heading'),
        text('checkPayableTo', 'Check details: make payable to', {
          help: 'Also prints on the pledge and receipt PDFs and shows on the News page. If emptied, the original value from the code is used.',
        }),
        text('checkMemo', 'Check details: memo / note line', {
          help: 'Also prints on the pledge PDF and shows on the News page. If emptied, the original value from the code is used.',
        }),
        text('checkMailingAddress', 'Check details: mailing address', {
          help: 'Also prints on the pledge PDF and shows on the News page. If emptied, the original value from the code is used.',
        }),
        text('checkLinkLabel', 'Check details: link text', {
          help: 'Shown as a link under the check details, for example the church website.',
        }),
        text('checkLinkUrl', 'Check details: link address', {
          help: 'Full web address starting with https://. Leave empty to show no link.',
        }),
        text('checkPledgeTitle', 'Step 3 heading'),
        textarea('checkPledgeText', 'Step 3 text', { rows: 3 }),
        text('checkSubmitLabel', 'Submit button'),
        text('checkEmailTitle', 'Step 4 heading'),
        textarea('checkEmailText', 'Step 4 text', {
          rows: 3,
          help: 'The email address and phone numbers below it come from the site contact details.',
        }),
      ],
    },
    {
      id: 'sidebar',
      removable: true,
      label: 'Sidebar',
      fields: [
        text('secureTitle', 'Green card heading'),
        textarea('secureText', 'Green card text', { rows: 2 }),
        text('questionsTitle', 'Questions card heading'),
        textarea('questionsText', 'Questions card text', {
          rows: 2,
          help: 'The email address and phone numbers below it come from the site contact details.',
        }),
      ],
    },
    {
      id: 'trust',
      removable: true,
      label: 'Bottom strip',
      fields: [
        list('trustPoints', 'Points', {
          itemNoun: 'point',
          titleKey: 'label',
          min: 1,
          max: 3,
          help: 'Three reads best. They sit in a single row.',
          blank: { icon: 'Shield', label: '', desc: '' },
          fields: [
            icon('icon', 'Icon'),
            text('label', 'Title'),
            textarea('desc', 'Description', { rows: 2 }),
          ],
        }),
      ],
    },
  ],
};

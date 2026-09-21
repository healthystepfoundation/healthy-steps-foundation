import 'server-only';
import { Document, Page, Text, View, Image, StyleSheet, renderToBuffer } from '@react-pdf/renderer';
import { ORG, US_CHECK_DETAILS, FUND_LABELS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { HSF_LOGO_PNG_DATA_URI } from './logo';
import type { DonationRecord } from '@/types';

// Official donation receipt, issued only after staff confirm the funds arrived
// (admin "Mark received"). Follows the layout US nonprofits use for gift
// acknowledgments: letterhead, receipt number and date, donor and gift tables,
// the goods-and-services statement, and a signature block.
//
// Deliberately absent: any claim of US 501(c)(3) status or an EIN. Healthy
// Steps Foundation is registered in Uganda; US-check gifts are made to First
// Baptist Sweetwater, whose own acknowledgment governs US tax treatment.

const GREEN = '#166534';
const INK = '#292524';
const MUTED = '#78716c';
const RULE = '#d6d3d1';
const FAINT = '#f5f5f4';

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: INK,
    lineHeight: 1.45,
  },

  // Letterhead
  letterhead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 14,
    borderBottom: `2px solid ${GREEN}`,
    marginBottom: 22,
  },
  logo: {
    width: 150,
    height: 50,
    objectFit: 'contain',
  },
  letterheadRight: {
    alignItems: 'flex-end',
  },
  orgName: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: GREEN,
    marginBottom: 2,
  },
  orgMeta: {
    fontSize: 8,
    color: MUTED,
    textAlign: 'right',
  },

  // Title band
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 18,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
  },
  titleMetaBox: {
    alignItems: 'flex-end',
  },
  titleMetaLabel: {
    fontSize: 8,
    color: MUTED,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  titleMetaValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },

  // Two-column info tables
  infoGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 18,
  },
  infoCard: {
    flex: 1,
    border: `1px solid ${RULE}`,
    borderRadius: 4,
    padding: 12,
  },
  infoCardTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: GREEN,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 2,
  },
  infoLabel: {
    width: 82,
    color: MUTED,
    fontSize: 9,
  },
  infoValue: {
    flex: 1,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },

  // Gift table
  table: {
    marginBottom: 6,
  },
  tableHead: {
    flexDirection: 'row',
    backgroundColor: GREEN,
    color: '#ffffff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeadCell: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderBottom: `1px solid ${FAINT}`,
    borderLeft: `1px solid ${RULE}`,
    borderRight: `1px solid ${RULE}`,
  },
  colDescription: { flex: 1 },
  colAmount: { width: 90, textAlign: 'right' },
  totalBand: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: FAINT,
    border: `1px solid ${RULE}`,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    alignItems: 'center',
  },
  totalLabel: {
    flex: 1,
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  totalValue: {
    width: 90,
    textAlign: 'right',
    fontFamily: 'Helvetica-Bold',
    fontSize: 13,
    color: GREEN,
  },

  // Statements
  statement: {
    marginTop: 16,
    fontSize: 9,
    color: INK,
  },
  statementMuted: {
    marginTop: 8,
    fontSize: 8,
    color: MUTED,
  },

  // Signature block
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  signatureBox: {
    width: 200,
  },
  signatureLine: {
    borderBottom: `1px solid ${INK}`,
    height: 28,
    marginBottom: 4,
  },
  signatureName: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  signatureTitle: {
    fontSize: 8,
    color: MUTED,
  },

  footer: {
    position: 'absolute',
    left: 48,
    right: 48,
    bottom: 32,
    paddingTop: 8,
    borderTop: `1px solid ${RULE}`,
    fontSize: 7.5,
    color: MUTED,
    textAlign: 'center',
  },
});

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function DonationReceiptPdf({ record }: { record: DonationRecord }): React.JSX.Element {
  const donorName = `${record.firstName} ${record.lastName}`;
  const receivedDate = formatDate(record.receivedAt ?? new Date().toISOString());
  const pledgedDate = formatDate(record.createdAt);
  const fundLabel = FUND_LABELS[record.fund] ?? record.fund;
  const isSwift = record.method === 'swift';

  return (
    <Document
      title={`Donation Receipt ${record.invoiceNumber}`}
      author={ORG.name}
      subject={`Donation receipt for ${donorName}`}
    >
      <Page size="A4" style={styles.page}>
        {/* Letterhead */}
        <View style={styles.letterhead}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf Image has no alt prop */}
          <Image src={HSF_LOGO_PNG_DATA_URI} style={styles.logo} />
          <View style={styles.letterheadRight}>
            <Text style={styles.orgName}>{ORG.name}</Text>
            <Text style={styles.orgMeta}>
              {ORG.location.village}, {ORG.location.division}
            </Text>
            <Text style={styles.orgMeta}>
              {ORG.location.district}, {ORG.location.country}
            </Text>
            <Text style={styles.orgMeta}>{ORG.email}</Text>
            <Text style={styles.orgMeta}>{ORG.phone.join(' / ')}</Text>
          </View>
        </View>

        {/* Title + receipt meta */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>DONATION RECEIPT</Text>
          <View style={styles.titleMetaBox}>
            <Text style={styles.titleMetaLabel}>Receipt No.</Text>
            <Text style={styles.titleMetaValue}>{record.invoiceNumber}</Text>
            <Text style={[styles.titleMetaLabel, { marginTop: 4 }]}>Date Received</Text>
            <Text style={styles.titleMetaValue}>{receivedDate}</Text>
          </View>
        </View>

        {/* Donor and payment info */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Received From</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{donorName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{record.email}</Text>
            </View>
            {record.country ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Country</Text>
                <Text style={styles.infoValue}>{record.country}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Payment Details</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Method</Text>
              <Text style={styles.infoValue}>
                {isSwift ? 'SWIFT bank transfer' : `Check (payable to ${US_CHECK_DETAILS.payableTo})`}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Pledged on</Text>
              <Text style={styles.infoValue}>{pledgedDate}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Gift type</Text>
              <Text style={styles.infoValue}>
                {record.donationType === 'recurring'
                  ? `Recurring (${record.recurringFrequency ?? 'recurring'})`
                  : 'One-time gift'}
              </Text>
            </View>
          </View>
        </View>

        {/* Gift table */}
        <View style={styles.table}>
          <View style={styles.tableHead}>
            <Text style={[styles.tableHeadCell, styles.colDescription]}>Description</Text>
            <Text style={[styles.tableHeadCell, styles.colAmount]}>Amount</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.colDescription}>
              Charitable contribution, designated to: {fundLabel}
            </Text>
            <Text style={[styles.colAmount, { fontFamily: 'Helvetica-Bold' }]}>
              {formatCurrency(record.amount)}
            </Text>
          </View>
          {record.coverBankFee ? (
            <View style={styles.tableRow}>
              <Text style={styles.colDescription}>Bank transfer fee, covered by donor</Text>
              <Text style={[styles.colAmount, { fontFamily: 'Helvetica-Bold' }]}>
                {formatCurrency(record.bankFee)}
              </Text>
            </View>
          ) : null}
          <View style={styles.totalBand}>
            <Text style={styles.totalLabel}>Total Received</Text>
            <Text style={styles.totalValue}>{formatCurrency(record.totalAmount)}</Text>
          </View>
        </View>

        {/* Required-style statements */}
        <Text style={styles.statement}>
          No goods or services were provided in exchange for this contribution. Your entire gift
          supports the programs of {ORG.name}.
        </Text>
        <Text style={styles.statementMuted}>
          {isSwift
            ? `${ORG.name} is a community-based organization registered in Uganda. This receipt acknowledges your gift; whether it qualifies for a tax deduction depends on the laws of your country. Please consult your tax advisor.`
            : `Checks are made payable to ${US_CHECK_DETAILS.payableTo}, which receives US check gifts on behalf of ${ORG.name}. For US tax purposes, please retain the acknowledgment issued by ${US_CHECK_DETAILS.payableTo}; this receipt confirms how your gift was designated and applied.`}
        </Text>

        <Text style={[styles.statement, { marginTop: 14 }]}>
          Thank you, {record.firstName}. Your generosity helps families in Wakiso, Uganda take
          their next step toward mental wellness and stability.
        </Text>

        {/* Signature */}
        <View style={styles.signatureRow}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>Isaac Oyirwoth</Text>
            <Text style={styles.signatureTitle}>Director, {ORG.name}</Text>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>Date</Text>
            <Text style={styles.signatureTitle}>{receivedDate}</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Receipt {record.invoiceNumber} · Issued by {ORG.name}, {ORG.location.village},{' '}
          {ORG.location.district}, {ORG.location.country} · Questions? Write to {ORG.email}{' '}
          referencing this receipt number.
        </Text>
      </Page>
    </Document>
  );
}

export async function renderDonationReceiptPdf(record: DonationRecord): Promise<Buffer> {
  return renderToBuffer(<DonationReceiptPdf record={record} />);
}

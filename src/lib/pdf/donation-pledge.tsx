import 'server-only';
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer';
import { ORG, SWIFT_DETAILS, US_CHECK_DETAILS, FUND_LABELS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import type { DonationRecord } from '@/types';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#292524',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2px solid #166534',
    paddingBottom: 12,
  },
  orgName: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#166534',
    marginBottom: 2,
  },
  orgMeta: {
    fontSize: 9,
    color: '#78716c',
  },
  title: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    marginTop: 14,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 9,
    color: '#78716c',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
    color: '#166534',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    borderBottom: '1px solid #f5f5f4',
  },
  rowLabel: {
    color: '#78716c',
  },
  rowValue: {
    fontFamily: 'Helvetica-Bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
    marginTop: 4,
    borderTop: '1px solid #d6d3d1',
  },
  totalLabel: {
    fontFamily: 'Helvetica-Bold',
  },
  totalValue: {
    fontFamily: 'Helvetica-Bold',
    color: '#166534',
    fontSize: 12,
  },
  footer: {
    marginTop: 24,
    paddingTop: 12,
    borderTop: '1px solid #d6d3d1',
    fontSize: 8,
    color: '#78716c',
    lineHeight: 1.4,
  },
});

function pendingOr(value: string): string {
  return value && value.length > 0 ? value : 'Pending (contact us for this detail)';
}

function InstructionRow({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export function DonationPledgePdf({ record }: { record: DonationRecord }): React.JSX.Element {
  const donorName = `${record.firstName} ${record.lastName}`;
  const createdDate = new Date(record.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const fundLabel = FUND_LABELS[record.fund] ?? record.fund;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.orgName}>{ORG.name}</Text>
          <Text style={styles.orgMeta}>
            {ORG.location.village}, {ORG.location.division}, {ORG.location.district}, {ORG.location.country}
          </Text>
          <Text style={styles.orgMeta}>{ORG.email} · {ORG.phone.join(' / ')}</Text>

          <Text style={styles.title}>Donation Pledge Confirmation #{record.invoiceNumber}</Text>
          <Text style={styles.subtitle}>Issued {createdDate}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Donor</Text>
          <InstructionRow label="Name" value={donorName} />
          <InstructionRow label="Email" value={record.email} />
          {record.country ? <InstructionRow label="Country" value={record.country} /> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gift Details</Text>
          <InstructionRow label="Fund" value={fundLabel} />
          <InstructionRow
            label="Type"
            value={
              record.donationType === 'recurring'
                ? `Recurring (${record.recurringFrequency ?? 'frequency pending'})`
                : 'One-time gift'
            }
          />
          <InstructionRow label="Donation amount" value={formatCurrency(record.amount)} />
          {record.coverBankFee ? (
            <InstructionRow label="Bank transfer fee (covered by donor)" value={formatCurrency(record.bankFee)} />
          ) : null}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total to transfer</Text>
            <Text style={styles.totalValue}>{formatCurrency(record.totalAmount)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {record.method === 'swift' ? 'SWIFT Bank Transfer Instructions' : 'Check Mailing Instructions'}
          </Text>
          {record.method === 'swift' ? (
            <>
              <InstructionRow label="Bank Name" value={SWIFT_DETAILS.bankName} />
              <InstructionRow label="Account Holder" value={SWIFT_DETAILS.accountHolder} />
              <InstructionRow label="Account Number (USD)" value={SWIFT_DETAILS.accountNumberUsd} />
              <InstructionRow label="Account Number (UGX)" value={SWIFT_DETAILS.accountNumberUgx} />
              <InstructionRow label="SWIFT / BIC Code" value={pendingOr(SWIFT_DETAILS.swiftBicCode)} />
              <InstructionRow label="Branch" value={SWIFT_DETAILS.branch} />
              <InstructionRow label="Branch Address" value={SWIFT_DETAILS.branchAddress} />
            </>
          ) : (
            <>
              <InstructionRow label="Make payable to" value={US_CHECK_DETAILS.payableTo} />
              <InstructionRow label="Memo / note line" value={US_CHECK_DETAILS.memo} />
              <InstructionRow label="Mailing address" value={pendingOr(US_CHECK_DETAILS.mailingAddress)} />
            </>
          )}
        </View>

        <Text style={styles.footer}>
          This document confirms your donation pledge. It is not a receipt of funds received:
          funds are recorded as received once your {record.method === 'swift' ? 'SWIFT transfer' : 'check'}{' '}
          has been processed. Please email proof of your{' '}
          {record.method === 'swift' ? 'transfer' : 'mailed check'} to {ORG.email} referencing invoice #
          {record.invoiceNumber} so we can confirm receipt and send a thank-you acknowledgment.
          {record.donationType === 'recurring'
            ? ` As a recurring ${record.recurringFrequency} donor, we'll also email you a reminder each period since ${record.method === 'swift' ? 'SWIFT' : 'check'} giving is manual, not automatic.`
            : ''}
        </Text>
      </Page>
    </Document>
  );
}

export async function renderDonationPledgePdf(record: DonationRecord): Promise<Buffer> {
  return renderToBuffer(<DonationPledgePdf record={record} />);
}

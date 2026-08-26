import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const INK = "#1c1614";
const MUTED = "#6b6360";
const ACCENT = "#742f26";
const LINE = "#e3ddda";

const styles = StyleSheet.create({
  page: { paddingTop: 44, paddingBottom: 56, paddingHorizontal: 48, fontSize: 9.5, fontFamily: "Helvetica", color: INK },

  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 26 },
  brandBlock: { maxWidth: 280 },
  brandName: { fontSize: 15, fontFamily: "Helvetica-Bold", color: ACCENT, marginBottom: 4 },
  metaLine: { fontSize: 8.5, color: MUTED, lineHeight: 1.5 },

  docBlock: { alignItems: "flex-end" },
  docTitle: { fontSize: 18, fontFamily: "Helvetica-Bold", color: INK, marginBottom: 6 },
  docMetaRow: { flexDirection: "row", gap: 6, marginBottom: 2 },
  docMetaLabel: { fontSize: 8.5, color: MUTED },
  docMetaValue: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: INK },

  section: { marginBottom: 18 },
  sectionLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: MUTED, letterSpacing: 0.6, marginBottom: 5 },
  billToName: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  billToLine: { fontSize: 9, color: MUTED, lineHeight: 1.5 },

  table: { borderTopWidth: 1.2, borderTopColor: ACCENT, marginBottom: 4 },
  tableHeader: { flexDirection: "row", paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: LINE },
  tableHeaderText: { fontSize: 8, fontFamily: "Helvetica-Bold", color: MUTED, letterSpacing: 0.4 },
  tableRow: { flexDirection: "row", paddingVertical: 7, borderBottomWidth: 0.75, borderBottomColor: LINE },
  colDesc: { flex: 3 },
  colQty: { flex: 0.8, textAlign: "right" },
  colPrice: { flex: 1.1, textAlign: "right" },
  colTotal: { flex: 1.1, textAlign: "right" },

  totalsBlock: { alignSelf: "flex-end", width: 220, marginTop: 10 },
  totalsRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  totalsLabel: { fontSize: 9, color: MUTED },
  totalsValue: { fontSize: 9, color: INK },
  grandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 7,
    marginTop: 3,
    borderTopWidth: 1,
    borderTopColor: INK,
  },
  grandLabel: { fontSize: 11, fontFamily: "Helvetica-Bold" },
  grandValue: { fontSize: 13, fontFamily: "Helvetica-Bold", color: ACCENT },

  paymentBlock: { marginTop: 22, paddingTop: 14, borderTopWidth: 0.75, borderTopColor: LINE },
  paymentRow: { flexDirection: "row", gap: 28, marginBottom: 4 },
  paymentLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: MUTED, letterSpacing: 0.4, width: 90 },
  paymentValue: { fontSize: 9, color: INK },

  notesBlock: { marginTop: 16 },
  notesText: { fontSize: 8.5, color: MUTED, lineHeight: 1.5 },

  footer: {
    position: "absolute",
    bottom: 28,
    left: 48,
    right: 48,
    paddingTop: 10,
    borderTopWidth: 0.75,
    borderTopColor: LINE,
  },
  footerNotice: { fontSize: 7.5, color: MUTED, lineHeight: 1.5 },
  pageNumber: {
    position: "absolute",
    bottom: 28,
    right: 48,
    fontSize: 7.5,
    color: MUTED,
  },
});

type InvoicePdfProps = {
  number: string;
  issueDate: Date;
  dueDate: Date;
  statusLabel: string;
  currency: string;
  emitter: {
    name: string;
    rfc?: string | null;
    address?: string | null;
    phone?: string | null;
  };
  client: {
    name: string;
    company?: string | null;
    rfc?: string | null;
    address?: string | null;
    email?: string | null;
  };
  items: { description: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  applyIva: boolean;
  ivaRate: number;
  iva: number;
  total: number;
  paymentMethod?: string | null;
  notes?: string | null;
};

function money(n: number, currency: string) {
  return `$${n.toLocaleString("es-MX", { minimumFractionDigits: 2 })} ${currency}`;
}

export function InvoicePdf({
  number,
  issueDate,
  dueDate,
  statusLabel,
  currency,
  emitter,
  client,
  items,
  subtotal,
  applyIva,
  ivaRate,
  iva,
  total,
  paymentMethod,
  notes,
}: InvoicePdfProps) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.brandBlock}>
            <Text style={styles.brandName}>{emitter.name}</Text>
            {emitter.rfc && <Text style={styles.metaLine}>RFC: {emitter.rfc}</Text>}
            {emitter.address && <Text style={styles.metaLine}>{emitter.address}</Text>}
            {emitter.phone && <Text style={styles.metaLine}>Tel. {emitter.phone}</Text>}
          </View>
          <View style={styles.docBlock}>
            <Text style={styles.docTitle}>RECIBO</Text>
            <View style={styles.docMetaRow}>
              <Text style={styles.docMetaLabel}>Folio</Text>
              <Text style={styles.docMetaValue}>{number}</Text>
            </View>
            <View style={styles.docMetaRow}>
              <Text style={styles.docMetaLabel}>Emisión</Text>
              <Text style={styles.docMetaValue}>{issueDate.toLocaleDateString("es-MX")}</Text>
            </View>
            <View style={styles.docMetaRow}>
              <Text style={styles.docMetaLabel}>Vence</Text>
              <Text style={styles.docMetaValue}>{dueDate.toLocaleDateString("es-MX")}</Text>
            </View>
            <View style={styles.docMetaRow}>
              <Text style={styles.docMetaLabel}>Estado</Text>
              <Text style={styles.docMetaValue}>{statusLabel}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>FACTURAR A</Text>
          <Text style={styles.billToName}>{client.company || client.name}</Text>
          {client.company && <Text style={styles.billToLine}>{client.name}</Text>}
          {client.rfc && <Text style={styles.billToLine}>RFC: {client.rfc}</Text>}
          {client.address && <Text style={styles.billToLine}>{client.address}</Text>}
          {client.email && <Text style={styles.billToLine}>{client.email}</Text>}
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colDesc]}>CONCEPTO</Text>
            <Text style={[styles.tableHeaderText, styles.colQty]}>CANT.</Text>
            <Text style={[styles.tableHeaderText, styles.colPrice]}>P. UNITARIO</Text>
            <Text style={[styles.tableHeaderText, styles.colTotal]}>IMPORTE</Text>
          </View>
          {items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colDesc}>{item.description}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{money(item.unitPrice, currency)}</Text>
              <Text style={styles.colTotal}>{money(item.quantity * item.unitPrice, currency)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsBlock}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal</Text>
            <Text style={styles.totalsValue}>{money(subtotal, currency)}</Text>
          </View>
          {applyIva && (
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>IVA ({ivaRate}%)</Text>
              <Text style={styles.totalsValue}>{money(iva, currency)}</Text>
            </View>
          )}
          <View style={styles.grandRow}>
            <Text style={styles.grandLabel}>Total</Text>
            <Text style={styles.grandValue}>{money(total, currency)}</Text>
          </View>
        </View>

        <View style={styles.paymentBlock}>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>FORMA DE PAGO</Text>
            <Text style={styles.paymentValue}>{paymentMethod || "No especificada"}</Text>
          </View>
        </View>

        {notes && (
          <View style={styles.notesBlock}>
            <Text style={styles.sectionLabel}>NOTAS Y CONDICIONES</Text>
            <Text style={styles.notesText}>{notes}</Text>
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text style={styles.footerNotice}>
            Este documento es un recibo de cobro emitido por {emitter.name} y no constituye un Comprobante Fiscal
            Digital por Internet (CFDI) conforme a las disposiciones del SAT. Si requiere una factura fiscal, deberá
            solicitarla y timbrarla por separado.
          </Text>
        </View>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
}

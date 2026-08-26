import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  brand: { fontSize: 22, fontWeight: 700, color: "#c11313" },
  title: { fontSize: 16, fontWeight: 700, marginBottom: 4 },
  muted: { color: "#666666" },
  section: { marginBottom: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  table: { marginTop: 12, borderTopWidth: 2, borderTopColor: "#c11313" },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#c11313",
    color: "#ffffff",
    padding: 6,
    fontWeight: 700,
  },
  tableRow: { flexDirection: "row", padding: 6, borderBottomWidth: 1, borderBottomColor: "#eeeeee" },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: "right" },
  colPrice: { flex: 1, textAlign: "right" },
  colTotal: { flex: 1, textAlign: "right" },
  totalRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 12 },
  totalLabel: { fontSize: 14, fontWeight: 700, marginRight: 12 },
  totalValue: { fontSize: 14, fontWeight: 700, color: "#c11313" },
});

type InvoicePdfProps = {
  number: string;
  issueDate: Date;
  dueDate: Date;
  status: string;
  client: { name: string; company?: string | null; email?: string | null };
  items: { description: string; quantity: number; unitPrice: number }[];
  notes?: string | null;
};

export function InvoicePdf({ number, issueDate, dueDate, status, client, items, notes }: InvoicePdfProps) {
  const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>Kobrex</Text>
          <View>
            <Text style={styles.title}>Factura {number}</Text>
            <Text style={styles.muted}>Estado: {status}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text>Cliente: {client.name}</Text>
            <Text>Fecha de emisión: {issueDate.toLocaleDateString("es-MX")}</Text>
          </View>
          {client.company && (
            <View style={styles.row}>
              <Text>Empresa: {client.company}</Text>
              <Text>Fecha de vencimiento: {dueDate.toLocaleDateString("es-MX")}</Text>
            </View>
          )}
          {client.email && <Text>Email: {client.email}</Text>}
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDesc}>Descripción</Text>
            <Text style={styles.colQty}>Cant.</Text>
            <Text style={styles.colPrice}>Precio</Text>
            <Text style={styles.colTotal}>Total</Text>
          </View>
          {items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colDesc}>{item.description}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>${item.unitPrice.toFixed(2)}</Text>
              <Text style={styles.colTotal}>${(item.quantity * item.unitPrice).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)} MXN</Text>
        </View>

        {notes && (
          <View style={{ marginTop: 24 }}>
            <Text style={{ fontWeight: 700, marginBottom: 4 }}>Notas:</Text>
            <Text style={styles.muted}>{notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}

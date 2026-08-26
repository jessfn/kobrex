import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 11, fontFamily: "Helvetica", lineHeight: 1.5 },
  brand: { fontSize: 18, fontWeight: 700, color: "#c11313", marginBottom: 24 },
  title: { fontSize: 15, fontWeight: 700, marginBottom: 16 },
  body: { whiteSpace: "pre-wrap" },
});

export function ContractPdf({ title, content }: { title: string; content: string }) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.brand}>Kobrex</Text>
        <Text style={styles.title}>{title}</Text>
        <View>
          {content.split("\n").map((line, i) => (
            <Text key={i} style={styles.body}>
              {line || " "}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}

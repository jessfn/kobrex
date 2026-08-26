import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const INK = "#1c1614";
const MUTED = "#6b6360";
const ACCENT = "#742f26";
const LINE = "#e3ddda";

const styles = StyleSheet.create({
  page: {
    paddingTop: 44,
    paddingBottom: 56,
    paddingHorizontal: 52,
    fontSize: 9.5,
    fontFamily: "Helvetica",
    color: INK,
    lineHeight: 1.5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 22,
    paddingBottom: 14,
    borderBottomWidth: 1.2,
    borderBottomColor: ACCENT,
  },
  brandName: { fontSize: 13, fontFamily: "Helvetica-Bold", color: ACCENT },
  metaLine: { fontSize: 8, color: MUTED, textAlign: "right" },
  title: { fontSize: 14, fontFamily: "Helvetica-Bold", textAlign: "center", marginBottom: 16, letterSpacing: 0.3 },
  paragraph: { fontSize: 9.5, marginBottom: 10, textAlign: "justify" },
  sectionHeading: { fontSize: 9.5, fontFamily: "Helvetica-Bold", marginTop: 4, marginBottom: 6 },
  signatures: { flexDirection: "row", justifyContent: "space-between", marginTop: 44 },
  signatureBlock: { width: "42%", alignItems: "center" },
  signatureLine: { borderTopWidth: 1, borderTopColor: INK, width: "100%", marginBottom: 4 },
  signatureName: { fontSize: 9, fontFamily: "Helvetica-Bold", textAlign: "center" },
  signatureRole: { fontSize: 8, color: MUTED, textAlign: "center" },
  disclaimer: { marginTop: 30, paddingTop: 10, borderTopWidth: 0.75, borderTopColor: LINE },
  disclaimerText: { fontSize: 7.5, color: MUTED, lineHeight: 1.5 },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 52,
    right: 52,
  },
  pageNumber: {
    position: "absolute",
    bottom: 28,
    right: 52,
    fontSize: 7.5,
    color: MUTED,
  },
});

function splitBody(content: string) {
  // Separa el bloque de firmas y el aviso legal (líneas finales) del cuerpo narrativo,
  // para poder renderizarlos con su propio layout en el PDF.
  const marker = "_________________________";
  const idx = content.indexOf(marker);
  if (idx === -1) return { body: content, signatures: null as string | null };
  return { body: content.slice(0, idx).trim(), signatures: content.slice(idx).trim() };
}

const SECTION_HEADING = /^([A-ZÁÉÍÓÚÑ]{2,}[A-ZÁÉÍÓÚÑ0-9 .,ÑÜ]*)$/;

export function ContractPdf({
  title,
  content,
  emitterName,
  folio,
  date,
}: {
  title: string;
  content: string;
  emitterName: string;
  folio: string;
  date: Date;
}) {
  const { body } = splitBody(content);
  const paragraphs = body.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brandName}>{emitterName}</Text>
          <View>
            <Text style={styles.metaLine}>Contrato N.º {folio}</Text>
            <Text style={styles.metaLine}>{date.toLocaleDateString("es-MX")}</Text>
          </View>
        </View>

        <Text style={styles.title}>{title.toUpperCase()}</Text>

        {paragraphs.map((p, i) => {
          const trimmed = p.trim();
          const isHeading = SECTION_HEADING.test(trimmed) && trimmed.length < 70;
          return (
            <Text key={i} style={isHeading ? styles.sectionHeading : styles.paragraph}>
              {trimmed}
            </Text>
          );
        })}

        <View style={styles.signatures}>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>{emitterName}</Text>
            <Text style={styles.signatureRole}>EL PRESTADOR</Text>
          </View>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}> </Text>
            <Text style={styles.signatureRole}>EL CLIENTE</Text>
          </View>
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Este documento es una plantilla generada automáticamente con fines informativos y no constituye asesoría
            legal. Se recomienda su revisión por un profesional del derecho antes de su firma.
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

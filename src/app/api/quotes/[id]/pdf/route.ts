import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { QuotePdf } from "@/lib/pdf/QuotePdf";
import { invoiceSubtotal } from "@/lib/invoice-utils";

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await context.params;

  const [quote, emitter] = await Promise.all([
    prisma.quote.findFirst({
      where: { id, userId: session.user.id },
      include: { client: true, items: true },
    }),
    prisma.user.findUniqueOrThrow({ where: { id: session.user.id } }),
  ]);

  if (!quote) return NextResponse.json({ error: "No encontrada" }, { status: 404 });

  const items = quote.items.map((item) => ({
    description: item.description,
    quantity: Number(item.quantity),
    unitPrice: Number(item.unitPrice),
  }));

  const buffer = await renderToBuffer(
    QuotePdf({
      number: quote.number,
      issueDate: quote.issueDate,
      validUntil: quote.validUntil,
      emitter: {
        name: emitter.businessName || emitter.name,
        rfc: emitter.rfc,
        address: emitter.fiscalAddress,
        phone: emitter.phone,
      },
      client: quote.client,
      items,
      total: invoiceSubtotal(quote.items),
      notes: quote.notes,
    })
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="cotizacion-${quote.number}.pdf"`,
    },
  });
}

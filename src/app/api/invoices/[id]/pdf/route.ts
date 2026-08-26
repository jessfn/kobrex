import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { InvoicePdf } from "@/lib/pdf/InvoicePdf";
import { effectiveStatus, invoiceBreakdown } from "@/lib/invoice-utils";

const statusLabel = { PENDING: "Pendiente", PAID: "Pagado", OVERDUE: "Vencido", CANCELLED: "Cancelado" };

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await context.params;

  const [invoice, emitter] = await Promise.all([
    prisma.invoice.findFirst({
      where: { id, userId: session.user.id },
      include: { client: true, items: true },
    }),
    prisma.user.findUniqueOrThrow({ where: { id: session.user.id } }),
  ]);

  if (!invoice) return NextResponse.json({ error: "No encontrada" }, { status: 404 });

  const items = invoice.items.map((item) => ({
    description: item.description,
    quantity: Number(item.quantity),
    unitPrice: Number(item.unitPrice),
  }));
  const { subtotal, iva, total } = invoiceBreakdown(invoice.items, invoice.applyIva, invoice.ivaRate);

  const buffer = await renderToBuffer(
    InvoicePdf({
      number: invoice.number,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      statusLabel: statusLabel[effectiveStatus(invoice.status, invoice.dueDate)],
      currency: invoice.currency,
      emitter: {
        name: emitter.businessName || emitter.name,
        rfc: emitter.rfc,
        address: emitter.fiscalAddress,
        phone: emitter.phone,
      },
      client: invoice.client,
      items,
      subtotal,
      applyIva: invoice.applyIva,
      ivaRate: Number(invoice.ivaRate),
      iva,
      total,
      paymentMethod: invoice.paymentMethod,
      notes: invoice.notes,
    })
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="recibo-${invoice.number}.pdf"`,
    },
  });
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { invoiceBreakdown, effectiveStatus } from "@/lib/invoice-utils";
import { toCsv } from "@/lib/csv";

const statusLabel = { PENDING: "Pendiente", PAID: "Pagado", OVERDUE: "Vencido", CANCELLED: "Cancelado" };

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const invoices = await prisma.invoice.findMany({
    where: { userId: session.user.id },
    include: { client: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  const rows = invoices.map((inv) => {
    const { subtotal, iva, total } = invoiceBreakdown(inv.items, inv.applyIva, inv.ivaRate);
    return [
      inv.number,
      inv.client.name,
      inv.issueDate.toLocaleDateString("es-MX"),
      inv.dueDate.toLocaleDateString("es-MX"),
      subtotal.toFixed(2),
      iva.toFixed(2),
      total.toFixed(2),
      statusLabel[effectiveStatus(inv.status, inv.dueDate)],
      inv.paymentMethod ?? "",
    ];
  });

  const csv = toCsv(
    ["Folio", "Cliente", "Fecha emisión", "Fecha vencimiento", "Subtotal", "IVA", "Total", "Estado", "Forma de pago"],
    rows
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="recibos.csv"`,
    },
  });
}

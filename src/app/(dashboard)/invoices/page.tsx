import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Badge, Button, Card } from "@/components/ui";
import { invoiceTotal, effectiveStatus } from "@/lib/invoice-utils";
import { InvoiceRowActions } from "./InvoiceRowActions";

const statusTone = { PENDING: "warning", PAID: "success", OVERDUE: "danger", CANCELLED: "default" } as const;
const statusLabel = { PENDING: "Pendiente", PAID: "Pagada", OVERDUE: "Vencida", CANCELLED: "Cancelada" };

export default async function InvoicesPage() {
  const session = await auth();
  const invoices = await prisma.invoice.findMany({
    where: { userId: session!.user.id },
    include: { client: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-black tracking-tight text-brand-800">Facturas</h1>
        <Link href="/invoices/new">
          <Button>+ Nueva factura</Button>
        </Link>
      </div>

      {invoices.length === 0 ? (
        <Card className="text-center text-brand-700">Aún no tienes facturas.</Card>
      ) : (
        <div className="overflow-x-auto rounded-2xl border-2 border-[var(--color-border)]">
          <table className="w-full min-w-[640px] border-collapse bg-[var(--color-surface)] text-sm">
            <thead>
              <tr className="bg-brand-600 text-left text-white">
                <th className="px-4 py-3 font-extrabold"># </th>
                <th className="px-4 py-3 font-extrabold">Cliente</th>
                <th className="px-4 py-3 font-extrabold">Vence</th>
                <th className="px-4 py-3 font-extrabold">Total</th>
                <th className="px-4 py-3 font-extrabold">Estado</th>
                <th className="px-4 py-3 font-extrabold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => {
                const status = effectiveStatus(inv.status, inv.dueDate);
                return (
                  <tr key={inv.id} className="border-t border-[var(--color-border)]">
                    <td className="px-4 py-3 font-bold text-brand-900">{inv.number}</td>
                    <td className="px-4 py-3">{inv.client.name}</td>
                    <td className="px-4 py-3">{inv.dueDate.toLocaleDateString("es-MX")}</td>
                    <td className="px-4 py-3 font-bold">
                      ${invoiceTotal(inv.items).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={statusTone[status]}>{statusLabel[status]}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <InvoiceRowActions id={inv.id} paid={inv.status === "PAID"} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

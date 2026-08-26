import Link from "next/link";
import { Plus } from "lucide-react";
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
        <h1 className="text-2xl font-semibold tracking-tight">Facturas</h1>
        <Link href="/invoices/new">
          <Button>
            <Plus size={15} strokeWidth={2} />
            Nueva factura
          </Button>
        </Link>
      </div>

      {invoices.length === 0 ? (
        <Card className="text-center text-[var(--color-text-muted)]">Aún no tienes facturas.</Card>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
          <table className="w-full min-w-[640px] border-collapse bg-[var(--color-surface)] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-text-muted)]">
                <th className="px-4 py-3 text-xs font-medium">#</th>
                <th className="px-4 py-3 text-xs font-medium">Cliente</th>
                <th className="px-4 py-3 text-xs font-medium">Vence</th>
                <th className="px-4 py-3 text-xs font-medium">Total</th>
                <th className="px-4 py-3 text-xs font-medium">Estado</th>
                <th className="px-4 py-3 text-xs font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => {
                const status = effectiveStatus(inv.status, inv.dueDate);
                return (
                  <tr key={inv.id} className="border-t border-[var(--color-border)] transition-colors duration-150 hover:bg-[var(--color-surface-muted)]">
                    <td className="px-4 py-3 font-medium">{inv.number}</td>
                    <td className="px-4 py-3">{inv.client.name}</td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">{inv.dueDate.toLocaleDateString("es-MX")}</td>
                    <td className="px-4 py-3 font-medium">
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

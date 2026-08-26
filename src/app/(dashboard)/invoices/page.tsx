import Link from "next/link";
import { Plus, Download, Receipt } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Badge, Button } from "@/components/ui";
import { EmptyState } from "@/components/EmptyState";
import { invoiceBreakdown, effectiveStatus } from "@/lib/invoice-utils";
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
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Receipt size={17} strokeWidth={1.75} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Recibos</h1>
        </div>
        <div className="flex gap-2">
          {invoices.length > 0 && (
            <Link href="/api/invoices/export">
              <Button variant="ghost">
                <Download size={15} strokeWidth={2} />
                Exportar CSV
              </Button>
            </Link>
          )}
          <Link href="/invoices/new">
            <Button>
              <Plus size={15} strokeWidth={2} />
              Nuevo recibo
            </Button>
          </Link>
        </div>
      </div>

      {invoices.length === 0 ? (
        <EmptyState
          icon={Receipt}
          tone="emerald"
          title="Aún no tienes recibos"
          description="Crea tu primer recibo para empezar a cobrarle a tus clientes con un documento profesional."
          actionHref="/invoices/new"
          actionLabel="Crear recibo"
        />
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
                      $
                      {invoiceBreakdown(inv.items, inv.applyIva, inv.ivaRate).total.toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                      })}
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

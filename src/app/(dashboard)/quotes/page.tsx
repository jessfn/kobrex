import Link from "next/link";
import { Plus, FileSpreadsheet } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Badge, Button } from "@/components/ui";
import { EmptyState } from "@/components/EmptyState";
import { invoiceSubtotal } from "@/lib/invoice-utils";
import { QuoteRowActions } from "./QuoteRowActions";

const statusLabel = { DRAFT: "Borrador", SENT: "Enviada", ACCEPTED: "Aceptada", REJECTED: "Rechazada", CONVERTED: "Convertida" };
const statusTone = {
  DRAFT: "default",
  SENT: "warning",
  ACCEPTED: "success",
  REJECTED: "danger",
  CONVERTED: "success",
} as const;

export default async function QuotesPage() {
  const session = await auth();
  const quotes = await prisma.quote.findMany({
    where: { userId: session!.user.id },
    include: { client: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
            <FileSpreadsheet size={17} strokeWidth={1.75} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Cotizaciones</h1>
        </div>
        <Link href="/quotes/new">
          <Button>
            <Plus size={15} strokeWidth={2} />
            Nueva cotización
          </Button>
        </Link>
      </div>

      {quotes.length === 0 ? (
        <EmptyState
          icon={FileSpreadsheet}
          tone="cyan"
          title="Aún no tienes cotizaciones"
          description="Envía una propuesta de precio a tu cliente antes de empezar el trabajo, y conviértela en recibo con un clic cuando la acepte."
          actionHref="/quotes/new"
          actionLabel="Crear cotización"
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
          <table className="w-full min-w-[640px] border-collapse bg-[var(--color-surface)] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-text-muted)]">
                <th className="px-4 py-3 text-xs font-medium">#</th>
                <th className="px-4 py-3 text-xs font-medium">Cliente</th>
                <th className="px-4 py-3 text-xs font-medium">Total</th>
                <th className="px-4 py-3 text-xs font-medium">Estado</th>
                <th className="px-4 py-3 text-xs font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr
                  key={q.id}
                  className="border-t border-[var(--color-border)] transition-colors duration-150 hover:bg-[var(--color-surface-muted)]"
                >
                  <td className="px-4 py-3 font-medium">{q.number}</td>
                  <td className="px-4 py-3">{q.client.name}</td>
                  <td className="px-4 py-3 font-medium">
                    ${invoiceSubtotal(q.items).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={statusTone[q.status]}>{statusLabel[q.status]}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <QuoteRowActions id={q.id} converted={q.status === "CONVERTED"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

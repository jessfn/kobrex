import { Wallet, Users, Clock, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Card } from "@/components/ui";
import { invoiceBreakdown } from "@/lib/invoice-utils";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [clientsCount, paidThisMonth, pendingInvoices, overdueInvoices] = await Promise.all([
    prisma.client.count({ where: { userId } }),
    prisma.invoice.findMany({
      where: { userId, status: "PAID", paidAt: { gte: startOfMonth } },
      include: { items: true },
    }),
    prisma.invoice.findMany({
      where: { userId, status: "PENDING", dueDate: { gte: now } },
      include: { items: true },
    }),
    prisma.invoice.findMany({
      where: { userId, status: "PENDING", dueDate: { lt: now } },
      include: { items: true },
    }),
  ]);

  const monthlyIncome = paidThisMonth.reduce(
    (sum, inv) => sum + invoiceBreakdown(inv.items, inv.applyIva, inv.ivaRate).total,
    0
  );
  const pendingTotal = pendingInvoices.reduce(
    (sum, inv) => sum + invoiceBreakdown(inv.items, inv.applyIva, inv.ivaRate).total,
    0
  );
  const overdueTotal = overdueInvoices.reduce(
    (sum, inv) => sum + invoiceBreakdown(inv.items, inv.applyIva, inv.ivaRate).total,
    0
  );

  const stats = [
    { label: "Ingresos del mes", value: monthlyIncome, icon: Wallet },
    { label: "Clientes activos", value: clientsCount, icon: Users, plain: true },
    { label: "Recibos pendientes", value: pendingTotal, icon: Clock },
    { label: "Recibos vencidos", value: overdueTotal, icon: AlertTriangle },
  ];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Panel</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-[var(--color-text-muted)]">{s.label}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">
                {s.plain ? s.value : `$${s.value.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`}
              </p>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-muted)] text-brand-700">
              <s.icon size={17} strokeWidth={1.75} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

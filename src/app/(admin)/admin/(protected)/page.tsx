import { TrendingUp, Users, Clock, UserPlus, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PLAN_PRICE_MXN } from "@/lib/subscription";
import { Card } from "@/components/ui";

export default async function AdminOverviewPage() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [activeCount, trialingCount, pastDueCount, canceledCount, newSignups] = await Promise.all([
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.subscription.count({ where: { status: "TRIALING" } }),
    prisma.subscription.count({ where: { status: "PAST_DUE" } }),
    prisma.subscription.count({ where: { status: "CANCELED" } }),
    prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
  ]);

  const mrr = activeCount * PLAN_PRICE_MXN;

  const stats = [
    { label: "MRR estimado", value: `$${mrr.toLocaleString("es-MX")} MXN`, icon: TrendingUp },
    { label: "Suscriptores activos", value: activeCount, icon: Users },
    { label: "En prueba", value: trialingCount, icon: Clock },
    { label: "Pago pendiente / cancelados", value: pastDueCount + canceledCount, icon: AlertTriangle },
    { label: "Altas últimos 7 días", value: newSignups, icon: UserPlus },
  ];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Resumen</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-[var(--color-text-muted)]">{s.label}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">{s.value}</p>
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

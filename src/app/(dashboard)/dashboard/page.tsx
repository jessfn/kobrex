import { Wallet, Users, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Card } from "@/components/ui";
import { invoiceBreakdown } from "@/lib/invoice-utils";
import { IncomeChart } from "@/components/charts/IncomeChart";
import { OnboardingChecklist } from "@/components/OnboardingChecklist";

const MONTH_LABELS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [
    user,
    clientsCount,
    invoicesCount,
    paidThisMonth,
    expensesThisMonth,
    pendingInvoices,
    overdueInvoices,
    paidLast6Months,
  ] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { businessName: true } }),
    prisma.client.count({ where: { userId } }),
    prisma.invoice.count({ where: { userId } }),
    prisma.invoice.findMany({
      where: { userId, status: "PAID", paidAt: { gte: startOfMonth } },
      include: { items: true },
    }),
    prisma.expense.aggregate({
      where: { userId, date: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
    prisma.invoice.findMany({
      where: { userId, status: "PENDING", dueDate: { gte: now } },
      include: { items: true },
    }),
    prisma.invoice.findMany({
      where: { userId, status: "PENDING", dueDate: { lt: now } },
      include: { items: true },
    }),
    prisma.invoice.findMany({
      where: { userId, status: "PAID", paidAt: { gte: sixMonthsAgo } },
      include: { items: true },
    }),
  ]);

  const monthlyIncome = paidThisMonth.reduce(
    (sum, inv) => sum + invoiceBreakdown(inv.items, inv.applyIva, inv.ivaRate).total,
    0
  );
  const monthlyExpenses = Number(expensesThisMonth._sum.amount ?? 0);
  const netProfit = monthlyIncome - monthlyExpenses;
  const pendingTotal = pendingInvoices.reduce(
    (sum, inv) => sum + invoiceBreakdown(inv.items, inv.applyIva, inv.ivaRate).total,
    0
  );
  const overdueTotal = overdueInvoices.reduce(
    (sum, inv) => sum + invoiceBreakdown(inv.items, inv.applyIva, inv.ivaRate).total,
    0
  );

  const chartData = Array.from({ length: 6 }).map((_, i) => {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const total = paidLast6Months
      .filter((inv) => inv.paidAt && inv.paidAt.getFullYear() === monthDate.getFullYear() && inv.paidAt.getMonth() === monthDate.getMonth())
      .reduce((sum, inv) => sum + invoiceBreakdown(inv.items, inv.applyIva, inv.ivaRate).total, 0);
    return { month: MONTH_LABELS[monthDate.getMonth()], total };
  });

  const stats = [
    { label: "Ganancia neta del mes", value: netProfit, icon: TrendingUp, color: "bg-emerald-50 text-emerald-600" },
    { label: "Clientes activos", value: clientsCount, icon: Users, plain: true, color: "bg-blue-50 text-blue-600" },
    { label: "Recibos pendientes", value: pendingTotal, icon: Clock, color: "bg-amber-50 text-amber-600" },
    { label: "Recibos vencidos", value: overdueTotal, icon: AlertTriangle, color: "bg-rose-50 text-rose-600" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Panel</h1>

      <OnboardingChecklist
        steps={[
          { label: "Completa tu perfil de negocio", done: Boolean(user.businessName), href: "/settings" },
          { label: "Agrega tu primer cliente", done: clientsCount > 0, href: "/clients/new" },
          { label: "Crea tu primer recibo", done: invoicesCount > 0, href: "/invoices/new" },
        ]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-[var(--color-text-muted)]">{s.label}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">
                {s.plain ? s.value : `$${s.value.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`}
              </p>
            </div>
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${s.color}`}>
              <s.icon size={17} strokeWidth={1.75} />
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-4">
        <Card>
          <p className="mb-4 text-sm font-medium">Ingresos cobrados — últimos 6 meses</p>
          <IncomeChart data={chartData} />
        </Card>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
        <Wallet size={13} strokeWidth={1.75} />
        Gastos del mes: ${monthlyExpenses.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
      </div>
    </div>
  );
}

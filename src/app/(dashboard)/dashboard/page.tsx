import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Card } from "@/components/ui";
import { invoiceTotal } from "@/lib/invoice-utils";

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

  const monthlyIncome = paidThisMonth.reduce((sum, inv) => sum + invoiceTotal(inv.items), 0);
  const pendingTotal = pendingInvoices.reduce((sum, inv) => sum + invoiceTotal(inv.items), 0);
  const overdueTotal = overdueInvoices.reduce((sum, inv) => sum + invoiceTotal(inv.items), 0);

  const stats = [
    { label: "Ingresos del mes", value: `$${monthlyIncome.toLocaleString("es-MX", { minimumFractionDigits: 2 })}` },
    { label: "Clientes activos", value: clientsCount.toString() },
    { label: "Facturas pendientes", value: `$${pendingTotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}` },
    { label: "Facturas vencidas", value: `$${overdueTotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}` },
  ];

  return (
    <div>
      <h1 className="mb-8 text-3xl font-black tracking-tight text-brand-800">Panel</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <p className="text-xs font-extrabold uppercase tracking-wider text-brand-600">{s.label}</p>
            <p className="mt-2 text-2xl font-black text-brand-900">{s.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

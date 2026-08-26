import Link from "next/link";
import { Plus, Receipt } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Button, Card } from "@/components/ui";
import { EmptyState } from "@/components/EmptyState";
import { DeleteExpenseButton } from "./DeleteExpenseButton";

export default async function ExpensesPage() {
  const session = await auth();
  const expenses = await prisma.expense.findMany({
    where: { userId: session!.user.id },
    orderBy: { date: "desc" },
  });

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
            <Receipt size={17} strokeWidth={1.75} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Gastos</h1>
        </div>
        <Link href="/expenses/new">
          <Button>
            <Plus size={15} strokeWidth={2} />
            Nuevo gasto
          </Button>
        </Link>
      </div>

      {expenses.length === 0 ? (
        <EmptyState
          icon={Receipt}
          tone="rose"
          title="Aún no tienes gastos registrados"
          description="Lleva el control de lo que gastas en tu negocio para ver tu ganancia neta real, no solo lo que facturas."
          actionHref="/expenses/new"
          actionLabel="Registrar gasto"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {expenses.map((e) => (
            <Card key={e.id} className="flex flex-col gap-1.5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium">{e.description}</h3>
                <span className="font-medium text-rose-600">
                  -${Number(e.amount).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                </span>
              </div>
              {e.category && <p className="text-sm text-[var(--color-text-muted)]">{e.category}</p>}
              <p className="text-sm text-[var(--color-text-muted)]">{e.date.toLocaleDateString("es-MX")}</p>
              <div className="mt-3 flex justify-end">
                <DeleteExpenseButton id={e.id} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

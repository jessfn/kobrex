import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Button, Card } from "@/components/ui";
import { EmptyState } from "@/components/EmptyState";
import { DeleteContractButton } from "./DeleteContractButton";

export default async function ContractsPage() {
  const session = await auth();
  const contracts = await prisma.contract.findMany({
    where: { userId: session!.user.id },
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <FileText size={17} strokeWidth={1.75} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Contratos</h1>
        </div>
        <Link href="/contracts/new">
          <Button>
            <Plus size={15} strokeWidth={2} />
            Nuevo contrato
          </Button>
        </Link>
      </div>

      {contracts.length === 0 ? (
        <EmptyState
          icon={FileText}
          tone="amber"
          title="Aún no tienes contratos"
          description="Genera un contrato de prestación de servicios con las cláusulas estándar, listo para personalizar y firmar."
          actionHref="/contracts/new"
          actionLabel="Crear contrato"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contracts.map((c) => (
            <Card key={c.id} className="flex flex-col gap-1.5">
              <h3 className="font-medium">{c.title}</h3>
              <p className="text-sm text-[var(--color-text-muted)]">{c.client.name}</p>
              <div className="mt-3 flex justify-end gap-2">
                <Link
                  href={`/api/contracts/${c.id}/pdf`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border-strong)] px-3 py-1.5 text-xs font-medium transition-colors duration-150 hover:bg-[var(--color-surface-muted)]"
                >
                  <FileText size={13} strokeWidth={2} />
                  PDF
                </Link>
                <DeleteContractButton id={c.id} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

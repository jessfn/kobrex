import Link from "next/link";
import { Plus, Download, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Button, Card } from "@/components/ui";
import { EmptyState } from "@/components/EmptyState";
import { DeleteClientButton } from "./DeleteClientButton";

export default async function ClientsPage() {
  const session = await auth();
  const clients = await prisma.client.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Users size={17} strokeWidth={1.75} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
        </div>
        <div className="flex gap-2">
          {clients.length > 0 && (
            <Link href="/api/clients/export">
              <Button variant="ghost">
                <Download size={15} strokeWidth={2} />
                Exportar CSV
              </Button>
            </Link>
          )}
          <Link href="/clients/new">
            <Button>
              <Plus size={15} strokeWidth={2} />
              Nuevo cliente
            </Button>
          </Link>
        </div>
      </div>

      {clients.length === 0 ? (
        <EmptyState
          icon={Users}
          tone="blue"
          title="Aún no tienes clientes"
          description="Agrega a tu primer cliente para empezar a llevar el control de proyectos, recibos y contratos."
          actionHref="/clients/new"
          actionLabel="Agregar cliente"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((c) => (
            <Card key={c.id} className="flex flex-col gap-1.5">
              <h3 className="font-medium">{c.name}</h3>
              {c.company && <p className="text-sm text-[var(--color-text-muted)]">{c.company}</p>}
              {c.email && <p className="text-sm text-[var(--color-text-muted)]">{c.email}</p>}
              {c.phone && <p className="text-sm text-[var(--color-text-muted)]">{c.phone}</p>}
              {c.rfc && <p className="text-sm text-[var(--color-text-muted)]">RFC: {c.rfc}</p>}
              <div className="mt-3 flex justify-end">
                <DeleteClientButton id={c.id} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

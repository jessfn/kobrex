import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Button, Card } from "@/components/ui";
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
        <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
        <Link href="/clients/new">
          <Button>
            <Plus size={15} strokeWidth={2} />
            Nuevo cliente
          </Button>
        </Link>
      </div>

      {clients.length === 0 ? (
        <Card className="text-center text-[var(--color-text-muted)]">
          Aún no tienes clientes.{" "}
          <Link href="/clients/new" className="font-medium text-brand-700 underline underline-offset-2">
            Agrega el primero
          </Link>
          .
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((c) => (
            <Card key={c.id} className="flex flex-col gap-1.5">
              <h3 className="font-medium">{c.name}</h3>
              {c.company && <p className="text-sm text-[var(--color-text-muted)]">{c.company}</p>}
              {c.email && <p className="text-sm text-[var(--color-text-muted)]">{c.email}</p>}
              {c.phone && <p className="text-sm text-[var(--color-text-muted)]">{c.phone}</p>}
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

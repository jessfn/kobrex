import Link from "next/link";
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
        <h1 className="text-3xl font-black tracking-tight text-brand-800">Clientes</h1>
        <Link href="/clients/new">
          <Button>+ Nuevo cliente</Button>
        </Link>
      </div>

      {clients.length === 0 ? (
        <Card className="text-center text-brand-700">
          Aún no tienes clientes.{" "}
          <Link href="/clients/new" className="underline font-bold">
            Agrega el primero
          </Link>
          .
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((c) => (
            <Card key={c.id} className="flex flex-col gap-2">
              <h3 className="text-lg font-extrabold text-brand-900">{c.name}</h3>
              {c.company && <p className="text-sm font-semibold text-brand-600">{c.company}</p>}
              {c.email && <p className="text-sm text-brand-700">{c.email}</p>}
              {c.phone && <p className="text-sm text-brand-700">{c.phone}</p>}
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

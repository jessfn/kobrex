import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Button, Card } from "@/components/ui";
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
        <h1 className="text-3xl font-black tracking-tight text-brand-800">Contratos</h1>
        <Link href="/contracts/new">
          <Button>+ Nuevo contrato</Button>
        </Link>
      </div>

      {contracts.length === 0 ? (
        <Card className="text-center text-brand-700">Aún no tienes contratos.</Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contracts.map((c) => (
            <Card key={c.id} className="flex flex-col gap-2">
              <h3 className="text-lg font-extrabold text-brand-900">{c.title}</h3>
              <p className="text-sm font-semibold text-brand-600">{c.client.name}</p>
              <div className="mt-3 flex justify-end gap-2">
                <Link
                  href={`/api/contracts/${c.id}/pdf`}
                  target="_blank"
                  className="rounded-lg border-2 border-brand-300 px-3 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-50"
                >
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

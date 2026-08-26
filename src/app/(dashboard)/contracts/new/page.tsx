import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NewContractForm } from "./NewContractForm";
import { CONTRACT_TEMPLATE } from "@/lib/contract-template";

export default async function NewContractPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [clients, projects] = await Promise.all([
    prisma.client.findMany({ where: { userId }, orderBy: { name: "asc" } }),
    prisma.project.findMany({ where: { userId }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Nuevo contrato</h1>
      <NewContractForm
        clients={clients.map((c) => ({ id: c.id, name: c.name }))}
        projects={projects.map((p) => ({ id: p.id, name: p.name, clientId: p.clientId }))}
        template={CONTRACT_TEMPLATE}
      />
    </div>
  );
}

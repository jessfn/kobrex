import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NewProjectForm } from "./NewProjectForm";

export default async function NewProjectPage() {
  const session = await auth();
  const clients = await prisma.client.findMany({
    where: { userId: session!.user.id },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Nuevo proyecto</h1>
      <NewProjectForm clients={clients.map((c) => ({ id: c.id, name: c.name }))} />
    </div>
  );
}

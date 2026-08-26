import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NewQuoteForm } from "./NewQuoteForm";

export default async function NewQuotePage() {
  const session = await auth();
  const userId = session!.user.id;

  const [clients, projects, lastQuote] = await Promise.all([
    prisma.client.findMany({ where: { userId }, orderBy: { name: "asc" } }),
    prisma.project.findMany({ where: { userId }, orderBy: { name: "asc" } }),
    prisma.quote.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
  ]);

  const nextNumber = lastQuote ? `C-${(parseInt(lastQuote.number.replace(/\D/g, "")) || 0) + 1}` : "C-1001";

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Nueva cotización</h1>
      <NewQuoteForm
        clients={clients.map((c) => ({ id: c.id, name: c.name }))}
        projects={projects.map((p) => ({ id: p.id, name: p.name, clientId: p.clientId }))}
        suggestedNumber={nextNumber}
      />
    </div>
  );
}

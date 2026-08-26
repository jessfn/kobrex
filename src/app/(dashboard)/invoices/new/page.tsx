import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NewInvoiceForm } from "./NewInvoiceForm";

export default async function NewInvoicePage() {
  const session = await auth();
  const userId = session!.user.id;

  const [clients, projects, lastInvoice] = await Promise.all([
    prisma.client.findMany({ where: { userId }, orderBy: { name: "asc" } }),
    prisma.project.findMany({ where: { userId }, orderBy: { name: "asc" } }),
    prisma.invoice.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
  ]);

  const nextNumber = lastInvoice ? `F-${(parseInt(lastInvoice.number.replace(/\D/g, "")) || 0) + 1}` : "F-1001";

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-black tracking-tight text-brand-800">Nueva factura</h1>
      <NewInvoiceForm
        clients={clients.map((c) => ({ id: c.id, name: c.name }))}
        projects={projects.map((p) => ({ id: p.id, name: p.name, clientId: p.clientId }))}
        suggestedNumber={nextNumber}
      />
    </div>
  );
}

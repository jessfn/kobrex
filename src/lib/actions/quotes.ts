"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export type ActionResult = { error?: string };

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user.id;
}

export async function createQuoteAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const userId = await requireUserId();

  const clientId = formData.get("clientId") as string;
  const projectId = (formData.get("projectId") as string) || null;
  const number = formData.get("number") as string;
  const validUntil = (formData.get("validUntil") as string) || undefined;
  const notes = (formData.get("notes") as string) || undefined;

  if (!clientId || !number) return { error: "Faltan campos requeridos" };

  const client = await prisma.client.findFirst({ where: { id: clientId, userId } });
  if (!client) return { error: "Cliente inválido" };

  const descriptions = formData.getAll("itemDescription") as string[];
  const quantities = formData.getAll("itemQuantity") as string[];
  const prices = formData.getAll("itemUnitPrice") as string[];

  const items = descriptions
    .map((description, i) => ({
      description,
      quantity: Number(quantities[i] || 0),
      unitPrice: Number(prices[i] || 0),
    }))
    .filter((item) => item.description.trim().length > 0 && item.quantity > 0);

  if (items.length === 0) return { error: "Agrega al menos un ítem con cantidad mayor a 0" };

  const existing = await prisma.quote.findUnique({ where: { userId_number: { userId, number } } });
  if (existing) return { error: "Ya existe una cotización con ese número" };

  await prisma.quote.create({
    data: {
      number,
      userId,
      clientId,
      projectId: projectId || undefined,
      validUntil: validUntil ? new Date(validUntil) : undefined,
      notes,
      items: { create: items },
    },
  });

  revalidatePath("/quotes");
  redirect("/quotes");
}

export async function deleteQuoteAction(id: string) {
  const userId = await requireUserId();
  await prisma.quote.deleteMany({ where: { id, userId } });
  revalidatePath("/quotes");
}

export async function convertQuoteToInvoiceAction(quoteId: string) {
  const userId = await requireUserId();

  const quote = await prisma.quote.findFirst({
    where: { id: quoteId, userId },
    include: { items: true },
  });
  if (!quote || quote.status === "CONVERTED") return;

  const lastInvoice = await prisma.invoice.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } });
  const nextNumber = lastInvoice ? `F-${(parseInt(lastInvoice.number.replace(/\D/g, "")) || 0) + 1}` : "F-1001";

  const invoice = await prisma.invoice.create({
    data: {
      number: nextNumber,
      userId,
      clientId: quote.clientId,
      projectId: quote.projectId,
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      notes: quote.notes,
      items: {
        create: quote.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      },
    },
  });

  await prisma.quote.update({
    where: { id: quoteId },
    data: { status: "CONVERTED", convertedInvoiceId: invoice.id },
  });

  revalidatePath("/quotes");
  revalidatePath("/invoices");
  redirect(`/invoices`);
}

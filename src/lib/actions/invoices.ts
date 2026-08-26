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

export async function createInvoiceAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const userId = await requireUserId();

  const clientId = formData.get("clientId") as string;
  const projectId = (formData.get("projectId") as string) || null;
  const number = formData.get("number") as string;
  const dueDate = formData.get("dueDate") as string;
  const notes = (formData.get("notes") as string) || undefined;
  const paymentMethod = (formData.get("paymentMethod") as string) || undefined;
  const applyIva = formData.get("applyIva") === "on";

  if (!clientId || !number || !dueDate) return { error: "Faltan campos requeridos" };

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

  const existing = await prisma.invoice.findUnique({ where: { userId_number: { userId, number } } });
  if (existing) return { error: "Ya existe un recibo con ese número" };

  await prisma.invoice.create({
    data: {
      number,
      userId,
      clientId,
      projectId: projectId || undefined,
      dueDate: new Date(dueDate),
      notes,
      paymentMethod,
      applyIva,
      items: { create: items },
    },
  });

  revalidatePath("/invoices");
  redirect("/invoices");
}

export async function markInvoicePaidAction(id: string) {
  const userId = await requireUserId();
  await prisma.invoice.updateMany({
    where: { id, userId },
    data: { status: "PAID", paidAt: new Date() },
  });
  revalidatePath("/invoices");
}

export async function deleteInvoiceAction(id: string) {
  const userId = await requireUserId();
  await prisma.invoice.deleteMany({ where: { id, userId } });
  revalidatePath("/invoices");
}

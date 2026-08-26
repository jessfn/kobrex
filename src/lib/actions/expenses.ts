"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const expenseSchema = z.object({
  description: z.string().min(1, "La descripción es requerida"),
  amount: z.string().refine((v) => Number(v) > 0, "El monto debe ser mayor a 0"),
  category: z.string().optional(),
  date: z.string().min(1, "La fecha es requerida"),
});

export type ActionResult = { error?: string };

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user.id;
}

export async function createExpenseAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const userId = await requireUserId();

  const parsed = expenseSchema.safeParse({
    description: formData.get("description"),
    amount: formData.get("amount"),
    category: formData.get("category") || undefined,
    date: formData.get("date"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };

  await prisma.expense.create({
    data: {
      description: parsed.data.description,
      amount: Number(parsed.data.amount),
      category: parsed.data.category,
      date: new Date(parsed.data.date),
      userId,
    },
  });

  revalidatePath("/expenses");
  redirect("/expenses");
}

export async function deleteExpenseAction(id: string) {
  const userId = await requireUserId();
  await prisma.expense.deleteMany({ where: { id, userId } });
  revalidatePath("/expenses");
}

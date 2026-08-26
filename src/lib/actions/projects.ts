"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const projectSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  clientId: z.string().min(1, "Selecciona un cliente"),
  status: z.enum(["ACTIVE", "PAUSED", "COMPLETED", "CANCELLED"]),
  amount: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type ActionResult = { error?: string };

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user.id;
}

export async function createProjectAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const userId = await requireUserId();

  const parsed = projectSchema.safeParse({
    name: formData.get("name"),
    clientId: formData.get("clientId"),
    status: formData.get("status") || "ACTIVE",
    amount: formData.get("amount") || undefined,
    startDate: formData.get("startDate") || undefined,
    endDate: formData.get("endDate") || undefined,
  });

  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  const { name, clientId, status, amount, startDate, endDate } = parsed.data;

  const client = await prisma.client.findFirst({ where: { id: clientId, userId } });
  if (!client) return { error: "Cliente inválido" };

  await prisma.project.create({
    data: {
      name,
      clientId,
      userId,
      status,
      amount: amount ? Number(amount) : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    },
  });

  revalidatePath("/projects");
  redirect("/projects");
}

export async function deleteProjectAction(id: string) {
  const userId = await requireUserId();
  await prisma.project.deleteMany({ where: { id, userId } });
  revalidatePath("/projects");
}

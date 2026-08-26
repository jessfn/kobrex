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

export async function createContractAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const userId = await requireUserId();

  const title = formData.get("title") as string;
  const clientId = formData.get("clientId") as string;
  const projectId = (formData.get("projectId") as string) || null;
  const content = formData.get("content") as string;

  if (!title || !clientId || !content) return { error: "Faltan campos requeridos" };

  const client = await prisma.client.findFirst({ where: { id: clientId, userId } });
  if (!client) return { error: "Cliente inválido" };

  await prisma.contract.create({
    data: { title, clientId, userId, projectId: projectId || undefined, content },
  });

  revalidatePath("/contracts");
  redirect("/contracts");
}

export async function deleteContractAction(id: string) {
  const userId = await requireUserId();
  await prisma.contract.deleteMany({ where: { id, userId } });
  revalidatePath("/contracts");
}

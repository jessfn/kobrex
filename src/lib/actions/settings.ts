"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export type ActionResult = { error?: string; success?: boolean };

export async function updateBusinessProfileAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const businessName = (formData.get("businessName") as string) || null;
  const rfc = (formData.get("rfc") as string) || null;
  const fiscalAddress = (formData.get("fiscalAddress") as string) || null;
  const phone = (formData.get("phone") as string) || null;
  const taxRegime = (formData.get("taxRegime") as string) || null;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { businessName, rfc, fiscalAddress, phone, taxRegime },
  });

  revalidatePath("/settings");
  return { success: true };
}

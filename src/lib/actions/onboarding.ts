"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export type ActionResult = { error?: string };

export async function completeOnboardingAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  if (formData.get("acceptedTerms") !== "on") {
    return { error: "Debes aceptar los Términos y el Aviso de Privacidad para continuar" };
  }

  const businessName = (formData.get("businessName") as string) || undefined;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { acceptedTermsAt: new Date(), businessName },
  });

  redirect("/dashboard");
}

"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/email/resend";

export type ActionResult = { error?: string };

const onboardingSchema = z.object({
  phoneCountryCode: z.string().min(1, "Selecciona una lada"),
  phone: z.string().regex(/^\d{10}$/, "El teléfono debe tener exactamente 10 dígitos"),
  businessName: z.string().optional(),
});

export async function completeOnboardingAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  if (formData.get("acceptedTerms") !== "on") {
    return { error: "Debes aceptar los Términos y el Aviso de Privacidad para continuar" };
  }

  const parsed = onboardingSchema.safeParse({
    phoneCountryCode: formData.get("phoneCountryCode"),
    phone: formData.get("phone"),
    businessName: formData.get("businessName") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      acceptedTermsAt: new Date(),
      phoneCountryCode: parsed.data.phoneCountryCode,
      phone: parsed.data.phone,
      businessName: parsed.data.businessName,
    },
  });

  await sendWelcomeEmail({ to: user.email, name: user.name });

  redirect("/dashboard");
}

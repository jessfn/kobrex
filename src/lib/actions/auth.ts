"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { newTrialEndDate } from "@/lib/subscription";
import { sendWelcomeEmail, sendVerificationEmail } from "@/lib/email/resend";
import { createVerificationToken, buildVerifyUrl } from "@/lib/verification-token";

const registerSchema = z.object({
  name: z.string().min(2, "El nombre es muy corto"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  phoneCountryCode: z.string().min(1, "Selecciona una lada"),
  phone: z.string().regex(/^\d{10}$/, "El teléfono debe tener exactamente 10 dígitos"),
  acceptedTerms: z.literal("on", { message: "Debes aceptar los Términos y el Aviso de Privacidad" }),
});

export type ActionResult = { error?: string };

export async function registerAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    phoneCountryCode: formData.get("phoneCountryCode"),
    phone: formData.get("phone"),
    acceptedTerms: formData.get("acceptedTerms"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { name, email, password, phoneCountryCode, phone } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Ya existe una cuenta con ese email" };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      phoneCountryCode,
      phone,
      acceptedTermsAt: new Date(),
      subscription: { create: { status: "TRIALING", trialEndsAt: newTrialEndDate() } },
    },
  });

  const verifyToken = await createVerificationToken(user.id);
  await Promise.all([
    sendWelcomeEmail({ to: user.email, name: user.name }),
    sendVerificationEmail({ to: user.email, name: user.name, verifyUrl: buildVerifyUrl(verifyToken) }),
  ]);

  await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  return {};
}

export async function loginAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (err) {
    if (err instanceof Error && err.message.includes("CredentialsSignin")) {
      return { error: "Email o contraseña incorrectos" };
    }
    throw err;
  }
  return {};
}

export async function signInWithGoogleAction() {
  await signIn("google", { redirectTo: "/dashboard" });
}

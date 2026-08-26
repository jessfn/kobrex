"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";

export type ActionResult = { error?: string };

export async function adminLoginAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = (formData.get("email") as string) || "";
  const password = (formData.get("password") as string) || "";

  if (!email || !password) return { error: "Ingresa tu email y contraseña" };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) return { error: "Email o contraseña incorrectos" };

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return { error: "Email o contraseña incorrectos" };

  if (!user.isOwner) {
    return { error: "Esta cuenta no tiene acceso de administrador." };
  }

  await signIn("credentials", { email, password, redirectTo: "/admin" });
  return {};
}

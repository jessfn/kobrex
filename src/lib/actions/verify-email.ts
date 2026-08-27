"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email/resend";
import { createVerificationToken, buildVerifyUrl, hashToken } from "@/lib/verification-token";

export type ActionResult = { error?: string; success?: boolean };

export async function verifyEmailAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const token = (formData.get("token") as string) || "";
  if (!token) return { error: "Enlace inválido." };

  const tokenHash = hashToken(token);
  const record = await prisma.token.findUnique({ where: { tokenHash } });

  if (!record || record.purpose !== "EMAIL_VERIFY" || record.usedAt || record.expiresAt < new Date()) {
    return { error: "El enlace es inválido o ya expiró. Solicita uno nuevo desde tu panel." };
  }

  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { emailVerified: new Date() } }),
    prisma.token.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
  ]);

  return { success: true };
}

export async function resendVerificationEmailAction() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.emailVerified) return;

  const token = await createVerificationToken(user.id);
  await sendVerificationEmail({ to: user.email, name: user.name, verifyUrl: buildVerifyUrl(token) });
}

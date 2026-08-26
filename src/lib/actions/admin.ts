"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function requireOwner() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (!session.user.isOwner) redirect("/dashboard");
}

export async function extendTrialAction(userId: string, days: number) {
  await requireOwner();

  const subscription = await prisma.subscription.findUnique({ where: { userId } });
  if (!subscription) return;

  const base = subscription.trialEndsAt > new Date() ? subscription.trialEndsAt : new Date();
  const trialEndsAt = new Date(base.getTime() + days * 24 * 60 * 60 * 1000);

  await prisma.subscription.update({
    where: { userId },
    data: { status: "TRIALING", trialEndsAt },
  });

  revalidatePath(`/admin/users/${userId}`);
}

export async function grantComplimentaryAccessAction(userId: string) {
  await requireOwner();

  // "Cortesía": marcamos activa con un periodo largo, sin pasar por Stripe.
  const farFuture = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  await prisma.subscription.update({
    where: { userId },
    data: { status: "ACTIVE", currentPeriodEnd: farFuture, cancelAtPeriodEnd: false },
  });

  revalidatePath(`/admin/users/${userId}`);
}

export async function suspendAccessAction(userId: string) {
  await requireOwner();

  await prisma.subscription.update({
    where: { userId },
    data: { status: "CANCELED", currentPeriodEnd: new Date() },
  });

  revalidatePath(`/admin/users/${userId}`);
}

import { prisma } from "@/lib/prisma";

export const PLAN_PRICE_MXN = 149;
export const TRIAL_DAYS = 14;

export function newTrialEndDate(): Date {
  return new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
}

export type AccessStatus = {
  allowed: boolean;
  status: "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED" | "NONE";
  trialEndsAt: Date | null;
  currentPeriodEnd: Date | null;
};

export async function getAccessStatus(userId: string): Promise<AccessStatus> {
  const subscription = await prisma.subscription.findUnique({ where: { userId } });

  if (!subscription) {
    return { allowed: false, status: "NONE", trialEndsAt: null, currentPeriodEnd: null };
  }

  const now = Date.now();

  if (subscription.status === "TRIALING") {
    const allowed = subscription.trialEndsAt.getTime() > now;
    return {
      allowed,
      status: "TRIALING",
      trialEndsAt: subscription.trialEndsAt,
      currentPeriodEnd: null,
    };
  }

  if (subscription.status === "ACTIVE" || subscription.status === "PAST_DUE") {
    // PAST_DUE mantiene acceso mientras Stripe reintenta el cobro (periodo de gracia corto).
    const allowed = !subscription.currentPeriodEnd || subscription.currentPeriodEnd.getTime() > now;
    return {
      allowed,
      status: subscription.status,
      trialEndsAt: subscription.trialEndsAt,
      currentPeriodEnd: subscription.currentPeriodEnd,
    };
  }

  // CANCELED: conserva acceso hasta el fin del periodo ya pagado.
  const allowed = Boolean(subscription.currentPeriodEnd && subscription.currentPeriodEnd.getTime() > now);
  return {
    allowed,
    status: "CANCELED",
    trialEndsAt: subscription.trialEndsAt,
    currentPeriodEnd: subscription.currentPeriodEnd,
  };
}

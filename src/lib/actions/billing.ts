"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    include: { subscription: true },
  });
  return user;
}

function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}

export async function createCheckoutSessionAction() {
  if (!isStripeConfigured()) redirect("/billing?error=stripe_not_configured");

  const user = await requireUser();
  const stripe = getStripe();

  let customerId = user.subscription?.stripeCustomerId ?? undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.businessName || user.name,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await prisma.subscription.update({
      where: { userId: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${appUrl()}/billing?success=1`,
    cancel_url: `${appUrl()}/billing?canceled=1`,
    metadata: { userId: user.id },
  });

  redirect(checkoutSession.url!);
}

export async function createPortalSessionAction() {
  if (!isStripeConfigured()) redirect("/billing?error=stripe_not_configured");

  const user = await requireUser();
  if (!user.subscription?.stripeCustomerId) redirect("/billing");

  const stripe = getStripe();
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.subscription.stripeCustomerId,
    return_url: `${appUrl()}/billing`,
  });

  redirect(portalSession.url);
}

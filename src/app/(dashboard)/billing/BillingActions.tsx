"use client";

import { createCheckoutSessionAction, createPortalSessionAction } from "@/lib/actions/billing";
import { Button } from "@/components/ui";

export function BillingActions({
  hasStripeCustomer,
  stripeConfigured,
}: {
  hasStripeCustomer: boolean;
  stripeConfigured: boolean;
}) {
  if (!stripeConfigured) {
    return (
      <p className="text-xs text-[var(--color-text-muted)]">
        Los pagos con tarjeta estarán disponibles muy pronto.
      </p>
    );
  }

  return (
    <div className="flex gap-3 pt-2">
      {hasStripeCustomer ? (
        <form action={createPortalSessionAction}>
          <Button type="submit">Gestionar suscripción</Button>
        </form>
      ) : (
        <form action={createCheckoutSessionAction}>
          <Button type="submit">Suscribirme</Button>
        </form>
      )}
    </div>
  );
}

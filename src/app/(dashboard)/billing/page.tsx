import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAccessStatus, PLAN_PRICE_MXN } from "@/lib/subscription";
import { isStripeConfigured } from "@/lib/stripe";
import { Badge, Card } from "@/components/ui";
import { BillingActions } from "./BillingActions";

const statusLabel = {
  TRIALING: "En prueba",
  ACTIVE: "Activa",
  PAST_DUE: "Pago pendiente",
  CANCELED: "Cancelada",
  NONE: "Sin suscripción",
};

const statusTone = {
  TRIALING: "warning",
  ACTIVE: "success",
  PAST_DUE: "danger",
  CANCELED: "default",
  NONE: "default",
} as const;

export default async function BillingPage() {
  const session = await auth();
  const [access, subscription] = await Promise.all([
    getAccessStatus(session!.user.id),
    prisma.subscription.findUnique({ where: { userId: session!.user.id } }),
  ]);

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Facturación</h1>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Estado de tu suscripción</span>
          <Badge tone={statusTone[access.status]}>{statusLabel[access.status]}</Badge>
        </div>

        {access.status === "TRIALING" && access.trialEndsAt && (
          <p className="text-sm text-[var(--color-text-muted)]">
            {access.allowed
              ? `Tu prueba gratuita termina el ${access.trialEndsAt.toLocaleDateString("es-MX")}.`
              : "Tu prueba gratuita terminó. Suscríbete para seguir usando Kobrex."}
          </p>
        )}

        {(access.status === "ACTIVE" || access.status === "PAST_DUE") && access.currentPeriodEnd && (
          <p className="text-sm text-[var(--color-text-muted)]">
            {access.status === "PAST_DUE"
              ? "Hubo un problema al cobrar tu tarjeta. Actualiza tu método de pago para mantener el acceso."
              : `Tu plan se renueva el ${access.currentPeriodEnd.toLocaleDateString("es-MX")}.`}
          </p>
        )}

        {access.status === "CANCELED" && (
          <p className="text-sm text-[var(--color-text-muted)]">
            {access.currentPeriodEnd && access.allowed
              ? `Tu suscripción fue cancelada. Tienes acceso hasta el ${access.currentPeriodEnd.toLocaleDateString("es-MX")}.`
              : "Tu suscripción está cancelada."}
          </p>
        )}

        <p className="text-sm text-[var(--color-text-muted)]">
          Plan único: <span className="font-medium text-[var(--foreground)]">${PLAN_PRICE_MXN} MXN / mes</span>
        </p>

        <BillingActions
          hasStripeCustomer={Boolean(subscription?.stripeCustomerId)}
          stripeConfigured={isStripeConfigured()}
        />
      </Card>
    </div>
  );
}

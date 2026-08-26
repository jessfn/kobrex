import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge, Card } from "@/components/ui";
import { UserAdminActions } from "./UserAdminActions";

const statusLabel = { TRIALING: "En prueba", ACTIVE: "Activa", PAST_DUE: "Pago pendiente", CANCELED: "Cancelada" };
const statusTone = { TRIALING: "warning", ACTIVE: "success", PAST_DUE: "danger", CANCELED: "default" } as const;

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      subscription: true,
      _count: { select: { clients: true, invoices: true, contracts: true, projects: true } },
    },
  });

  if (!user) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">{user.businessName || user.name}</h1>

      <Card className="mb-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Suscripción</span>
          {user.subscription ? (
            <Badge tone={statusTone[user.subscription.status]}>{statusLabel[user.subscription.status]}</Badge>
          ) : (
            <Badge>Sin suscripción</Badge>
          )}
        </div>
        <p className="text-sm text-[var(--color-text-muted)]">{user.email}</p>
        {user.subscription?.trialEndsAt && (
          <p className="text-xs text-[var(--color-text-muted)]">
            Prueba vence: {user.subscription.trialEndsAt.toLocaleDateString("es-MX")}
          </p>
        )}
        {user.subscription?.currentPeriodEnd && (
          <p className="text-xs text-[var(--color-text-muted)]">
            Periodo actual vence: {user.subscription.currentPeriodEnd.toLocaleDateString("es-MX")}
          </p>
        )}
        <p className="text-xs text-[var(--color-text-muted)]">
          Alta: {user.createdAt.toLocaleDateString("es-MX")}
        </p>
      </Card>

      <Card className="mb-4">
        <p className="mb-3 text-sm font-medium">Uso de la cuenta</p>
        <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Clientes</p>
            <p className="font-medium">{user._count.clients}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Proyectos</p>
            <p className="font-medium">{user._count.projects}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Recibos</p>
            <p className="font-medium">{user._count.invoices}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Contratos</p>
            <p className="font-medium">{user._count.contracts}</p>
          </div>
        </div>
      </Card>

      <Card>
        <p className="mb-3 text-sm font-medium">Acciones</p>
        <UserAdminActions userId={user.id} />
      </Card>
    </div>
  );
}

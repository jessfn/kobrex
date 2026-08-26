import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui";

const statusLabel = { TRIALING: "En prueba", ACTIVE: "Activa", PAST_DUE: "Pago pendiente", CANCELED: "Cancelada" };
const statusTone = { TRIALING: "warning", ACTIVE: "success", PAST_DUE: "danger", CANCELED: "default" } as const;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const users = await prisma.user.findMany({
    where: q
      ? {
          OR: [
            { email: { contains: q, mode: "insensitive" } },
            { name: { contains: q, mode: "insensitive" } },
            { businessName: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: { subscription: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Suscriptores</h1>

      <form className="mb-6">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre o email..."
          className="w-full max-w-sm rounded-lg border border-[var(--color-border-strong)] px-3.5 py-2.5 text-sm outline-none transition-all duration-150 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
        />
      </form>

      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
        <table className="w-full min-w-[640px] border-collapse bg-[var(--color-surface)] text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-text-muted)]">
              <th className="px-4 py-3 text-xs font-medium">Usuario</th>
              <th className="px-4 py-3 text-xs font-medium">Estado</th>
              <th className="px-4 py-3 text-xs font-medium">Alta</th>
              <th className="px-4 py-3 text-xs font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-t border-[var(--color-border)] transition-colors duration-150 hover:bg-[var(--color-surface-muted)]"
              >
                <td className="px-4 py-3">
                  <p className="font-medium">{u.businessName || u.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{u.email}</p>
                </td>
                <td className="px-4 py-3">
                  {u.subscription ? (
                    <Badge tone={statusTone[u.subscription.status]}>{statusLabel[u.subscription.status]}</Badge>
                  ) : (
                    <Badge>Sin suscripción</Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">
                  {u.createdAt.toLocaleDateString("es-MX")}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/users/${u.id}`} className="text-xs font-medium text-brand-700 underline underline-offset-2">
                    Ver detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

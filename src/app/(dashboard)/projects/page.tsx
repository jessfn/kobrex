import Link from "next/link";
import { Plus, FolderKanban } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Badge, Button, Card } from "@/components/ui";
import { EmptyState } from "@/components/EmptyState";
import { DeleteProjectButton } from "./DeleteProjectButton";

const statusTone = {
  ACTIVE: "success",
  PAUSED: "warning",
  COMPLETED: "default",
  CANCELLED: "danger",
} as const;

const statusLabel = {
  ACTIVE: "Activo",
  PAUSED: "Pausado",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
};

export default async function ProjectsPage() {
  const session = await auth();
  const projects = await prisma.project.findMany({
    where: { userId: session!.user.id },
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
            <FolderKanban size={17} strokeWidth={1.75} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Proyectos</h1>
        </div>
        <Link href="/projects/new">
          <Button>
            <Plus size={15} strokeWidth={2} />
            Nuevo proyecto
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          tone="violet"
          title="Aún no tienes proyectos"
          description="Organiza el trabajo de cada cliente en proyectos para llevar mejor el seguimiento y ligar recibos y contratos."
          actionHref="/projects/new"
          actionLabel="Crear proyecto"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Card key={p.id} className="flex flex-col gap-1.5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium">{p.name}</h3>
                <Badge tone={statusTone[p.status]}>{statusLabel[p.status]}</Badge>
              </div>
              <p className="text-sm text-[var(--color-text-muted)]">{p.client.name}</p>
              {p.amount && (
                <p className="text-sm font-medium">
                  ${Number(p.amount).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                </p>
              )}
              <div className="mt-3 flex justify-end">
                <DeleteProjectButton id={p.id} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

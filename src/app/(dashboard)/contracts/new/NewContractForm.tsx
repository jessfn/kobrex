"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { createContractAction, type ActionResult } from "@/lib/actions/contracts";
import { Button, Card, ErrorText, Input, Label, Textarea } from "@/components/ui";

export function NewContractForm({
  clients,
  projects,
  template,
}: {
  clients: { id: string; name: string }[];
  projects: { id: string; name: string; clientId: string }[];
  template: string;
}) {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(createContractAction, {});
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [freelancer, setFreelancer] = useState("");
  const [proyecto, setProyecto] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState("");

  const filteredProjects = useMemo(() => projects.filter((p) => p.clientId === clientId), [projects, clientId]);
  const clientName = clients.find((c) => c.id === clientId)?.name ?? "";

  const content = useMemo(
    () =>
      template
        .replaceAll("{{freelancer}}", freelancer || "____________")
        .replaceAll("{{cliente}}", clientName || "____________")
        .replaceAll("{{proyecto}}", proyecto || "____________")
        .replaceAll("{{monto}}", monto || "0.00")
        .replaceAll("{{fecha}}", fecha || "____________"),
    [template, freelancer, clientName, proyecto, monto, fecha]
  );

  if (clients.length === 0) {
    return (
      <Card className="text-center text-brand-700">
        Necesitas al menos un cliente antes de crear un contrato.{" "}
        <Link href="/clients/new" className="underline font-bold">
          Crear cliente
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <form action={formAction} className="space-y-4">
        <div>
          <Label htmlFor="title">Título del contrato *</Label>
          <Input id="title" name="title" required placeholder="Ej. Contrato de diseño web" />
        </div>

        <div>
          <Label htmlFor="clientId">Cliente *</Label>
          <select
            id="clientId"
            name="clientId"
            required
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-base outline-none focus:border-brand-500"
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {filteredProjects.length > 0 && (
          <div>
            <Label htmlFor="projectId">Proyecto (opcional)</Label>
            <select
              id="projectId"
              name="projectId"
              defaultValue=""
              className="w-full rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-base outline-none focus:border-brand-500"
            >
              <option value="">Sin proyecto</option>
              {filteredProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Tu nombre / empresa</Label>
            <Input value={freelancer} onChange={(e) => setFreelancer(e.target.value)} />
          </div>
          <div>
            <Label>Nombre del proyecto</Label>
            <Input value={proyecto} onChange={(e) => setProyecto(e.target.value)} />
          </div>
          <div>
            <Label>Monto (MXN)</Label>
            <Input type="number" step="0.01" value={monto} onChange={(e) => setMonto(e.target.value)} />
          </div>
          <div>
            <Label>Fecha de inicio</Label>
            <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </div>
        </div>

        <div>
          <Label htmlFor="content">Contenido del contrato *</Label>
          <Textarea id="content" name="content" rows={12} value={content} readOnly className="font-mono text-xs" />
          <p className="mt-1 text-xs text-brand-600">
            Se genera automáticamente con las variables de arriba. Puedes editarlo manualmente después de crearlo.
          </p>
        </div>

        <ErrorText>{state.error}</ErrorText>
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Guardando..." : "Guardar contrato"}
        </Button>
      </form>
    </Card>
  );
}

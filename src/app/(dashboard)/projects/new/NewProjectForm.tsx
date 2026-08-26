"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createProjectAction, type ActionResult } from "@/lib/actions/projects";
import { Button, Card, ErrorText, Input, Label } from "@/components/ui";

export function NewProjectForm({ clients }: { clients: { id: string; name: string }[] }) {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(createProjectAction, {});

  if (clients.length === 0) {
    return (
      <Card className="text-center text-brand-700">
        Necesitas al menos un cliente antes de crear un proyecto.{" "}
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
          <Label htmlFor="name">Nombre del proyecto *</Label>
          <Input id="name" name="name" required />
        </div>
        <div>
          <Label htmlFor="clientId">Cliente *</Label>
          <select
            id="clientId"
            name="clientId"
            required
            className="w-full rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-base outline-none focus:border-brand-500"
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="status">Estado</Label>
            <select
              id="status"
              name="status"
              defaultValue="ACTIVE"
              className="w-full rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-base outline-none focus:border-brand-500"
            >
              <option value="ACTIVE">Activo</option>
              <option value="PAUSED">Pausado</option>
              <option value="COMPLETED">Completado</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </div>
          <div>
            <Label htmlFor="amount">Monto (MXN)</Label>
            <Input id="amount" name="amount" type="number" step="0.01" min="0" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="startDate">Fecha inicio</Label>
            <Input id="startDate" name="startDate" type="date" />
          </div>
          <div>
            <Label htmlFor="endDate">Fecha fin</Label>
            <Input id="endDate" name="endDate" type="date" />
          </div>
        </div>
        <ErrorText>{state.error}</ErrorText>
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Guardando..." : "Guardar proyecto"}
        </Button>
      </form>
    </Card>
  );
}

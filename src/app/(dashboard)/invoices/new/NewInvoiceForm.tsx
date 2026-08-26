"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { createInvoiceAction, type ActionResult } from "@/lib/actions/invoices";
import { Button, Card, ErrorText, Input, Label, Textarea } from "@/components/ui";

type Item = { description: string; quantity: string; unitPrice: string };

export function NewInvoiceForm({
  clients,
  projects,
  suggestedNumber,
}: {
  clients: { id: string; name: string }[];
  projects: { id: string; name: string; clientId: string }[];
  suggestedNumber: string;
}) {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(createInvoiceAction, {});
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [items, setItems] = useState<Item[]>([{ description: "", quantity: "1", unitPrice: "" }]);

  const filteredProjects = useMemo(() => projects.filter((p) => p.clientId === clientId), [projects, clientId]);

  const total = items.reduce((sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0);

  if (clients.length === 0) {
    return (
      <Card className="text-center text-brand-700">
        Necesitas al menos un cliente antes de crear una factura.{" "}
        <Link href="/clients/new" className="underline font-bold">
          Crear cliente
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <form action={formAction} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="number">Número de factura *</Label>
            <Input id="number" name="number" required defaultValue={suggestedNumber} />
          </div>
          <div>
            <Label htmlFor="dueDate">Fecha de vencimiento *</Label>
            <Input id="dueDate" name="dueDate" type="date" required />
          </div>
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

        <div>
          <Label>Ítems *</Label>
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="grid grid-cols-1 gap-2 rounded-xl border-2 border-[var(--color-border)] p-3 sm:grid-cols-[1fr_90px_120px_36px]">
                <input
                  name="itemDescription"
                  placeholder="Descripción"
                  required
                  value={item.description}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...next[i], description: e.target.value };
                    setItems(next);
                  }}
                  className="rounded-lg border-2 border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-brand-500"
                />
                <input
                  name="itemQuantity"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Cant."
                  value={item.quantity}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...next[i], quantity: e.target.value };
                    setItems(next);
                  }}
                  className="rounded-lg border-2 border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-brand-500"
                />
                <input
                  name="itemUnitPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Precio"
                  value={item.unitPrice}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...next[i], unitPrice: e.target.value };
                    setItems(next);
                  }}
                  className="rounded-lg border-2 border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-brand-500"
                />
                <button
                  type="button"
                  onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                  disabled={items.length === 1}
                  className="rounded-lg bg-red-950 text-white disabled:opacity-30"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setItems([...items, { description: "", quantity: "1", unitPrice: "" }])}
            className="mt-2 text-sm font-bold text-brand-700 underline"
          >
            + Agregar ítem
          </button>
        </div>

        <div className="text-right text-xl font-black text-brand-900">
          Total: ${total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
        </div>

        <div>
          <Label htmlFor="notes">Notas</Label>
          <Textarea id="notes" name="notes" rows={2} />
        </div>

        <ErrorText>{state.error}</ErrorText>
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Guardando..." : "Crear factura"}
        </Button>
      </form>
    </Card>
  );
}

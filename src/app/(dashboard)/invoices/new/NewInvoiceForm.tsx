"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import { createInvoiceAction, type ActionResult } from "@/lib/actions/invoices";
import { Button, Card, ErrorText, Input, Label, Select, Textarea } from "@/components/ui";

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
      <Card className="text-center text-[var(--color-text-muted)]">
        Necesitas al menos un cliente antes de crear una factura.{" "}
        <Link href="/clients/new" className="font-medium text-brand-700 underline underline-offset-2">
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
          <Select id="clientId" name="clientId" required value={clientId} onChange={(e) => setClientId(e.target.value)}>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>

        {filteredProjects.length > 0 && (
          <div>
            <Label htmlFor="projectId">Proyecto (opcional)</Label>
            <Select id="projectId" name="projectId" defaultValue="">
              <option value="">Sin proyecto</option>
              {filteredProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>
        )}

        <div>
          <Label>Ítems *</Label>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div
                key={i}
                className="grid grid-cols-1 gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-2.5 sm:grid-cols-[1fr_88px_120px_32px]"
              >
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
                  className="rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none transition-all duration-150 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
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
                  className="rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none transition-all duration-150 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
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
                  className="rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none transition-all duration-150 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                />
                <button
                  type="button"
                  onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                  disabled={items.length === 1}
                  aria-label="Eliminar ítem"
                  className="flex items-center justify-center rounded-md text-[var(--color-text-muted)] transition-colors duration-150 hover:bg-red-50 hover:text-brand-700 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <X size={16} strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setItems([...items, { description: "", quantity: "1", unitPrice: "" }])}
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 transition-opacity duration-150 hover:opacity-70"
          >
            <Plus size={15} strokeWidth={2} />
            Agregar ítem
          </button>
        </div>

        <div className="flex items-baseline justify-end gap-2 border-t border-[var(--color-border)] pt-4">
          <span className="text-sm text-[var(--color-text-muted)]">Total</span>
          <span className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            ${total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
          </span>
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

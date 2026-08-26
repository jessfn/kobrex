"use client";

import { useActionState } from "react";
import { createExpenseAction, type ActionResult } from "@/lib/actions/expenses";
import { Button, Card, ErrorText, Input, Label } from "@/components/ui";

export default function NewExpensePage() {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(createExpenseAction, {});
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Nuevo gasto</h1>
      <Card>
        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="description">Descripción *</Label>
            <Input id="description" name="description" required placeholder="Ej. Suscripción de software" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="amount">Monto (MXN) *</Label>
              <Input id="amount" name="amount" type="number" step="0.01" min="0.01" required />
            </div>
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Input id="category" name="category" placeholder="Ej. Software, Renta, Transporte" />
            </div>
          </div>
          <div>
            <Label htmlFor="date">Fecha *</Label>
            <Input id="date" name="date" type="date" required defaultValue={today} />
          </div>
          <ErrorText>{state.error}</ErrorText>
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Guardando..." : "Guardar gasto"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

"use client";

import { useActionState } from "react";
import { createClientAction, type ActionResult } from "@/lib/actions/clients";
import { Button, Card, ErrorText, Input, Label, Textarea } from "@/components/ui";

export default function NewClientPage() {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(createClientAction, {});

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Nuevo cliente</h1>
      <Card>
        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre *</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="company">Empresa</Label>
            <Input id="company" name="company" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" />
            </div>
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" name="phone" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="rfc">RFC (opcional)</Label>
              <Input id="rfc" name="rfc" placeholder="XAXX010101000" />
            </div>
            <div>
              <Label htmlFor="address">Domicilio</Label>
              <Input id="address" name="address" />
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Notas</Label>
            <Textarea id="notes" name="notes" rows={3} />
          </div>
          <ErrorText>{state.error}</ErrorText>
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Guardando..." : "Guardar cliente"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

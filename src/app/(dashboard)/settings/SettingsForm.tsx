"use client";

import { useActionState } from "react";
import { updateBusinessProfileAction, type ActionResult } from "@/lib/actions/settings";
import { Button, Card, ErrorText, Input, Label, Textarea } from "@/components/ui";

type Initial = {
  businessName: string;
  rfc: string;
  fiscalAddress: string;
  phone: string;
  taxRegime: string;
};

export function SettingsForm({ initial }: { initial: Initial }) {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(updateBusinessProfileAction, {});

  return (
    <Card>
      <form action={formAction} className="space-y-4">
        <div>
          <Label htmlFor="businessName">Nombre o razón social</Label>
          <Input id="businessName" name="businessName" defaultValue={initial.businessName} placeholder="Tu nombre completo o el de tu negocio" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="rfc">RFC (opcional)</Label>
            <Input id="rfc" name="rfc" defaultValue={initial.rfc} placeholder="XAXX010101000" />
          </div>
          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" name="phone" defaultValue={initial.phone} />
          </div>
        </div>
        <div>
          <Label htmlFor="taxRegime">Régimen fiscal (opcional)</Label>
          <Input
            id="taxRegime"
            name="taxRegime"
            defaultValue={initial.taxRegime}
            placeholder="Ej. Personas Físicas con Actividades Empresariales y Profesionales"
          />
        </div>
        <div>
          <Label htmlFor="fiscalAddress">Domicilio</Label>
          <Textarea id="fiscalAddress" name="fiscalAddress" defaultValue={initial.fiscalAddress} rows={2} />
        </div>
        <ErrorText>{state.error}</ErrorText>
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={pending}>
            {pending ? "Guardando..." : "Guardar cambios"}
          </Button>
          {state.success && <span className="text-sm text-emerald-700">Guardado</span>}
        </div>
      </form>
    </Card>
  );
}

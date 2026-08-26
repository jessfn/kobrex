"use client";

import { extendTrialAction, grantComplimentaryAccessAction, suspendAccessAction } from "@/lib/actions/admin";
import { Button } from "@/components/ui";

export function UserAdminActions({ userId }: { userId: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="ghost" onClick={() => extendTrialAction(userId, 14)}>
        Extender prueba 14 días
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={() => {
          if (confirm("¿Dar acceso de cortesía por 1 año sin cobrar?")) grantComplimentaryAccessAction(userId);
        }}
      >
        Dar acceso de cortesía
      </Button>
      <Button
        type="button"
        variant="danger"
        onClick={() => {
          if (confirm("¿Suspender el acceso de este suscriptor?")) suspendAccessAction(userId);
        }}
      >
        Suspender acceso
      </Button>
    </div>
  );
}

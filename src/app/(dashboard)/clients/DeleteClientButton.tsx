"use client";

import { deleteClientAction } from "@/lib/actions/clients";
import { Button } from "@/components/ui";

export function DeleteClientButton({ id }: { id: string }) {
  return (
    <Button
      type="button"
      variant="danger"
      className="px-3 py-1.5 text-xs"
      onClick={() => {
        if (confirm("¿Eliminar este cliente? Esto también borrará sus proyectos, facturas y contratos.")) {
          deleteClientAction(id);
        }
      }}
    >
      Eliminar
    </Button>
  );
}

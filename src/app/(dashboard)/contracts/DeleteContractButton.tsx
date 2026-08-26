"use client";

import { deleteContractAction } from "@/lib/actions/contracts";
import { Button } from "@/components/ui";

export function DeleteContractButton({ id }: { id: string }) {
  return (
    <Button
      type="button"
      variant="danger"
      className="px-3 py-1.5 text-xs"
      onClick={() => {
        if (confirm("¿Eliminar este contrato?")) deleteContractAction(id);
      }}
    >
      Eliminar
    </Button>
  );
}

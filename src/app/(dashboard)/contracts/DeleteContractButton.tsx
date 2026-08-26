"use client";

import { Trash2 } from "lucide-react";
import { deleteContractAction } from "@/lib/actions/contracts";

export function DeleteContractButton({ id }: { id: string }) {
  return (
    <button
      type="button"
      aria-label="Eliminar contrato"
      onClick={() => {
        if (confirm("¿Eliminar este contrato?")) deleteContractAction(id);
      }}
      className="inline-flex items-center justify-center rounded-md border border-[var(--color-border-strong)] p-1.5 text-[var(--color-text-muted)] transition-colors duration-150 hover:bg-red-50 hover:text-brand-700"
    >
      <Trash2 size={13} strokeWidth={1.75} />
    </button>
  );
}

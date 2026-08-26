"use client";

import { Trash2 } from "lucide-react";
import { deleteClientAction } from "@/lib/actions/clients";

export function DeleteClientButton({ id }: { id: string }) {
  return (
    <button
      type="button"
      aria-label="Eliminar cliente"
      onClick={() => {
        if (confirm("¿Eliminar este cliente? Esto también borrará sus proyectos, recibos y contratos.")) {
          deleteClientAction(id);
        }
      }}
      className="inline-flex items-center justify-center rounded-md p-1.5 text-[var(--color-text-muted)] transition-colors duration-150 hover:bg-red-50 hover:text-brand-700"
    >
      <Trash2 size={15} strokeWidth={1.75} />
    </button>
  );
}

"use client";

import { deleteProjectAction } from "@/lib/actions/projects";
import { Button } from "@/components/ui";

export function DeleteProjectButton({ id }: { id: string }) {
  return (
    <Button
      type="button"
      variant="danger"
      className="px-3 py-1.5 text-xs"
      onClick={() => {
        if (confirm("¿Eliminar este proyecto?")) deleteProjectAction(id);
      }}
    >
      Eliminar
    </Button>
  );
}

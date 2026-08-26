"use client";

import Link from "next/link";
import { FileText, Check, Trash2 } from "lucide-react";
import { deleteInvoiceAction, markInvoicePaidAction } from "@/lib/actions/invoices";

export function InvoiceRowActions({ id, paid }: { id: string; paid: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Link
        href={`/api/invoices/${id}/pdf`}
        target="_blank"
        aria-label="Descargar PDF"
        className="inline-flex items-center justify-center rounded-md p-1.5 text-[var(--color-text-muted)] transition-colors duration-150 hover:bg-[var(--color-surface-muted)] hover:text-[var(--foreground)]"
      >
        <FileText size={15} strokeWidth={1.75} />
      </Link>
      {!paid && (
        <button
          onClick={() => markInvoicePaidAction(id)}
          aria-label="Marcar como pagada"
          className="inline-flex items-center justify-center rounded-md p-1.5 text-emerald-700 transition-colors duration-150 hover:bg-emerald-50"
        >
          <Check size={15} strokeWidth={2} />
        </button>
      )}
      <button
        onClick={() => {
          if (confirm("¿Eliminar esta factura?")) deleteInvoiceAction(id);
        }}
        aria-label="Eliminar factura"
        className="inline-flex items-center justify-center rounded-md p-1.5 text-[var(--color-text-muted)] transition-colors duration-150 hover:bg-red-50 hover:text-brand-700"
      >
        <Trash2 size={15} strokeWidth={1.75} />
      </button>
    </div>
  );
}

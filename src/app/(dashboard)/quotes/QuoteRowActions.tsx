"use client";

import Link from "next/link";
import { FileText, ArrowRightCircle, Trash2 } from "lucide-react";
import { convertQuoteToInvoiceAction, deleteQuoteAction } from "@/lib/actions/quotes";

export function QuoteRowActions({ id, converted }: { id: string; converted: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Link
        href={`/api/quotes/${id}/pdf`}
        target="_blank"
        aria-label="Descargar PDF"
        className="inline-flex items-center justify-center rounded-md p-1.5 text-[var(--color-text-muted)] transition-colors duration-150 hover:bg-[var(--color-surface-muted)] hover:text-[var(--foreground)]"
      >
        <FileText size={15} strokeWidth={1.75} />
      </Link>
      {!converted && (
        <button
          onClick={() => {
            if (confirm("¿Convertir esta cotización en un recibo?")) convertQuoteToInvoiceAction(id);
          }}
          aria-label="Convertir a recibo"
          className="inline-flex items-center justify-center rounded-md p-1.5 text-emerald-700 transition-colors duration-150 hover:bg-emerald-50"
        >
          <ArrowRightCircle size={15} strokeWidth={1.75} />
        </button>
      )}
      <button
        onClick={() => {
          if (confirm("¿Eliminar esta cotización?")) deleteQuoteAction(id);
        }}
        aria-label="Eliminar cotización"
        className="inline-flex items-center justify-center rounded-md p-1.5 text-[var(--color-text-muted)] transition-colors duration-150 hover:bg-red-50 hover:text-brand-700"
      >
        <Trash2 size={15} strokeWidth={1.75} />
      </button>
    </div>
  );
}

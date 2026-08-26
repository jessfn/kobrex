"use client";

import Link from "next/link";
import { deleteInvoiceAction, markInvoicePaidAction } from "@/lib/actions/invoices";

export function InvoiceRowActions({ id, paid }: { id: string; paid: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={`/api/invoices/${id}/pdf`}
        target="_blank"
        className="rounded-lg border-2 border-brand-300 px-2 py-1 text-xs font-bold text-brand-700 hover:bg-brand-50"
      >
        PDF
      </Link>
      {!paid && (
        <button
          onClick={() => markInvoicePaidAction(id)}
          className="rounded-lg border-2 border-green-300 bg-green-50 px-2 py-1 text-xs font-bold text-green-800 hover:bg-green-100"
        >
          Marcar pagada
        </button>
      )}
      <button
        onClick={() => {
          if (confirm("¿Eliminar esta factura?")) deleteInvoiceAction(id);
        }}
        className="rounded-lg border-2 border-red-900 bg-red-950 px-2 py-1 text-xs font-bold text-white hover:bg-black"
      >
        Eliminar
      </button>
    </div>
  );
}

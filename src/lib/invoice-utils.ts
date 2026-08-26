import { Decimal } from "@prisma/client/runtime/library";

type ItemLike = { quantity: Decimal | number; unitPrice: Decimal | number };

export function invoiceSubtotal(items: ItemLike[]): number {
  return items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unitPrice), 0);
}

export type InvoiceBreakdown = { subtotal: number; iva: number; total: number };

export function invoiceBreakdown(
  items: ItemLike[],
  applyIva: boolean,
  ivaRate: Decimal | number
): InvoiceBreakdown {
  const subtotal = invoiceSubtotal(items);
  const iva = applyIva ? subtotal * (Number(ivaRate) / 100) : 0;
  return { subtotal, iva, total: subtotal + iva };
}

export function effectiveStatus(status: string, dueDate: Date): "PENDING" | "PAID" | "OVERDUE" | "CANCELLED" {
  if (status === "PENDING" && dueDate.getTime() < Date.now()) return "OVERDUE";
  return status as "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
}

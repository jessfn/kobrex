import { Decimal } from "@prisma/client/runtime/library";

type ItemLike = { quantity: Decimal | number; unitPrice: Decimal | number };

export function invoiceTotal(items: ItemLike[]): number {
  return items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unitPrice), 0);
}

export function effectiveStatus(status: string, dueDate: Date): "PENDING" | "PAID" | "OVERDUE" | "CANCELLED" {
  if (status === "PENDING" && dueDate.getTime() < Date.now()) return "OVERDUE";
  return status as "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
}

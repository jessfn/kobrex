import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendInvoiceReminder } from "@/lib/email/resend";
import { invoiceTotal } from "@/lib/invoice-utils";

/**
 * Disparado por un cron del sistema operativo en el VPS (no por node-cron embebido,
 * para evitar duplicar el job si PM2 reinicia el proceso). Ver deploy.sh / README para
 * la línea de crontab sugerida.
 */
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const now = new Date();
  const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  const upcoming = await prisma.invoice.findMany({
    where: { status: "PENDING", dueDate: { gte: now, lte: in3Days } },
    include: { client: true, items: true },
  });

  const overdue = await prisma.invoice.findMany({
    where: { status: "PENDING", dueDate: { lt: now } },
    include: { client: true, items: true },
  });

  let sent = 0;

  for (const inv of [...upcoming, ...overdue]) {
    if (!inv.client.email) continue;
    await sendInvoiceReminder({
      to: inv.client.email,
      clientName: inv.client.name,
      invoiceNumber: inv.number,
      amount: invoiceTotal(inv.items),
      dueDate: inv.dueDate,
      overdue: inv.dueDate < now,
    });
    sent++;
  }

  if (overdue.length > 0) {
    await prisma.invoice.updateMany({
      where: { id: { in: overdue.map((i) => i.id) } },
      data: { status: "OVERDUE" },
    });
  }

  return NextResponse.json({ sent, overdueMarked: overdue.length });
}

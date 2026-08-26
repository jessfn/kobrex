import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { toCsv } from "@/lib/csv";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const clients = await prisma.client.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const rows = clients.map((c) => [
    c.name,
    c.company ?? "",
    c.email ?? "",
    c.phone ?? "",
    c.rfc ?? "",
    c.address ?? "",
    c.createdAt.toLocaleDateString("es-MX"),
  ]);

  const csv = toCsv(["Nombre", "Empresa", "Email", "Teléfono", "RFC", "Domicilio", "Alta"], rows);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="clientes.csv"`,
    },
  });
}

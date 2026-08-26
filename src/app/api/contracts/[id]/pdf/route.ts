import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ContractPdf } from "@/lib/pdf/ContractPdf";

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await context.params;

  const [contract, user] = await Promise.all([
    prisma.contract.findFirst({ where: { id, userId: session.user.id } }),
    prisma.user.findUniqueOrThrow({ where: { id: session.user.id } }),
  ]);
  if (!contract) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const buffer = await renderToBuffer(
    ContractPdf({
      title: contract.title,
      content: contract.content,
      emitterName: user.businessName || user.name,
      folio: contract.id.slice(-8).toUpperCase(),
      date: contract.createdAt,
    })
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="contrato-${contract.id}.pdf"`,
    },
  });
}

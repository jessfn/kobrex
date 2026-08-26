import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  const session = await auth();
  const user = await prisma.user.findUniqueOrThrow({ where: { id: session!.user.id } });

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">Configuración</h1>
      <p className="mb-6 text-sm text-[var(--color-text-muted)]">
        Estos datos aparecen como emisor en tus recibos y contratos en PDF.
      </p>
      <SettingsForm
        initial={{
          businessName: user.businessName ?? "",
          rfc: user.rfc ?? "",
          fiscalAddress: user.fiscalAddress ?? "",
          phone: user.phone ?? "",
          taxRegime: user.taxRegime ?? "",
        }}
      />
    </div>
  );
}

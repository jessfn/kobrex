"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPasswordAction, type ActionResult } from "@/lib/actions/password-reset";
import { Button, Card, ErrorText, Input, Label } from "@/components/ui";
import { Logo } from "@/components/Logo";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(resetPasswordAction, {});

  if (!token) {
    return <p className="text-sm text-[var(--color-text-muted)]">Enlace inválido. Solicita uno nuevo.</p>;
  }

  if (state.success) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-[var(--color-text-muted)]">Tu contraseña se actualizó correctamente.</p>
        <Link href="/login">
          <Button className="w-full">Iniciar sesión</Button>
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <div>
        <Label htmlFor="password">Nueva contraseña</Label>
        <Input id="password" name="password" type="password" required placeholder="Mínimo 6 caracteres" />
      </div>
      <ErrorText>{state.error}</ErrorText>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Guardando..." : "Cambiar contraseña"}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-brand-800 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Logo size="lg" />
          <h1 className="text-xl font-semibold tracking-tight text-white">Kobrex</h1>
        </div>
        <Card className="shadow-[var(--shadow-lg)]">
          <h2 className="mb-6 text-lg font-semibold tracking-tight">Elige una nueva contraseña</h2>
          <Suspense fallback={null}>
            <ResetPasswordForm />
          </Suspense>
        </Card>
      </div>
    </div>
  );
}

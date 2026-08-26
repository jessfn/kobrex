"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPasswordAction, type ActionResult } from "@/lib/actions/password-reset";
import { Button, Card, ErrorText, Input, Label } from "@/components/ui";

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
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-xl font-semibold tracking-tight text-brand-800">Kobrex</h1>
        <Card className="shadow-[var(--shadow-md)]">
          <h2 className="mb-6 text-lg font-semibold tracking-tight">Elige una nueva contraseña</h2>
          <Suspense fallback={null}>
            <ResetPasswordForm />
          </Suspense>
        </Card>
      </div>
    </div>
  );
}

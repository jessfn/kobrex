"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordResetAction, type ActionResult } from "@/lib/actions/password-reset";
import { Button, Card, ErrorText, Input, Label } from "@/components/ui";
import { Logo } from "@/components/Logo";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(requestPasswordResetAction, {});

  return (
    <div className="flex min-h-dvh items-center justify-center bg-brand-800 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Logo size="lg" />
          <h1 className="text-xl font-semibold tracking-tight text-white">Kobrex</h1>
        </div>
        <Card className="shadow-[var(--shadow-lg)]">
          <h2 className="mb-2 text-lg font-semibold tracking-tight">Recupera tu contraseña</h2>
          {state.success ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              Si existe una cuenta con ese email, te enviamos un enlace para restablecer tu contraseña.
              Revisa tu bandeja de entrada.
            </p>
          ) : (
            <>
              <p className="mb-6 text-sm text-[var(--color-text-muted)]">
                Ingresa tu email y te enviaremos un enlace para elegir una nueva contraseña.
              </p>
              <form action={formAction} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required placeholder="tu@email.com" />
                </div>
                <ErrorText>{state.error}</ErrorText>
                <Button type="submit" disabled={pending} className="w-full">
                  {pending ? "Enviando..." : "Enviar enlace"}
                </Button>
              </form>
            </>
          )}
        </Card>
        <p className="mt-6 text-center text-sm text-red-100">
          <Link href="/login" className="font-medium text-white underline underline-offset-2">
            Volver a iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

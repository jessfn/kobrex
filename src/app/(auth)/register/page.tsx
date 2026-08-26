"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type ActionResult } from "@/lib/actions/auth";
import { Button, Card, ErrorText, Input, Label } from "@/components/ui";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(registerAction, {});

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-xl font-semibold tracking-tight text-brand-800">Kobrex</h1>
        <Card className="shadow-[var(--shadow-md)]">
          <h2 className="mb-6 text-lg font-semibold tracking-tight">Crea tu cuenta</h2>
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" required placeholder="Tu nombre" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="tu@email.com" />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" required placeholder="Mínimo 6 caracteres" />
            </div>
            <label className="flex items-start gap-2 text-xs text-[var(--color-text-muted)]">
              <input
                type="checkbox"
                name="acceptedTerms"
                required
                className="mt-0.5 h-4 w-4 rounded border-[var(--color-border-strong)] accent-brand-700"
              />
              <span>
                Acepto los{" "}
                <Link href="/terms" target="_blank" className="font-medium text-brand-700 underline underline-offset-2">
                  Términos y Condiciones
                </Link>{" "}
                y el{" "}
                <Link href="/privacy" target="_blank" className="font-medium text-brand-700 underline underline-offset-2">
                  Aviso de Privacidad
                </Link>
              </span>
            </label>
            <ErrorText>{state.error}</ErrorText>
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </form>
        </Card>
        <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-medium text-brand-700 underline underline-offset-2">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type ActionResult } from "@/lib/actions/auth";
import { Button, Card, ErrorText, Input, Label } from "@/components/ui";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(loginAction, {});

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-xl font-semibold tracking-tight text-brand-800">Kobrex</h1>
        <Card className="shadow-[var(--shadow-md)]">
          <h2 className="mb-6 text-lg font-semibold tracking-tight">Inicia sesión</h2>
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="tu@email.com" />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-medium text-[var(--color-text-muted)]">
                  Contraseña
                </label>
                <Link href="/forgot-password" className="text-xs font-medium text-brand-700 underline underline-offset-2">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input id="password" name="password" type="password" required placeholder="••••••••" />
            </div>
            <ErrorText>{state.error}</ErrorText>
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </Card>
        <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="font-medium text-brand-700 underline underline-offset-2">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type ActionResult } from "@/lib/actions/auth";
import { Button, Card, ErrorText, Input, Label } from "@/components/ui";
import { Logo } from "@/components/Logo";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(loginAction, {});

  return (
    <div className="flex min-h-dvh items-center justify-center bg-brand-800 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Logo size="lg" />
          <h1 className="text-xl font-semibold tracking-tight text-white">Kobrex</h1>
        </div>
        <Card className="shadow-[var(--shadow-lg)]">
          <h2 className="mb-6 text-lg font-semibold tracking-tight">Inicia sesión</h2>

          <GoogleSignInButton label="Continuar con Google" />

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--color-border)]" />
            <span className="text-xs text-[var(--color-text-muted)]">o con tu email</span>
            <div className="h-px flex-1 bg-[var(--color-border)]" />
          </div>

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
        <p className="mt-6 text-center text-sm text-red-100">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="font-medium text-white underline underline-offset-2">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}

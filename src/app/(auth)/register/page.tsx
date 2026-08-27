"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type ActionResult } from "@/lib/actions/auth";
import { Button, Card, ErrorText, Input, Label } from "@/components/ui";
import { Logo } from "@/components/Logo";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { PhoneFields } from "@/components/PhoneFields";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(registerAction, {});

  return (
    <div className="flex min-h-dvh items-center justify-center bg-brand-800 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Logo size="lg" />
          <h1 className="text-xl font-semibold tracking-tight text-white">Kobrex</h1>
        </div>
        <Card className="shadow-[var(--shadow-lg)]">
          <h2 className="mb-6 text-lg font-semibold tracking-tight">Crea tu cuenta</h2>

          <GoogleSignInButton label="Registrarme con Google" />

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--color-border)]" />
            <span className="text-xs text-[var(--color-text-muted)]">o con tu email</span>
            <div className="h-px flex-1 bg-[var(--color-border)]" />
          </div>

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
            <PhoneFields />
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
        <p className="mt-6 text-center text-sm text-red-100">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-medium text-white underline underline-offset-2">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

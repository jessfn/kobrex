"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type ActionResult } from "@/lib/actions/auth";
import { Button, Card, ErrorText, Input, Label } from "@/components/ui";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(loginAction, {});

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,var(--color-red-100),var(--background))] px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="mb-8 text-center text-4xl font-black tracking-tight text-brand-700">
          Kobre<span className="text-red-950">x</span>
        </h1>
        <Card>
          <h2 className="mb-6 text-2xl font-extrabold">Inicia sesión</h2>
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="tu@email.com" />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" required placeholder="••••••••" />
            </div>
            <ErrorText>{state.error}</ErrorText>
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </Card>
        <p className="mt-6 text-center text-sm font-semibold text-brand-700">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="underline decoration-2 underline-offset-2">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useActionState } from "react";
import Link from "next/link";
import { completeOnboardingAction, type ActionResult } from "@/lib/actions/onboarding";
import { Button, Card, ErrorText, Input, Label } from "@/components/ui";
import { Logo } from "@/components/Logo";
import { PhoneFields } from "@/components/PhoneFields";

export default function OnboardingPage() {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(completeOnboardingAction, {});

  return (
    <div className="flex min-h-dvh items-center justify-center bg-brand-800 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Logo size="lg" />
          <h1 className="text-xl font-semibold tracking-tight text-white">Kobrex</h1>
        </div>
        <Card className="shadow-[var(--shadow-lg)]">
          <h2 className="mb-2 text-lg font-semibold tracking-tight">Un último paso</h2>
          <p className="mb-6 text-sm text-[var(--color-text-muted)]">
            Antes de continuar, confirma tu información y acepta nuestros términos.
          </p>
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="businessName">Nombre o razón social (opcional)</Label>
              <Input id="businessName" name="businessName" placeholder="Tu nombre completo o el de tu negocio" />
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
              {pending ? "Guardando..." : "Continuar"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

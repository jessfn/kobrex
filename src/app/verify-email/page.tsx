"use client";

import { Suspense, useActionState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { verifyEmailAction, type ActionResult } from "@/lib/actions/verify-email";
import { Button, Card } from "@/components/ui";
import { Logo } from "@/components/Logo";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(verifyEmailAction, {});
  const formRef = useRef<HTMLFormElement>(null);
  const submitted = useRef(false);

  useEffect(() => {
    if (token && !submitted.current) {
      submitted.current = true;
      formRef.current?.requestSubmit();
    }
  }, [token]);

  if (!token) {
    return <p className="text-sm text-[var(--color-text-muted)]">Enlace inválido. Revisa el correo de verificación.</p>;
  }

  return (
    <>
      <form ref={formRef} action={formAction}>
        <input type="hidden" name="token" value={token} />
      </form>

      {pending && <p className="text-sm text-[var(--color-text-muted)]">Verificando tu correo...</p>}

      {!pending && state.success && (
        <div className="space-y-4">
          <p className="text-sm text-[var(--color-text-muted)]">Tu correo se verificó correctamente.</p>
          <Link href="/dashboard">
            <Button className="w-full">Ir a mi panel</Button>
          </Link>
        </div>
      )}

      {!pending && state.error && <p className="text-sm text-brand-700">{state.error}</p>}
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-brand-800 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Logo size="lg" />
          <h1 className="text-xl font-semibold tracking-tight text-white">Kobrex</h1>
        </div>
        <Card className="shadow-[var(--shadow-lg)]">
          <h2 className="mb-6 text-lg font-semibold tracking-tight">Verificación de correo</h2>
          <Suspense fallback={null}>
            <VerifyEmailContent />
          </Suspense>
        </Card>
      </div>
    </div>
  );
}

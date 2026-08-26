"use client";

import { useActionState } from "react";
import { ShieldCheck } from "lucide-react";
import { adminLoginAction, type ActionResult } from "@/lib/actions/admin-auth";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(adminLoginAction, {});

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#0f0f10] px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
            <ShieldCheck size={25} strokeWidth={2} />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold tracking-tight text-white">Kobrex</h1>
            <p className="text-xs font-medium uppercase tracking-wider text-white/50">Acceso de administrador</p>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#1a1a1c] p-6">
          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-white/50">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="tu@email.com"
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition-all duration-150 placeholder:text-white/30 focus:border-white/40 focus:ring-4 focus:ring-white/10"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-white/50">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition-all duration-150 placeholder:text-white/30 focus:border-white/40 focus:ring-4 focus:ring-white/10"
              />
            </div>
            {state.error && <p className="text-sm text-red-400">{state.error}</p>}
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black transition-all duration-150 hover:bg-white/90 disabled:opacity-40"
            >
              {pending ? "Verificando..." : "Entrar al panel"}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-xs text-white/40">Acceso restringido solo para el dueño de Kobrex.</p>
      </div>
    </div>
  );
}

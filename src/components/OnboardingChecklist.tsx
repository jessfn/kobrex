"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, X } from "lucide-react";

const DISMISS_KEY = "kobrex_onboarding_dismissed";

type Step = { label: string; done: boolean; href: string };

export function OnboardingChecklist({ steps }: { steps: Step[] }) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lectura única de localStorage al montar; evita mismatch de hidratación
    setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  const allDone = steps.every((s) => s.done);
  if (dismissed || allDone) return null;

  return (
    <div className="mb-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Primeros pasos en Kobrex</h3>
        <button
          onClick={() => {
            localStorage.setItem(DISMISS_KEY, "1");
            setDismissed(true);
          }}
          aria-label="Cerrar"
          className="text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--foreground)]"
        >
          <X size={16} strokeWidth={1.75} />
        </button>
      </div>
      <div className="space-y-2">
        {steps.map((step) => (
          <Link
            key={step.label}
            href={step.href}
            className="flex items-center gap-2.5 text-sm transition-opacity duration-150 hover:opacity-70"
          >
            {step.done ? (
              <CheckCircle2 size={18} strokeWidth={1.75} className="shrink-0 text-emerald-600" />
            ) : (
              <Circle size={18} strokeWidth={1.75} className="shrink-0 text-[var(--color-text-muted)]" />
            )}
            <span className={step.done ? "text-[var(--color-text-muted)] line-through" : ""}>{step.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

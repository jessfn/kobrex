import Link from "next/link";
import type { LucideIcon } from "lucide-react";

const tones = {
  blue: "bg-blue-50 text-blue-600",
  violet: "bg-violet-50 text-violet-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
  cyan: "bg-cyan-50 text-cyan-600",
};

export function EmptyState({
  icon: Icon,
  tone = "blue",
  title,
  description,
  actionHref,
  actionLabel,
}: {
  icon: LucideIcon;
  tone?: keyof typeof tones;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-14 text-center">
      <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full ${tones[tone]}`}>
        <Icon size={26} strokeWidth={1.75} />
      </div>
      <h3 className="mb-1 text-sm font-semibold">{title}</h3>
      <p className="mb-5 max-w-xs text-sm text-[var(--color-text-muted)]">{description}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-brand-800 hover:shadow-md"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

import { ButtonHTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-150 ease-out disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]";
  const variants = {
    primary: "bg-brand-700 text-white shadow-sm hover:bg-brand-800 hover:shadow-md",
    ghost:
      "bg-transparent text-[var(--foreground)] border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-muted)] hover:border-brand-300",
    danger:
      "bg-transparent text-brand-700 border border-[var(--color-border-strong)] hover:bg-red-50 hover:border-brand-400 hover:text-brand-800",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm outline-none transition-all duration-150 placeholder:text-[var(--color-text-muted)] focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 ${className}`}
      {...props}
    />
  );
}

export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm outline-none transition-all duration-150 placeholder:text-[var(--color-text-muted)] focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 ${className}`}
      {...props}
    />
  );
}

export function Select({ className = "", ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`w-full rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm outline-none transition-all duration-150 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 ${className}`}
      {...props}
    />
  );
}

export function Label({ className = "", ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={`mb-1.5 block text-xs font-medium text-[var(--color-text-muted)] ${className}`}
      {...props}
    />
  );
}

export function Card({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)] transition-shadow duration-150 ${className}`}
      {...props}
    />
  );
}

export function Badge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "success" | "warning" | "danger";
}) {
  const tones = {
    default: "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] border-[var(--color-border-strong)]",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-brand-700 border-red-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function ErrorText({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="mt-2 text-sm text-brand-700">{children}</p>;
}

import { ButtonHTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-bold text-sm tracking-tight transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  const variants = {
    primary:
      "bg-brand-600 text-white shadow-[0_8px_24px_-8px_rgba(197,19,19,0.6)] hover:bg-brand-700 hover:shadow-[0_12px_32px_-8px_rgba(197,19,19,0.7)]",
    ghost:
      "bg-transparent text-brand-700 border-2 border-brand-200 hover:border-brand-400 hover:bg-brand-50",
    danger: "bg-red-950 text-white hover:bg-black",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-base outline-none transition-colors placeholder:text-red-300 focus:border-brand-500 ${className}`}
      {...props}
    />
  );
}

export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-base outline-none transition-colors placeholder:text-red-300 focus:border-brand-500 ${className}`}
      {...props}
    />
  );
}

export function Label({ className = "", ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={`mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-brand-700 ${className}`}
      {...props}
    />
  );
}

export function Card({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_10px_40px_-20px_rgba(197,19,19,0.4)] ${className}`}
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
    default: "bg-brand-100 text-brand-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-red-950 text-white",
  };
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function ErrorText({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="mt-2 text-sm font-semibold text-red-950">{children}</p>;
}

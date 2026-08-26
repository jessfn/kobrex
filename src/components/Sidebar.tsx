"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutGrid,
  Users,
  FolderKanban,
  Receipt,
  FileText,
  Menu,
  X,
  LogOut,
  Settings,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth-client";

const links = [
  { href: "/dashboard", label: "Panel", icon: LayoutGrid },
  { href: "/clients", label: "Clientes", icon: Users },
  { href: "/projects", label: "Proyectos", icon: FolderKanban },
  { href: "/invoices", label: "Recibos", icon: Receipt },
  { href: "/contracts", label: "Contratos", icon: FileText },
  { href: "/billing", label: "Facturación", icon: CreditCard },
  { href: "/settings", label: "Configuración", icon: Settings },
];

export function Sidebar({ userName, isOwner }: { userName: string; isOwner?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 md:hidden">
        <span className="text-lg font-semibold tracking-tight text-brand-800">
          Kobrex
        </span>
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border-strong)] text-[var(--foreground)] transition-colors duration-150 hover:bg-[var(--color-surface-muted)]"
        >
          {open ? <X size={17} strokeWidth={1.75} /> : <Menu size={17} strokeWidth={1.75} />}
        </button>
      </div>

      <aside
        className={`${
          open ? "block" : "hidden"
        } w-full border-b border-[var(--color-border)] bg-[var(--color-surface)] md:flex md:h-screen md:w-60 md:shrink-0 md:flex-col md:border-b-0 md:border-r`}
      >
        <div className="hidden px-6 py-6 md:block">
          <span className="text-lg font-semibold tracking-tight text-brand-800">Kobrex</span>
        </div>

        <nav className="flex flex-col gap-0.5 px-3 pb-4 md:flex-1 md:pb-0">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                  active
                    ? "bg-brand-50 text-brand-800"
                    : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--foreground)]"
                }`}
              >
                <link.icon size={17} strokeWidth={1.75} />
                {link.label}
              </Link>
            );
          })}
          {isOwner && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center gap-3 rounded-lg border-t border-[var(--color-border)] px-3 pt-3 text-sm font-medium text-[var(--color-text-muted)] transition-colors duration-150 hover:text-brand-700"
            >
              <ShieldCheck size={17} strokeWidth={1.75} />
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden border-t border-[var(--color-border)] p-4 md:block">
          <p className="truncate text-xs font-medium text-[var(--foreground)]">{userName}</p>
          <form action={logoutAction} className="mt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)] transition-colors duration-150 hover:text-brand-700"
            >
              <LogOut size={13} strokeWidth={1.75} />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}

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
import { Logo } from "@/components/Logo";

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
      <div className="flex items-center justify-between border-b border-brand-950 bg-brand-900 px-4 py-3 md:hidden">
        <div className="flex items-center gap-2.5">
          <Logo size="sm" />
          <span className="text-lg font-semibold tracking-tight text-white">Kobrex</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white transition-colors duration-150 hover:bg-white/10"
        >
          {open ? <X size={17} strokeWidth={1.75} /> : <Menu size={17} strokeWidth={1.75} />}
        </button>
      </div>

      <aside
        className={`${
          open ? "block" : "hidden"
        } w-full border-b border-brand-950 bg-brand-900 md:flex md:h-screen md:w-60 md:shrink-0 md:flex-col md:border-b-0 md:border-r`}
      >
        <div className="hidden items-center gap-2.5 px-6 py-6 md:flex">
          <Logo size="sm" />
          <span className="text-lg font-semibold tracking-tight text-white">Kobrex</span>
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
                    ? "bg-white/12 text-white"
                    : "text-red-200/75 hover:bg-white/8 hover:text-white"
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
              className="mt-2 flex items-center gap-3 rounded-lg border-t border-white/10 px-3 pt-3 text-sm font-medium text-red-200/75 transition-colors duration-150 hover:text-white"
            >
              <ShieldCheck size={17} strokeWidth={1.75} />
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden border-t border-white/10 p-4 md:block">
          <p className="truncate text-xs font-medium text-white">{userName}</p>
          <form action={logoutAction} className="mt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-red-200/75 transition-colors duration-150 hover:text-white"
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

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "@/lib/actions/auth-client";

const links = [
  { href: "/dashboard", label: "Panel", icon: "📊" },
  { href: "/clients", label: "Clientes", icon: "👤" },
  { href: "/projects", label: "Proyectos", icon: "📁" },
  { href: "/invoices", label: "Facturas", icon: "🧾" },
  { href: "/contracts", label: "Contratos", icon: "📄" },
];

export function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between border-b-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 md:hidden">
        <span className="text-2xl font-black text-brand-700">
          Kobre<span className="text-red-950">x</span>
        </span>
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg border-2 border-brand-300 px-3 py-2 font-bold text-brand-700"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      <aside
        className={`${
          open ? "block" : "hidden"
        } w-full border-b-2 border-[var(--color-border)] bg-[var(--color-surface)] md:block md:h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r-2`}
      >
        <div className="hidden px-6 py-6 md:block">
          <span className="text-3xl font-black text-brand-700">
            Kobre<span className="text-red-950">x</span>
          </span>
        </div>

        <nav className="flex flex-col gap-1 px-3 pb-4 md:pb-0">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
                  active
                    ? "bg-brand-600 text-white shadow-md"
                    : "text-brand-800 hover:bg-brand-50"
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto hidden border-t-2 border-[var(--color-border)] p-4 md:block">
          <p className="truncate text-xs font-bold text-brand-700">{userName}</p>
          <form action={logoutAction}>
            <button className="mt-2 text-xs font-semibold text-red-950 underline" type="submit">
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}

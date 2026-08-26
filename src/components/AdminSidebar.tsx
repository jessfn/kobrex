"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Users, ArrowLeftRight } from "lucide-react";

const links = [
  { href: "/admin", label: "Resumen", icon: LayoutGrid, exact: true },
  { href: "/admin/users", label: "Suscriptores", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-[var(--color-border)] bg-[var(--color-surface)] md:flex md:h-screen md:w-60 md:shrink-0 md:flex-col md:border-b-0 md:border-r">
      <div className="px-6 py-6">
        <span className="text-lg font-semibold tracking-tight text-brand-800">Kobrex</span>
        <p className="text-xs font-medium text-[var(--color-text-muted)]">Panel de administrador</p>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {links.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
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
      </nav>

      <div className="border-t border-[var(--color-border)] p-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)] transition-colors duration-150 hover:text-brand-700"
        >
          <ArrowLeftRight size={13} strokeWidth={1.75} />
          Volver a mi cuenta
        </Link>
      </div>
    </aside>
  );
}

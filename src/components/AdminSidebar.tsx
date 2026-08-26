"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Users, ArrowLeftRight } from "lucide-react";
import { Logo } from "@/components/Logo";

const links = [
  { href: "/admin", label: "Resumen", icon: LayoutGrid, exact: true },
  { href: "/admin/users", label: "Suscriptores", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-brand-950 bg-brand-900 md:flex md:h-screen md:w-60 md:shrink-0 md:flex-col md:border-b-0 md:border-r">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <Logo size="sm" />
        <div>
          <span className="text-lg font-semibold tracking-tight text-white">Kobrex</span>
          <p className="text-xs font-medium text-red-200/75">Panel de administrador</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {links.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                active ? "bg-white/12 text-white" : "text-red-200/75 hover:bg-white/8 hover:text-white"
              }`}
            >
              <link.icon size={17} strokeWidth={1.75} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-red-200/75 transition-colors duration-150 hover:text-white"
        >
          <ArrowLeftRight size={13} strokeWidth={1.75} />
          Volver a mi cuenta
        </Link>
      </div>
    </aside>
  );
}

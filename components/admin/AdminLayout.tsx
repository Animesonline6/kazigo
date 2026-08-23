"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Shield } from "lucide-react";
import { adminNavItems } from "@/lib/admin/nav";
import { cn } from "@/lib/utils";

export function AdminLayout({ children, adminName }: { children: React.ReactNode; adminName: string }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-surface-subtle">
      {/* Sidebar fixa — desktop */}
      <aside className="hidden w-60 shrink-0 border-r border-border bg-white lg:block">
        <SidebarContent pathname={pathname} adminName={adminName} />
      </aside>

      {/* Drawer — mobile/tablet */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-900/50" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-elevated">
            <div className="flex items-center justify-between border-b border-border p-4">
              <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Shield className="h-4 w-4 text-navy-700" aria-hidden="true" />
                Administração
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Fechar menu"
                className="flex h-8 w-8 items-center justify-center rounded-sm text-ink-faint hover:bg-surface-muted"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <SidebarContent pathname={pathname} adminName={adminName} onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      <div className="min-w-0 flex-1">
        {/* Barra superior — mobile */}
        <div className="flex items-center gap-3 border-b border-border bg-white p-4 lg:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menu de administração"
            className="flex h-9 w-9 items-center justify-center rounded-sm text-ink hover:bg-surface-muted"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <span className="text-sm font-semibold text-ink">Administração</span>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}

function SidebarContent({
  pathname,
  adminName,
  onNavigate,
}: {
  pathname: string;
  adminName: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="hidden items-center gap-2 border-b border-border p-5 lg:flex">
        <Shield className="h-5 w-5 text-navy-700" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-ink">Administração</p>
          <p className="truncate text-xs text-ink-faint">{adminName}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3" aria-label="Navegação administrativa">
        {adminNavItems.map((item) => {
          const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-navy-700 text-white" : "text-ink-soft hover:bg-surface-muted"
              )}
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
              {!item.ready && !isActive && (
                <span className="ml-auto rounded-full bg-surface-muted px-1.5 py-0.5 text-[10px] font-semibold text-ink-faint">
                  em breve
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

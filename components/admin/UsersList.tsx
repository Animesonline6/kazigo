"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { SuspendUserButton } from "@/components/admin/SuspendUserButton";
import { cn } from "@/lib/utils";

export interface AdminUser {
  id: string;
  full_name: string | null;
  email: string;
  phone?: string | null;
  role: string;
  city: string | null;
  avatar_url: string | null;
  is_suspended: boolean;
  created_at: string;
}

const roleLabel: Record<string, string> = {
  worker: "Trabalhador",
  client: "Cliente",
  company: "Empresa",
  admin: "Administrador",
};

const roleFilters = [
  { value: "all", label: "Todos" },
  { value: "client", label: "Clientes" },
  { value: "worker", label: "Trabalhadores" },
  { value: "company", label: "Empresas" },
  { value: "admin", label: "Admins" },
];

const estadoFilters = [
  { value: "all", label: "Qualquer estado" },
  { value: "ativo", label: "Ativo" },
  { value: "suspenso", label: "Suspenso" },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" });
}

export function UsersList({ users, currentAdminId }: { users: AdminUser[]; currentAdminId: string }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [estadoFilter, setEstadoFilter] = useState("all");

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesEstado =
        estadoFilter === "all" ||
        (estadoFilter === "suspenso" && u.is_suspended) ||
        (estadoFilter === "ativo" && !u.is_suspended);
      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        u.full_name?.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.phone?.toLowerCase().includes(term);
      return matchesRole && matchesEstado && matchesSearch;
    });
  }, [users, search, roleFilter, estadoFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
          <input
            type="text"
            placeholder="Pesquisar por nome, email ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-border py-2.5 pl-9 pr-3 text-sm outline-none focus:border-teal-500"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {roleFilters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setRoleFilter(f.value)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              roleFilter === f.value
                ? "border-navy-700 bg-navy-700 text-white"
                : "border-border text-ink-soft hover:border-navy-700"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {estadoFilters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setEstadoFilter(f.value)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              estadoFilter === f.value
                ? "border-teal-600 bg-teal-50 text-teal-700"
                : "border-border text-ink-soft hover:border-teal-600"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-ink-faint">
        {filtered.length} utilizador{filtered.length === 1 ? "" : "es"}
      </p>

      <div className="flex flex-col gap-3">
        {filtered.map((u) => (
          <Card key={u.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar name={u.full_name || "Utilizador"} src={u.avatar_url ?? undefined} size="sm" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-semibold text-ink">{u.full_name || "Sem nome"}</p>
                  <Badge tone="navy">{roleLabel[u.role] ?? u.role}</Badge>
                  {u.is_suspended && <Badge tone="danger">Suspensa</Badge>}
                </div>
                <p className="truncate text-xs text-ink-faint">{u.email}</p>
                <p className="text-xs text-ink-faint">
                  {u.city ? `${u.city} · ` : ""}Registado em {formatDate(u.created_at)}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <SuspendUserButton
                userId={u.id}
                isSuspended={u.is_suspended}
                disabled={u.id === currentAdminId}
              />
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-ink-faint">Nenhum utilizador encontrado.</p>
        )}
      </div>
    </div>
  );
}

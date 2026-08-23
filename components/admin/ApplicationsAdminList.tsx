"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

export interface AdminApplication {
  id: string;
  job_id: string;
  job_title: string;
  client_name: string;
  worker_name: string;
  worker_avatar: string | null;
  proposed_price: number | null;
  status: string;
  created_at: string;
}

const statusFilters = [
  { value: "all", label: "Todas" },
  { value: "pendente", label: "Pendentes" },
  { value: "aceite", label: "Aceites" },
  { value: "recusada", label: "Recusadas" },
  { value: "retirada", label: "Retiradas" },
];

const statusTone: Record<string, "warning" | "success" | "danger" | "neutral"> = {
  pendente: "warning",
  aceite: "success",
  recusada: "danger",
  retirada: "neutral",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" });
}

export function ApplicationsAdminList({ applications }: { applications: AdminApplication[] }) {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(
    () => applications.filter((a) => statusFilter === "all" || a.status === statusFilter),
    [applications, statusFilter]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setStatusFilter(f.value)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              statusFilter === f.value
                ? "border-navy-700 bg-navy-700 text-white"
                : "border-border text-ink-soft hover:border-navy-700"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-ink-faint">
        {filtered.length} candidatura{filtered.length === 1 ? "" : "s"}
      </p>

      <div className="flex flex-col gap-3">
        {filtered.map((a) => (
          <Card key={a.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar name={a.worker_name} src={a.worker_avatar ?? undefined} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{a.worker_name}</p>
                <Link href={`/trabalhos/${a.job_id}`} className="truncate text-xs text-ink-faint hover:text-navy-700">
                  candidatou-se a &ldquo;{a.job_title}&rdquo; · cliente: {a.client_name}
                </Link>
                <p className="text-xs text-ink-faint">
                  {a.proposed_price ? `${a.proposed_price.toLocaleString("pt-PT")} MTn · ` : ""}
                  {formatDate(a.created_at)}
                </p>
              </div>
            </div>
            <Badge tone={statusTone[a.status] ?? "neutral"} className="w-fit shrink-0">
              {a.status}
            </Badge>
          </Card>
        ))}

        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-ink-faint">Nenhuma candidatura encontrada.</p>
        )}
      </div>
    </div>
  );
}

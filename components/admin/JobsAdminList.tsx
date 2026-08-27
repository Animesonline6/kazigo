"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CloseJobButton } from "@/components/admin/CloseJobButton";
import { ApproveJobButtons } from "@/components/admin/ApproveJobButtons";
import { cn } from "@/lib/utils";

export interface AdminJob {
  id: string;
  title: string;
  category: string;
  city: string | null;
  remote: boolean;
  status: string;
  approval_status: string;
  applications_count: number;
  created_at: string;
  client_id: string;
  client_name: string;
}

const statusFilters = [
  { value: "all", label: "Todos" },
  { value: "pendente_aprovacao", label: "Pendentes de aprovação" },
  { value: "aberto", label: "Ativos" },
  { value: "em_andamento", label: "Em andamento" },
  { value: "concluido", label: "Concluídos" },
  { value: "cancelado", label: "Cancelados" },
  { value: "pausado", label: "Pausados" },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" });
}

export function JobsAdminList({ jobs }: { jobs: AdminJob[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "pendente_aprovacao" ? j.approval_status === "pendente" : j.status === statusFilter);
      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        j.title.toLowerCase().includes(term) ||
        j.category.toLowerCase().includes(term) ||
        j.client_name.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [jobs, search, statusFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
        <input
          type="text"
          placeholder="Pesquisar por título, categoria ou cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-border py-2.5 pl-9 pr-3 text-sm outline-none focus:border-teal-500"
        />
      </div>

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
        {filtered.length} trabalho{filtered.length === 1 ? "" : "s"}
      </p>

      <div className="flex flex-col gap-3">
        {filtered.map((job) => (
          <Card key={job.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/trabalhos/${job.id}`} className="text-sm font-semibold text-ink hover:text-navy-700">
                  {job.title}
                </Link>
                <Badge tone={job.status === "aberto" ? "success" : job.status === "cancelado" ? "danger" : "neutral"}>
                  {job.status}
                </Badge>
                {job.approval_status === "pendente" && <Badge tone="warning">Pendente de aprovação</Badge>}
                {job.approval_status === "rejeitado" && <Badge tone="danger">Rejeitado</Badge>}
              </div>
              <p className="mt-1 text-xs text-ink-faint">
                {job.client_name} · {job.remote ? "Remoto" : job.city ?? "—"} · {job.category} · {job.applications_count}{" "}
                candidatura{job.applications_count === 1 ? "" : "s"} · {formatDate(job.created_at)}
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              {job.approval_status === "pendente" ? (
                <ApproveJobButtons jobId={job.id} clientId={job.client_id} jobTitle={job.title} />
              ) : (
                <>
                  <Link href={`/trabalhos/${job.id}`}>
                    <button className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-ink-soft hover:border-navy-700">
                      Ver
                    </button>
                  </Link>
                  <CloseJobButton jobId={job.id} disabled={job.status === "cancelado"} />
                </>
              )}
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-ink-faint">Nenhum trabalho encontrado.</p>
        )}
      </div>
    </div>
  );
}

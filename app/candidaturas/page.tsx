import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { jobs } from "@/data/mock";
import type { ApplicationStatus } from "@/types";

export const metadata = { title: "As tuas candidaturas" };

const mockApplications: { id: string; jobId: string; status: ApplicationStatus; createdAt: string }[] = [
  { id: "app-1", jobId: jobs[0].id, status: "pendente", createdAt: "2026-08-09T10:00:00.000Z" },
  { id: "app-2", jobId: jobs[2].id, status: "aceite", createdAt: "2026-08-05T10:00:00.000Z" },
  { id: "app-3", jobId: jobs[4].id, status: "recusada", createdAt: "2026-08-02T10:00:00.000Z" },
];

const statusTone: Record<ApplicationStatus, "warning" | "success" | "danger" | "neutral"> = {
  pendente: "warning",
  aceite: "success",
  recusada: "danger",
  retirada: "neutral",
};

const statusLabel: Record<ApplicationStatus, string> = {
  pendente: "Pendente",
  aceite: "Aceite",
  recusada: "Recusada",
  retirada: "Retirada",
};

export default function CandidaturasPage() {
  return (
    <div className="container-kazigo py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">As tuas candidaturas</h1>
        <p className="mt-1 text-sm text-ink-faint">Acompanha o estado de todas as tuas candidaturas.</p>
      </div>

      {mockApplications.length === 0 ? (
        <EmptyState title="Ainda não te candidataste a nenhum trabalho" description="Explora os trabalhos disponíveis e envia a tua primeira candidatura." />
      ) : (
        <div className="flex flex-col gap-3">
          {mockApplications.map((app) => {
            const job = jobs.find((j) => j.id === app.jobId);
            if (!job) return null;
            return (
              <Card key={app.id} className="flex items-center justify-between gap-4 p-5">
                <Link href={`/trabalhos/${job.id}`} className="flex-1">
                  <p className="text-sm font-semibold text-ink hover:text-navy-700">{job.title}</p>
                  <p className="text-xs text-ink-faint">{job.clientName} · {job.location.city}</p>
                </Link>
                <Badge tone={statusTone[app.status]}>{statusLabel[app.status]}</Badge>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

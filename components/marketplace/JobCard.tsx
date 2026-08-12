import Link from "next/link";
import { Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BudgetDisplay, LocationBadge, JobStatusBadge } from "@/components/marketplace/atoms";
import { formatRelativeTime } from "@/lib/utils";
import type { Job } from "@/types";

const jobTypeLabel: Record<Job["type"], string> = {
  remoto: "Remoto",
  presencial: "Presencial",
  hibrido: "Híbrido",
};

export function JobCard({ job }: { job: Job }) {
  return (
    <Card className="group flex flex-col gap-3 p-5 hover:border-teal-500/60 hover:shadow-elevated">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <Link
            href={`/trabalhos/${job.id}`}
            className="text-base font-semibold text-ink group-hover:text-navy-700"
          >
            {job.title}
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <LocationBadge location={job.location} />
            <span className="text-ink-faint" aria-hidden="true">·</span>
            <span className="text-sm text-ink-faint">{jobTypeLabel[job.type]}</span>
          </div>
        </div>
        {job.featured && <Badge tone="orange">Destaque</Badge>}
      </div>

      <p className="line-clamp-2 text-sm text-ink-soft">{job.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {job.skillsRequired.slice(0, 3).map((skill) => (
          <Badge key={skill} tone="navy">
            {skill}
          </Badge>
        ))}
      </div>

      <div className="mt-1 flex items-center justify-between border-t border-border pt-3">
        <BudgetDisplay budget={job.budget} />
        <div className="flex items-center gap-3 text-xs text-ink-faint">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            {job.applicantsCount}
          </span>
          <span>{formatRelativeTime(job.createdAt)}</span>
        </div>
      </div>
    </Card>
  );
}

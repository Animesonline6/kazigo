import { notFound } from "next/navigation";
import { Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { BudgetDisplay, JobStatusBadge, LocationBadge } from "@/components/marketplace/atoms";
import { formatRelativeTime } from "@/lib/utils";
import { jobs, categories } from "@/data/mock";

export function generateStaticParams() {
  return jobs.map((job) => ({ id: job.id }));
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const job = jobs.find((j) => j.id === params.id);
  if (!job) notFound();

  const category = categories.find((c) => c.id === job.categoryId);

  return (
    <div className="container-kazigo grid gap-8 py-10 sm:py-14 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <JobStatusBadge status={job.status} />
            {category && <Badge tone="navy">{category.name}</Badge>}
            {job.featured && <Badge tone="orange">Destaque</Badge>}
          </div>
          <h1 className="text-2xl font-bold sm:text-3xl">{job.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-ink-faint">
            <LocationBadge location={job.location} />
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> Publicado {formatRelativeTime(job.createdAt)}
            </span>
          </div>
        </div>

        <Card className="p-6">
          <h2 className="mb-3 text-lg font-semibold">Descrição do trabalho</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink-soft">{job.description}</p>

          <Divider className="my-5" />

          <h3 className="mb-2 text-sm font-semibold text-ink">Competências necessárias</h3>
          <div className="flex flex-wrap gap-1.5">
            {job.skillsRequired.map((skill) => (
              <Badge key={skill} tone="teal">
                {skill}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      <aside className="flex h-fit flex-col gap-4">
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Orçamento</p>
          <div className="mt-1 text-xl">
            <BudgetDisplay budget={job.budget} />
          </div>
          <Divider className="my-4" />
          <dl className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-faint">Cliente</dt>
              <dd className="font-medium text-ink">{job.clientName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-faint">Candidaturas</dt>
              <dd className="font-medium text-ink">{job.applicantsCount}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="flex items-center gap-1 text-ink-faint">
                <MapPin className="h-3.5 w-3.5" /> Localização
              </dt>
              <dd className="font-medium text-ink">{job.location.city}</dd>
            </div>
          </dl>
          <Button fullWidth className="mt-5">
            Candidatar-me
          </Button>
        </Card>
      </aside>
    </div>
  );
}

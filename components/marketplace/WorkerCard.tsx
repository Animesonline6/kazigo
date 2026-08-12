import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { RatingStars, LocationBadge } from "@/components/marketplace/atoms";
import { formatCurrency } from "@/lib/utils";
import type { WorkerProfile } from "@/types";

const availabilityConfig = {
  available: { label: "Disponível", tone: "success" as const },
  busy: { label: "Ocupado", tone: "warning" as const },
  unavailable: { label: "Indisponível", tone: "neutral" as const },
};

export function WorkerCard({ worker }: { worker: WorkerProfile }) {
  const availability = availabilityConfig[worker.availability];

  return (
    <Card className="flex flex-col gap-4 p-5 hover:border-teal-500/60 hover:shadow-elevated">
      <div className="flex items-start gap-3">
        <Avatar name={worker.name} src={worker.avatarUrl} size="lg" />
        <div className="flex flex-1 flex-col gap-0.5">
          <Link href={`/perfil?id=${worker.id}`} className="flex items-center gap-1.5 font-semibold text-ink">
            {worker.name}
            {worker.verified && <BadgeCheck className="h-4 w-4 text-teal-500" aria-label="Verificado" />}
          </Link>
          <p className="text-sm text-ink-soft">{worker.headline}</p>
          <LocationBadge location={worker.location} />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {worker.skills.slice(0, 3).map((skill) => (
          <Badge key={skill} tone="teal">
            {skill}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <RatingStars rating={worker.rating} reviewsCount={worker.reviewsCount} />
        {worker.hourlyRate && (
          <span className="text-sm font-semibold text-navy-700">
            {formatCurrency(worker.hourlyRate)}/h
          </span>
        )}
      </div>

      <Badge tone={availability.tone} className="w-fit">
        {availability.label}
      </Badge>
    </Card>
  );
}

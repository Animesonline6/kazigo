import { Star, MapPin, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import type { JobBudget, JobStatus, Location } from "@/types";
import { cn } from "@/lib/utils";

// ---------- RatingStars ----------

export function RatingStars({ rating, reviewsCount, size = "sm" }: { rating: number; reviewsCount?: number; size?: "sm" | "md" }) {
  const starSize = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Avaliação ${rating} de 5`}>
      <Star className={cn(starSize, "fill-orange-500 text-orange-500")} aria-hidden="true" />
      <span className="text-sm font-semibold text-ink">{rating.toFixed(1)}</span>
      {typeof reviewsCount === "number" && (
        <span className="text-sm text-ink-faint">({reviewsCount})</span>
      )}
    </span>
  );
}

// ---------- BudgetDisplay ----------

export function BudgetDisplay({ budget }: { budget: JobBudget }) {
  const suffix = budget.type === "por_hora" ? "/hora" : "";
  const range =
    budget.max && budget.max !== budget.min
      ? `${formatCurrency(budget.min, budget.currency)} – ${formatCurrency(budget.max, budget.currency)}`
      : formatCurrency(budget.min, budget.currency);
  return (
    <span className="text-sm font-semibold text-navy-700">
      {range}
      {suffix}
    </span>
  );
}

// ---------- LocationBadge ----------

export function LocationBadge({ location }: { location: Location }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm text-ink-faint">
      {location.remote ? <Wifi className="h-3.5 w-3.5" aria-hidden="true" /> : <MapPin className="h-3.5 w-3.5" aria-hidden="true" />}
      {location.remote ? "Remoto" : `${location.city}${location.province ? `, ${location.province}` : ""}`}
    </span>
  );
}

// ---------- JobStatusBadge ----------

const statusConfig: Record<JobStatus, { label: string; tone: "success" | "warning" | "neutral" | "danger" | "teal" }> = {
  aberto: { label: "Aberto", tone: "success" },
  em_andamento: { label: "Em andamento", tone: "teal" },
  concluido: { label: "Concluído", tone: "neutral" },
  cancelado: { label: "Cancelado", tone: "danger" },
  pausado: { label: "Pausado", tone: "warning" },
};

export function JobStatusBadge({ status }: { status: JobStatus }) {
  const config = statusConfig[status];
  return <Badge tone={config.tone}>{config.label}</Badge>;
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MapPin, Wifi } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/client";

export interface FavoriteJob {
  id: string;
  title: string;
  category: string;
  city: string | null;
  remote: boolean;
  budget_min: number | null;
  budget_max: number | null;
}

function formatBudget(min: number | null, max: number | null) {
  if (!min && !max) return "A combinar";
  const fmt = (n: number) => `${n.toLocaleString("pt-PT")} MTn`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  return fmt((min ?? max) as number);
}

export function FavoriteJobCard({
  job,
  userId,
  onRemoved,
}: {
  job: FavoriteJob;
  userId: string;
  onRemoved: (jobId: string) => void;
}) {
  const supabase = createClient();
  const [removing, setRemoving] = useState(false);

  async function handleRemove() {
    if (removing) return;
    setRemoving(true);
    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("job_id", job.id);
      if (error) throw error;
      onRemoved(job.id);
    } catch {
      setRemoving(false);
    }
  }

  return (
    <Card className="flex flex-col gap-3 p-4 hover:border-teal-500/60">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/trabalhos/${job.id}`} className="text-sm font-semibold text-ink hover:text-navy-700">
          {job.title}
        </Link>
        <button
          type="button"
          onClick={handleRemove}
          disabled={removing}
          aria-label="Remover dos favoritos"
          className="shrink-0 text-orange-500 hover:text-orange-600 disabled:opacity-50"
        >
          <Heart className="h-4.5 w-4.5 fill-orange-500" aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-faint">
        {job.remote ? (
          <span className="inline-flex items-center gap-1">
            <Wifi className="h-3.5 w-3.5" aria-hidden="true" />
            Remoto
          </span>
        ) : job.city ? (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {job.city}
          </span>
        ) : null}
        <span aria-hidden="true">·</span>
        <Badge tone="navy">{job.category}</Badge>
      </div>

      <div className="border-t border-border pt-3">
        <span className="text-sm font-semibold text-ink">
          {formatBudget(job.budget_min, job.budget_max)}
        </span>
      </div>
    </Card>
  );
}

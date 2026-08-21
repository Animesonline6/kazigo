"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MapPin, Wifi } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export interface RecommendedJob {
  id: string;
  title: string;
  category: string;
  city: string | null;
  remote: boolean;
  budget_min: number | null;
  budget_max: number | null;
  created_at: string;
}

function formatBudget(min: number | null, max: number | null) {
  if (!min && !max) return "A combinar";
  const fmt = (n: number) => `${n.toLocaleString("pt-PT")} MTn`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  return fmt((min ?? max) as number);
}

function formatRelative(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "hoje";
  if (days === 1) return "há 1 dia";
  return `há ${days} dias`;
}

export function RecommendedJobCard({
  job,
  userId,
  initiallyFavorited,
}: {
  job: RecommendedJob;
  userId: string;
  initiallyFavorited: boolean;
}) {
  const supabase = createClient();
  const [favorited, setFavorited] = useState(initiallyFavorited);
  const [saving, setSaving] = useState(false);

  async function toggleFavorite() {
    if (saving) return;
    setSaving(true);
    const next = !favorited;
    setFavorited(next); // otimista

    try {
      if (next) {
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: userId, job_id: job.id });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", userId)
          .eq("job_id", job.id);
        if (error) throw error;
      }
    } catch {
      setFavorited(!next); // reverte em caso de erro
    } finally {
      setSaving(false);
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
          onClick={toggleFavorite}
          disabled={saving}
          aria-label={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          aria-pressed={favorited}
          className="shrink-0 text-ink-faint hover:text-orange-500 disabled:opacity-50"
        >
          <Heart className={cn("h-4.5 w-4.5", favorited && "fill-orange-500 text-orange-500")} aria-hidden="true" />
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

      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="text-sm font-semibold text-ink">
          {formatBudget(job.budget_min, job.budget_max)}
        </span>
        <span className="text-xs text-ink-faint">{formatRelative(job.created_at)}</span>
      </div>
    </Card>
  );
}

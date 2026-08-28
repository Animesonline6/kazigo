"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Heart } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { createClient } from "@/lib/supabase/client";

export interface FavoriteWorker {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  city: string | null;
  headline: string | null;
  rating: number;
  reviews_count: number;
}

export function FavoriteWorkerCard({
  worker,
  userId,
  onRemoved,
}: {
  worker: FavoriteWorker;
  userId: string;
  onRemoved: (workerId: string) => void;
}) {
  const supabase = createClient();
  const [removing, setRemoving] = useState(false);

  async function handleRemove() {
    if (removing) return;
    setRemoving(true);
    try {
      const { error } = await supabase
        .from("worker_favorites")
        .delete()
        .eq("user_id", userId)
        .eq("worker_id", worker.id);
      if (error) throw error;
      onRemoved(worker.id);
    } catch {
      setRemoving(false);
    }
  }

  return (
    <Card className="flex items-center gap-3 p-4">
      <Link href={`/trabalhadores/${worker.id}`}>
        <Avatar name={worker.full_name || "Trabalhador"} src={worker.avatar_url ?? undefined} size="md" />
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={`/trabalhadores/${worker.id}`} className="text-sm font-semibold text-ink hover:text-navy-700">
          {worker.full_name || "Trabalhador"}
        </Link>
        {worker.headline && <p className="truncate text-xs text-ink-faint">{worker.headline}</p>}
        <div className="mt-0.5 flex items-center gap-2 text-xs text-ink-faint">
          {worker.city && <span>{worker.city}</span>}
          {worker.reviews_count > 0 && (
            <span className="inline-flex items-center gap-1">
              <Star className="h-3 w-3 fill-orange-500 text-orange-500" aria-hidden="true" />
              {worker.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={handleRemove}
        disabled={removing}
        aria-label="Remover dos favoritos"
        className="shrink-0 text-orange-500 hover:text-orange-600 disabled:opacity-50"
      >
        <Heart className="h-4.5 w-4.5 fill-orange-500" aria-hidden="true" />
      </button>
    </Card>
  );
}

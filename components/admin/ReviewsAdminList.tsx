"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export interface AdminReview {
  id: string;
  rating: number;
  comment: string | null;
  author_name: string;
  reviewed_name: string;
  job_title: string;
  created_at: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" });
}

export function ReviewsAdminList({ reviews }: { reviews: AdminReview[] }) {
  const supabase = createClient();
  const router = useRouter();
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [removingId, setRemovingId] = useState<string | null>(null);

  const filtered = useMemo(
    () => reviews.filter((r) => ratingFilter === "all" || r.rating === ratingFilter),
    [reviews, ratingFilter]
  );

  async function handleRemove(id: string) {
    if (!window.confirm("Remover esta avaliação? Esta ação não pode ser desfeita.")) return;
    setRemovingId(id);
    try {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
      router.refresh();
    } catch {
      window.alert("Não foi possível remover a avaliação.");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setRatingFilter("all")}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            ratingFilter === "all" ? "border-navy-700 bg-navy-700 text-white" : "border-border text-ink-soft"
          )}
        >
          Todas
        </button>
        {[5, 4, 3, 2, 1].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRatingFilter(n)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              ratingFilter === n ? "border-navy-700 bg-navy-700 text-white" : "border-border text-ink-soft"
            )}
          >
            {n} ★
          </button>
        ))}
      </div>

      <p className="text-xs text-ink-faint">
        {filtered.length} avaliaç{filtered.length === 1 ? "ão" : "ões"}
      </p>

      <div className="flex flex-col gap-3">
        {filtered.map((r) => (
          <Card key={r.id} className="flex flex-col gap-2 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} className={cn("h-4 w-4", n <= r.rating ? "fill-orange-500 text-orange-500" : "text-border")} aria-hidden="true" />
                ))}
              </div>
              <Button size="sm" variant="danger" onClick={() => handleRemove(r.id)} disabled={removingId === r.id}>
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                {removingId === r.id ? "A remover..." : "Remover"}
              </Button>
            </div>
            <p className="text-xs text-ink-faint">
              {r.author_name} avaliou {r.reviewed_name} · trabalho: {r.job_title} · {formatDate(r.created_at)}
            </p>
            {r.comment && <p className="text-sm text-ink-soft">{r.comment}</p>}
          </Card>
        ))}

        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-ink-faint">Nenhuma avaliação encontrada.</p>
        )}
      </div>
    </div>
  );
}

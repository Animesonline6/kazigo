"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  jobId,
  userId,
  initiallyFavorited,
  className,
}: {
  jobId: string;
  userId: string | null;
  initiallyFavorited: boolean;
  className?: string;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [favorited, setFavorited] = useState(initiallyFavorited);
  const [saving, setSaving] = useState(false);

  async function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      router.push(`/login?redirectTo=/trabalhos/${jobId}`);
      return;
    }

    if (saving) return;
    setSaving(true);
    const next = !favorited;
    setFavorited(next); // otimista

    try {
      if (next) {
        const { error } = await supabase.from("favorites").insert({ user_id: userId, job_id: jobId });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", userId)
          .eq("job_id", jobId);
        if (error) throw error;
      }
    } catch {
      setFavorited(!next); // reverte em caso de erro
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      disabled={saving}
      aria-label={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      aria-pressed={favorited}
      className={cn("text-ink-faint hover:text-orange-500 disabled:opacity-50", className)}
    >
      <Heart className={cn("h-4.5 w-4.5", favorited && "fill-orange-500 text-orange-500")} aria-hidden="true" />
    </button>
  );
}

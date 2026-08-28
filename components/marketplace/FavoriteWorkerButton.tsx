"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export function FavoriteWorkerButton({
  workerId,
  userId,
  initiallyFavorited,
}: {
  workerId: string;
  userId: string | null;
  initiallyFavorited: boolean;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [favorited, setFavorited] = useState(initiallyFavorited);
  const [saving, setSaving] = useState(false);

  async function toggle() {
    if (!userId) {
      router.push("/login");
      return;
    }
    if (saving) return;
    setSaving(true);
    const next = !favorited;
    setFavorited(next);

    try {
      if (next) {
        const { error } = await supabase.from("worker_favorites").insert({ user_id: userId, worker_id: workerId });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("worker_favorites")
          .delete()
          .eq("user_id", userId)
          .eq("worker_id", workerId);
        if (error) throw error;
      }
    } catch {
      setFavorited(!next);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Button variant={favorited ? "primary" : "outline"} size="sm" onClick={toggle} disabled={saving}>
      <Heart className={favorited ? "h-4 w-4 fill-white" : "h-4 w-4"} aria-hidden="true" />
      {favorited ? "Favoritado" : "Favoritar"}
    </Button>
  );
}

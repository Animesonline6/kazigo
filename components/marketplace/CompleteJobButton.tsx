"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export function CompleteJobButton({ jobId }: { jobId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleComplete() {
    if (loading) return;
    if (!window.confirm("Marcar este trabalho como concluído? Isto permite que tu e o trabalhador se avaliem mutuamente.")) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("jobs").update({ status: "concluido" }).eq("id", jobId);
      if (error) throw error;
      router.refresh();
    } catch {
      window.alert("Não foi possível concluir o trabalho. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button size="sm" onClick={handleComplete} disabled={loading}>
      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
      {loading ? "A concluir..." : "Marcar como concluído"}
    </Button>
  );
}

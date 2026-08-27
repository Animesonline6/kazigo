"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { createNotification } from "@/lib/notifications/create";

export function ApproveJobButtons({ jobId, clientId, jobTitle }: { jobId: string; clientId: string; jobTitle: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState<"aprovar" | "rejeitar" | null>(null);

  async function handleDecision(decision: "aprovado" | "rejeitado") {
    setLoading(decision === "aprovado" ? "aprovar" : "rejeitar");
    try {
      const { error } = await supabase.from("jobs").update({ approval_status: decision }).eq("id", jobId);
      if (error) throw error;

      createNotification(supabase, {
        userId: clientId,
        type: "sistema",
        title: decision === "aprovado" ? "Trabalho aprovado" : "Trabalho rejeitado",
        description:
          decision === "aprovado"
            ? `O teu trabalho "${jobTitle}" já está visível ao público.`
            : `O teu trabalho "${jobTitle}" não foi aprovado para publicação.`,
        relatedJobId: jobId,
      });

      router.refresh();
    } catch {
      window.alert("Não foi possível concluir a ação.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" onClick={() => handleDecision("aprovado")} disabled={loading !== null}>
        <Check className="h-4 w-4" aria-hidden="true" />
        {loading === "aprovar" ? "A aprovar..." : "Aprovar"}
      </Button>
      <Button size="sm" variant="outline" onClick={() => handleDecision("rejeitado")} disabled={loading !== null}>
        <X className="h-4 w-4" aria-hidden="true" />
        {loading === "rejeitar" ? "A rejeitar..." : "Rejeitar"}
      </Button>
    </div>
  );
}

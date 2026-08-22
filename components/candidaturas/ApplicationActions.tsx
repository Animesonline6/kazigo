"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export function ClientApplicationActions({ applicationId, jobId }: { applicationId: string; jobId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState<"aceitar" | "recusar" | null>(null);

  async function handleAceitar() {
    if (loading) return;
    setLoading("aceitar");
    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ status: "aceite" })
        .eq("id", applicationId);
      if (error) throw error;

      // Marca o trabalho como "em andamento"
      await supabase.from("jobs").update({ status: "em_andamento" }).eq("id", jobId);

      // Email é best-effort — não bloqueia a ação em si
      fetch("/api/notify/candidatura-aceite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId }),
      }).catch(() => {});

      router.refresh();
    } catch {
      // silenciosamente ignorado; o utilizador pode tentar novamente
    } finally {
      setLoading(null);
    }
  }

  async function handleRecusar() {
    if (loading) return;
    setLoading("recusar");
    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ status: "recusada" })
        .eq("id", applicationId);
      if (error) throw error;
      router.refresh();
    } catch {
      // silenciosamente ignorado
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" onClick={handleAceitar} disabled={loading !== null}>
        <Check className="h-4 w-4" aria-hidden="true" />
        {loading === "aceitar" ? "A aceitar..." : "Aceitar"}
      </Button>
      <Button size="sm" variant="outline" onClick={handleRecusar} disabled={loading !== null}>
        <X className="h-4 w-4" aria-hidden="true" />
        {loading === "recusar" ? "A recusar..." : "Recusar"}
      </Button>
    </div>
  );
}

export function WorkerApplicationWithdraw({ applicationId }: { applicationId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleWithdraw() {
    if (loading) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ status: "retirada" })
        .eq("id", applicationId);
      if (error) throw error;
      router.refresh();
    } catch {
      // silenciosamente ignorado
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleWithdraw}
      disabled={loading}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-faint hover:text-danger disabled:opacity-50"
    >
      <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
      {loading ? "A retirar..." : "Retirar candidatura"}
    </button>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Ban } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export function ReportActions({
  reportId,
  reportedUserId,
}: {
  reportId: string;
  reportedUserId: string | null;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function updateStatus(status: "resolvida" | "rejeitada" | "em_analise") {
    setLoading(status);
    try {
      const { error } = await supabase.from("reports").update({ status }).eq("id", reportId);
      if (error) throw error;
      router.refresh();
    } catch {
      window.alert("Não foi possível atualizar a denúncia.");
    } finally {
      setLoading(null);
    }
  }

  async function suspendUser() {
    if (!reportedUserId) return;
    if (!window.confirm("Suspender a conta denunciada? A pessoa fica impedida de entrar no site.")) return;

    setLoading("suspender");
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_suspended: true, suspended_at: new Date().toISOString() })
        .eq("id", reportedUserId);
      if (error) throw error;
      await supabase.from("reports").update({ status: "resolvida" }).eq("id", reportId);
      router.refresh();
    } catch {
      window.alert("Não foi possível suspender a conta.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" onClick={() => updateStatus("em_analise")} disabled={loading !== null} variant="outline">
        Em análise
      </Button>
      <Button size="sm" onClick={() => updateStatus("resolvida")} disabled={loading !== null}>
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        Resolver
      </Button>
      <Button size="sm" variant="outline" onClick={() => updateStatus("rejeitada")} disabled={loading !== null}>
        <XCircle className="h-4 w-4" aria-hidden="true" />
        Rejeitar
      </Button>
      {reportedUserId && (
        <Button size="sm" variant="danger" onClick={suspendUser} disabled={loading !== null}>
          <Ban className="h-4 w-4" aria-hidden="true" />
          Suspender conta
        </Button>
      )}
    </div>
  );
}

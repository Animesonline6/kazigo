"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ban } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export function CloseJobButton({ jobId, disabled }: { jobId: string; disabled?: boolean }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClose() {
    if (loading) return;
    if (!window.confirm("Encerrar este trabalho? Fica marcado como cancelado e deixa de aceitar candidaturas.")) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("jobs").update({ status: "cancelado" }).eq("id", jobId);
      if (error) throw error;
      router.refresh();
    } catch {
      window.alert("Não foi possível encerrar o trabalho. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (disabled) return null;

  return (
    <Button size="sm" variant="danger" onClick={handleClose} disabled={loading}>
      <Ban className="h-4 w-4" aria-hidden="true" />
      {loading ? "A encerrar..." : "Encerrar"}
    </Button>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export function DeleteJobButton({ jobId }: { jobId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (loading) return;
    if (!window.confirm("Apagar este trabalho? Esta ação não pode ser desfeita e remove também as candidaturas associadas.")) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("jobs").delete().eq("id", jobId);
      if (error) throw error;
      router.push("/dashboard");
      router.refresh();
    } catch {
      window.alert("Não foi possível apagar o trabalho. Tenta novamente.");
      setLoading(false);
    }
  }

  return (
    <Button variant="danger" size="sm" onClick={handleDelete} disabled={loading}>
      <Trash2 className="h-4 w-4" aria-hidden="true" />
      {loading ? "A apagar..." : "Apagar"}
    </Button>
  );
}

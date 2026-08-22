"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ban, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export function SuspendUserButton({
  userId,
  isSuspended,
  disabled,
}: {
  userId: string;
  isSuspended: boolean;
  disabled?: boolean;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (loading) return;

    const confirmMessage = isSuspended
      ? "Reativar esta conta? A pessoa volta a conseguir entrar normalmente."
      : "Suspender esta conta? A pessoa deixa de conseguir entrar no site.";

    if (!window.confirm(confirmMessage)) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          is_suspended: !isSuspended,
          suspended_at: !isSuspended ? new Date().toISOString() : null,
        })
        .eq("id", userId);

      if (error) throw error;
      router.refresh();
    } catch {
      window.alert("Não foi possível concluir a ação. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (disabled) return null;

  return (
    <Button
      size="sm"
      variant={isSuspended ? "outline" : "danger"}
      onClick={handleToggle}
      disabled={loading}
    >
      {isSuspended ? <RotateCcw className="h-4 w-4" aria-hidden="true" /> : <Ban className="h-4 w-4" aria-hidden="true" />}
      {loading ? "A processar..." : isSuspended ? "Reativar" : "Suspender"}
    </Button>
  );
}

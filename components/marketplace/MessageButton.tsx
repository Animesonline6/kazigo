"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { getOrCreateConversation } from "@/lib/messages/getOrCreateConversation";

export function MessageButton({
  otherUserId,
  jobId,
  isLoggedIn,
  label = "Enviar mensagem",
  variant = "outline",
  size = "sm",
}: {
  otherUserId: string;
  jobId?: string;
  isLoggedIn: boolean;
  label?: string;
  variant?: "outline" | "primary" | "ghost";
  size?: "sm" | "md";
}) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      setLoading(false);
      return;
    }

    const result = await getOrCreateConversation(supabase, user.id, otherUserId, jobId);

    setLoading(false);

    if ("error" in result) {
      window.alert(result.error);
      return;
    }

    router.push(`/mensagens?c=${result.id}`);
  }

  return (
    <Button variant={variant} size={size} onClick={handleClick} disabled={loading}>
      <MessageSquare className="h-4 w-4" aria-hidden="true" />
      {loading ? "A abrir..." : label}
    </Button>
  );
}

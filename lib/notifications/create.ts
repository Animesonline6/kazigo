import type { SupabaseClient } from "@supabase/supabase-js";

export type NotificationType = "candidatura" | "mensagem" | "pagamento" | "avaliacao" | "sistema";

/**
 * Cria uma notificação para outro utilizador. Falha silenciosamente
 * (best-effort) — nunca deve bloquear a ação principal que a
 * despoletou (candidatar-se, aceitar, avaliar, etc.).
 */
export async function createNotification(
  supabase: SupabaseClient,
  params: {
    userId: string;
    type: NotificationType;
    title: string;
    description?: string;
    relatedJobId?: string;
  }
) {
  try {
    await supabase.from("notifications").insert({
      user_id: params.userId,
      type: params.type,
      title: params.title,
      description: params.description ?? null,
      related_job_id: params.relatedJobId ?? null,
    });
  } catch {
    // silenciosamente ignorado
  }
}

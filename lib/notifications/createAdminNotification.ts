import type { SupabaseClient } from "@supabase/supabase-js";

export type AdminNotificationType = "novo_utilizador" | "novo_trabalho" | "nova_denuncia" | "sistema";

/**
 * Cria uma notificação para os administradores. Best-effort: nunca
 * deve bloquear a ação principal que a despoletou.
 */
export async function createAdminNotification(
  supabase: SupabaseClient,
  params: { type: AdminNotificationType; title: string; description?: string; relatedId?: string }
) {
  try {
    await supabase.from("admin_notifications").insert({
      type: params.type,
      title: params.title,
      description: params.description ?? null,
      related_id: params.relatedId ?? null,
    });
  } catch {
    // silenciosamente ignorado
  }
}

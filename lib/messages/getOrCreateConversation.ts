import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Devolve o id de uma conversa entre dois utilizadores, criando-a
 * se ainda não existir. A ordem (user_a, user_b) é sempre a mesma
 * (ordenada), para nunca criar duas conversas duplicadas para o
 * mesmo par de pessoas.
 */
export async function getOrCreateConversation(
  supabase: SupabaseClient,
  meId: string,
  otherId: string,
  jobId?: string
): Promise<{ id: string } | { error: string }> {
  const [userA, userB] = [meId, otherId].sort();

  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("user_a", userA)
    .eq("user_b", userB)
    .maybeSingle();

  if (existing) return { id: existing.id };

  const { data: created, error } = await supabase
    .from("conversations")
    .insert({ user_a: userA, user_b: userB, job_id: jobId ?? null })
    .select("id")
    .single();

  if (error || !created) return { error: "Não foi possível iniciar a conversa." };

  return { id: created.id };
}

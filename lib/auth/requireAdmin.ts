import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Confirma que o utilizador atual tem sessão iniciada E é admin.
 * Usa isto no topo de qualquer página dentro de app/admin/.
 * O middleware já bloqueia o acesso, mas esta verificação extra
 * dentro da própria página evita depender só de uma camada.
 */
export async function requireAdmin() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectTo=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/");
  }

  return { supabase, user, profile };
}

import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditJobForm } from "./EditJobForm";

export const metadata = { title: "Editar trabalho" };
export const dynamic = "force-dynamic";

export default async function EditarTrabalhoPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/login?redirectTo=/trabalhos/${params.id}/editar`);

  const { data: job } = await supabase
    .from("jobs")
    .select("id, title, description, category, city, remote, budget_min, budget_max, client_id")
    .eq("id", params.id)
    .single();

  if (!job) notFound();

  // Só o dono do trabalho pode editar — outros são redirecionados
  // de volta para a página pública do trabalho.
  if (job.client_id !== user.id) redirect(`/trabalhos/${params.id}`);

  return (
    <div className="container-kazigo max-w-2xl py-10 sm:py-14">
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Editar trabalho</h1>
        <p className="mt-1 text-sm text-ink-faint">Atualiza os detalhes do teu trabalho publicado.</p>
      </div>

      <EditJobForm job={job} />
    </div>
  );
}

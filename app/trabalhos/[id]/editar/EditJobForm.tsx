"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextInput, TextArea, Select, Checkbox } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { createClient } from "@/lib/supabase/client";

export interface EditableJob {
  id: string;
  title: string;
  description: string;
  category: string;
  city: string | null;
  remote: boolean;
  budget_min: number | null;
  budget_max: number | null;
}

export function EditJobForm({ job }: { job: EditableJob }) {
  const router = useRouter();
  const supabase = createClient();

  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);
  const [title, setTitle] = useState(job.title);
  const [description, setDescription] = useState(job.description);
  const [category, setCategory] = useState(job.category);
  const [city, setCity] = useState(job.city || "");
  const [remote, setRemote] = useState(job.remote);
  const [budgetMin, setBudgetMin] = useState(job.budget_min?.toString() || "");
  const [budgetMax, setBudgetMax] = useState(job.budget_max?.toString() || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    supabase
      .from("categories")
      .select("name")
      .eq("active", true)
      .order("name")
      .then(({ data }) => {
        const options = (data ?? []).map((c) => ({ value: c.name, label: c.name }));
        // Garante que a categoria atual do trabalho aparece mesmo que
        // tenha sido entretanto desativada, para não perder o valor.
        if (job.category && !options.some((o) => o.value === job.category)) {
          options.unshift({ value: job.category, label: `${job.category} (inativa)` });
        }
        setCategoryOptions(options);
      });
  }, [supabase, job.category]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);

    try {
      const { error: updateError } = await supabase
        .from("jobs")
        .update({
          title,
          description,
          category,
          city: city || null,
          remote,
          budget_min: budgetMin ? Number(budgetMin) : null,
          budget_max: budgetMax ? Number(budgetMax) : null,
        })
        .eq("id", job.id);

      if (updateError) throw updateError;

      setSuccess(true);
      router.refresh();
      setTimeout(() => router.push(`/trabalhos/${job.id}`), 900);
    } catch (err: any) {
      setError(err.message || "Não foi possível guardar as alterações. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6 sm:p-8">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {error && (
          <Alert tone="danger" title="Não foi possível guardar">
            {error}
          </Alert>
        )}
        {success && (
          <Alert tone="success" title="Alterações guardadas">
            A voltar ao trabalho...
          </Alert>
        )}

        <TextInput label="Título" required value={title} onChange={(e) => setTitle(e.target.value)} />

        <TextArea
          label="Descrição"
          required
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Select
          label="Categoria"
          required
          options={categoryOptions}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <TextInput label="Orçamento mínimo (MTn)" type="number" min={0} value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} />
          <TextInput label="Orçamento máximo (MTn)" type="number" min={0} value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} />
        </div>

        <Checkbox label="Trabalho remoto" checked={remote} onChange={(e) => setRemote(e.target.checked)} />

        {!remote && <TextInput label="Cidade" value={city} onChange={(e) => setCity(e.target.value)} />}

        <Button type="submit" disabled={loading}>
          {loading ? "A guardar..." : "Guardar alterações"}
        </Button>
      </form>
    </Card>
  );
}

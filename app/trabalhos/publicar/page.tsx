"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextInput, TextArea, Select } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { createClient } from "@/lib/supabase/client";

const categoryOptions = [
  { value: "Construção & Reparações", label: "Construção & Reparações" },
  { value: "Design & Criação", label: "Design & Criação" },
  { value: "Tecnologia & Programação", label: "Tecnologia & Programação" },
  { value: "Transporte & Entregas", label: "Transporte & Entregas" },
  { value: "Educação & Explicações", label: "Educação & Explicações" },
  { value: "Beleza & Bem-estar", label: "Beleza & Bem-estar" },
  { value: "Eventos & Catering", label: "Eventos & Catering" },
  { value: "Limpeza & Doméstico", label: "Limpeza & Doméstico" },
];

export default function PublicarTrabalhoPage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [remote, setRemote] = useState(false);
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Precisas de iniciar sessão para publicar um trabalho.");
      return;
    }

    setLoading(true);

    const { data, error: insertError } = await supabase
      .from("jobs")
      .insert({
        client_id: user.id,
        title,
        description,
        category,
        city: city || null,
        remote,
        budget_min: budgetMin ? Number(budgetMin) : null,
        budget_max: budgetMax ? Number(budgetMax) : null,
      })
      .select("id")
      .single();

    setLoading(false);

    if (insertError || !data) {
      setError("Não foi possível publicar o trabalho. Tenta novamente.");
      return;
    }

    router.push(`/trabalhos/${data.id}`);
    router.refresh();
  }

  return (
    <div className="container-kazigo max-w-2xl py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Publicar trabalho</h1>
        <p className="mt-1 text-sm text-ink-faint">
          Descreve o que precisas e recebe candidaturas de profissionais qualificados.
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        {error && (
          <Alert tone="danger" title="Não foi possível publicar" className="mb-4">
            {error}
          </Alert>
        )}

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <TextInput
            label="Título do trabalho"
            placeholder="Ex: Instalação elétrica completa em moradia"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextArea
            label="Descrição"
            placeholder="Descreve o trabalho em detalhe: o que precisa de ser feito, prazos, requisitos..."
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Select
            label="Categoria"
            required
            options={categoryOptions}
            placeholder="Escolhe uma categoria"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Orçamento mínimo (MTn)"
              type="number"
              min={0}
              placeholder="Ex: 5000"
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
            />
            <TextInput
              label="Orçamento máximo (MTn)"
              type="number"
              min={0}
              placeholder="Ex: 15000"
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remote"
              checked={remote}
              onChange={(e) => setRemote(e.target.checked)}
              className="h-4 w-4 rounded border-border text-teal-600 focus:ring-teal-500"
            />
            <label htmlFor="remote" className="text-sm text-ink">
              Este trabalho pode ser feito remotamente
            </label>
          </div>

          {!remote && (
            <TextInput
              label="Cidade"
              placeholder="Ex: Maputo"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          )}

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "A publicar..." : "Publicar trabalho"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

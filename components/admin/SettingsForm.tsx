"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextInput, TextArea } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { createClient } from "@/lib/supabase/client";

export interface SettingsMap {
  nome_plataforma: string;
  descricao_plataforma: string;
  email_suporte: string;
  telefone_suporte: string;
  comissao_percentagem: string;
  regras_publicacao: string;
  regras_candidatura: string;
}

export function SettingsForm({ settings, adminId }: { settings: SettingsMap; adminId: string }) {
  const supabase = createClient();
  const router = useRouter();

  const [values, setValues] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function update<K extends keyof SettingsMap>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const rows = Object.entries(values).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
        updated_by: adminId,
      }));

      const { error: upsertError } = await supabase.from("platform_settings").upsert(rows, { onConflict: "key" });
      if (upsertError) throw upsertError;

      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Não foi possível guardar. Tenta novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      {error && (
        <Alert tone="danger" title="Não foi possível guardar">
          {error}
        </Alert>
      )}
      {success && (
        <Alert tone="success" title="Configurações guardadas com sucesso">
          As alterações já estão ativas na plataforma.
        </Alert>
      )}

      <Card className="p-6 sm:p-8">
        <h2 className="mb-4 text-base font-semibold">Informações da plataforma</h2>
        <div className="flex flex-col gap-4">
          <TextInput
            label="Nome da plataforma"
            value={values.nome_plataforma}
            onChange={(e) => update("nome_plataforma", e.target.value)}
          />
          <TextArea
            label="Descrição"
            rows={3}
            value={values.descricao_plataforma}
            onChange={(e) => update("descricao_plataforma", e.target.value)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              label="Email de suporte"
              type="email"
              value={values.email_suporte}
              onChange={(e) => update("email_suporte", e.target.value)}
            />
            <TextInput
              label="Telefone de suporte"
              value={values.telefone_suporte}
              onChange={(e) => update("telefone_suporte", e.target.value)}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <h2 className="mb-4 text-base font-semibold">Pagamentos</h2>
        <TextInput
          label="Comissão da plataforma (%)"
          type="number"
          min={0}
          max={100}
          value={values.comissao_percentagem}
          onChange={(e) => update("comissao_percentagem", e.target.value)}
        />
        <p className="mt-2 text-xs text-ink-faint">
          Este valor ainda não é aplicado automaticamente a pagamentos reais — a Fase 4 (pagamentos) ainda não
          está ligada a um gateway. Fica guardado aqui para quando estiver.
        </p>
      </Card>

      <Card className="p-6 sm:p-8">
        <h2 className="mb-4 text-base font-semibold">Regras</h2>
        <div className="flex flex-col gap-4">
          <TextArea
            label="Regras para publicação de trabalhos"
            rows={3}
            value={values.regras_publicacao}
            onChange={(e) => update("regras_publicacao", e.target.value)}
          />
          <TextArea
            label="Regras de candidaturas"
            rows={3}
            value={values.regras_candidatura}
            onChange={(e) => update("regras_candidatura", e.target.value)}
          />
        </div>
      </Card>

      <Button type="submit" disabled={saving}>
        {saving ? "A guardar..." : "Guardar configurações"}
      </Button>
    </form>
  );
}

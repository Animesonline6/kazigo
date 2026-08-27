"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flag } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Select, TextArea } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { createClient } from "@/lib/supabase/client";
import { createAdminNotification } from "@/lib/notifications/createAdminNotification";

const reasonOptions = [
  { value: "spam", label: "Spam ou conteúdo enganoso" },
  { value: "conteudo_inadequado", label: "Conteúdo inadequado" },
  { value: "fraude", label: "Suspeita de fraude" },
  { value: "assedio", label: "Assédio ou comportamento abusivo" },
  { value: "outro", label: "Outro motivo" },
];

export function ReportButton({
  targetType,
  reportedUserId,
  jobId,
  isLoggedIn,
  label = "Reportar",
}: {
  targetType: "user" | "job";
  reportedUserId?: string;
  jobId?: string;
  isLoggedIn: boolean;
  label?: string;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function handleOpen() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setDone(false);
    setError(null);
    setReason("");
    setDescription("");
    setOpen(true);
  }

  async function handleSubmit() {
    if (!reason) {
      setError("Escolhe um motivo.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sem sessão");

      const { error: insertError } = await supabase.from("reports").insert({
        reporter_id: user.id,
        target_type: targetType,
        reported_user_id: reportedUserId ?? null,
        job_id: jobId ?? null,
        reason: reasonOptions.find((r) => r.value === reason)?.label ?? reason,
        description: description || null,
      });

      if (insertError) throw insertError;

      createAdminNotification(supabase, {
        type: "nova_denuncia",
        title: "Nova denúncia recebida",
        description: reasonOptions.find((r) => r.value === reason)?.label ?? reason,
        relatedId: jobId,
      });

      setDone(true);
    } catch {
      setError("Não foi possível enviar a denúncia. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-faint hover:text-danger"
      >
        <Flag className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Reportar"
        footer={
          done ? (
            <Button onClick={() => setOpen(false)} fullWidth>
              Fechar
            </Button>
          ) : (
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "A enviar..." : "Enviar denúncia"}
              </Button>
            </div>
          )
        }
      >
        {done ? (
          <Alert tone="success" title="Denúncia enviada">
            A nossa equipa vai analisar isto. Obrigado por ajudares a manter a KaziGo segura.
          </Alert>
        ) : (
          <div className="flex flex-col gap-3">
            {error && (
              <Alert tone="danger" title="Erro">
                {error}
              </Alert>
            )}
            <Select label="Motivo" required options={reasonOptions} placeholder="Escolhe um motivo" value={reason} onChange={(e) => setReason(e.target.value)} />
            <TextArea
              label="Descrição (opcional)"
              rows={4}
              placeholder="Dá mais detalhes, se quiseres..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        )}
      </Modal>
    </>
  );
}

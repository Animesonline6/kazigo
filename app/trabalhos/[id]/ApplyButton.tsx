"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { createClient } from "@/lib/supabase/client";
import { createNotification } from "@/lib/notifications/create";

export function ApplyButton({
  jobId,
  jobTitle,
  clientId,
  alreadyApplied,
  isOwnJob,
  isLoggedIn,
}: {
  jobId: string;
  jobTitle: string;
  clientId: string;
  alreadyApplied: boolean;
  isOwnJob: boolean;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(alreadyApplied);

  if (isOwnJob) {
    return <p className="text-sm text-ink-faint">Este é o teu trabalho publicado.</p>;
  }

  if (!isLoggedIn) {
    return (
      <Button fullWidth onClick={() => router.push(`/login?redirectTo=/trabalhos/${jobId}`)}>
        Inicia sessão para te candidatares
      </Button>
    );
  }

  if (done) {
    return (
      <Alert tone="success" title="Candidatura enviada">
        A tua candidatura já foi enviada para este trabalho.
      </Alert>
    );
  }

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      setError("Sessão expirada. Inicia sessão de novo.");
      return;
    }

    const { error: insertError } = await supabase.from("job_applications").insert({
      job_id: jobId,
      worker_id: user.id,
      message: message || null,
    });

    setLoading(false);

    if (insertError) {
      setError("Não foi possível enviar a candidatura. Tenta novamente.");
      return;
    }

    // Notificação + email são "melhor esforço": não bloqueiam nem
    // falham a candidatura.
    createNotification(supabase, {
      userId: clientId,
      type: "candidatura",
      title: "Nova candidatura",
      description: `Recebeste uma candidatura para "${jobTitle}".`,
      relatedJobId: jobId,
    });

    fetch("/api/notify/nova-candidatura", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, message: message || null }),
    }).catch(() => {
      // Silenciosamente ignorado — a candidatura já foi gravada com sucesso.
    });

    setDone(true);
    router.refresh();
  }

  if (!open) {
    return (
      <Button fullWidth onClick={() => setOpen(true)}>
        Candidatar-me a este trabalho
      </Button>
    );
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleApply}>
      {error && (
        <Alert tone="danger" title="Não foi possível enviar">
          {error}
        </Alert>
      )}
      <TextArea
        label="Mensagem (opcional)"
        placeholder="Explica porque és a pessoa certa para este trabalho..."
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "A enviar..." : "Enviar candidatura"}
      </Button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { createClient } from "@/lib/supabase/client";
import { createNotification } from "@/lib/notifications/create";
import { cn } from "@/lib/utils";

export function LeaveReviewButton({
  jobId,
  authorId,
  revieweeId,
  revieweeName,
}: {
  jobId: string;
  authorId: string;
  revieweeId: string;
  revieweeName: string;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit() {
    if (rating === 0) {
      setError("Escolhe uma classificação de 1 a 5 estrelas.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from("reviews").insert({
        job_id: jobId,
        author_id: authorId,
        reviewed_id: revieweeId,
        rating,
        comment: comment || null,
      });
      if (insertError) throw insertError;
      createNotification(supabase, {
        userId: revieweeId,
        type: "avaliacao",
        title: "Nova avaliação",
        description: `Recebeste uma avaliação de ${rating} estrela${rating === 1 ? "" : "s"}.`,
        relatedJobId: jobId,
      });
      setDone(true);
      router.refresh();
    } catch {
      setError("Não foi possível enviar a avaliação. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Star className="h-4 w-4" aria-hidden="true" />
        Avaliar {revieweeName}
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Avaliar ${revieweeName}`}
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
                {loading ? "A enviar..." : "Enviar avaliação"}
              </Button>
            </div>
          )
        }
      >
        {done ? (
          <Alert tone="success" title="Avaliação enviada">
            Obrigado! A tua avaliação ajuda a manter a confiança na KaziGo.
          </Alert>
        ) : (
          <div className="flex flex-col gap-4">
            {error && (
              <Alert tone="danger" title="Erro">
                {error}
              </Alert>
            )}

            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`${n} estrela${n === 1 ? "" : "s"}`}
                  className="p-1"
                >
                  <Star
                    className={cn(
                      "h-8 w-8 transition-colors",
                      n <= (hoverRating || rating) ? "fill-orange-500 text-orange-500" : "text-border"
                    )}
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>

            <TextArea
              label="Comentário (opcional)"
              rows={4}
              placeholder="Como foi a tua experiência?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        )}
      </Modal>
    </>
  );
}

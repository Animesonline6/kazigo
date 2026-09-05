"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { createClient } from "@/lib/supabase/client";

export default function ConfirmarNovaPasswordPage() {
  const supabase = createClient();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError(null);

    if (password.length < 6) {
      setError("A palavra-passe deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As palavras-passe não coincidem.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError("Não foi possível atualizar a palavra-passe. O link pode ter expirado — pede um novo.");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/dashboard"), 2000);
  }

  return (
    <div className="container-kazigo flex min-h-[70vh] items-center justify-center py-10">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <h1 className="mb-2 text-xl font-bold text-ink">Definir nova palavra-passe</h1>
        <p className="mb-6 text-sm text-ink-faint">Escolhe uma nova palavra-passe para a tua conta.</p>

        {success ? (
          <Alert tone="success" title="Palavra-passe atualizada">
            A levar-te para o teu dashboard...
          </Alert>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {error && (
              <Alert tone="danger" title="Erro">
                {error}
              </Alert>
            )}
            <TextInput
              label="Nova palavra-passe"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextInput
              label="Confirmar palavra-passe"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? "A guardar..." : "Guardar nova palavra-passe"}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}

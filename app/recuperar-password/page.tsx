"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { createClient } from "@/lib/supabase/client";

export default function RecuperarPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/callback?next=/recuperar-password/confirmar`,
    });

    setLoading(false);

    // Por segurança, mostramos sempre a mesma mensagem de sucesso,
    // mesmo que o email não exista — para não revelar quais emails
    // estão registados na plataforma.
    if (resetError) {
      setError("Não foi possível enviar o email. Tenta novamente.");
      return;
    }
    setSent(true);
  }

  return (
    <div className="container-kazigo flex min-h-[70vh] items-center justify-center py-10">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <h1 className="mb-2 text-xl font-bold text-ink">Recuperar palavra-passe</h1>
        <p className="mb-6 text-sm text-ink-faint">
          Escreve o teu email e enviamos-te um link para definires uma nova palavra-passe.
        </p>

        {sent ? (
          <Alert tone="success" title="Email enviado">
            Se existir uma conta com esse email, vais receber um link para repor a palavra-passe em poucos
            minutos. Verifica também a pasta de spam.
          </Alert>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {error && (
              <Alert tone="danger" title="Erro">
                {error}
              </Alert>
            )}
            <TextInput
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
            />
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? "A enviar..." : "Enviar link de recuperação"}
            </Button>
          </form>
        )}

        <Link href="/login" className="mt-6 block text-center text-sm font-medium text-teal-600 hover:underline">
          Voltar ao login
        </Link>
      </Card>
    </div>
  );
}

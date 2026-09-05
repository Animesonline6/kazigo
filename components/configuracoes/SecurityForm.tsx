"use client";

import { useState } from "react";
import { TextInput } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { createClient } from "@/lib/supabase/client";

export function SecurityForm({ email }: { email: string }) {
  const supabase = createClient();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setSuccess(false);

    if (newPassword.length < 6) {
      setError("A nova palavra-passe deve ter pelo menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("As palavras-passe novas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      // Confirma a palavra-passe atual antes de mudar, por segurança
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: currentPassword });
      if (signInError) {
        setError("A palavra-passe atual está incorreta.");
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Não foi possível atualizar a palavra-passe. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {error && (
        <Alert tone="danger" title="Erro">
          {error}
        </Alert>
      )}
      {success && (
        <Alert tone="success" title="Palavra-passe atualizada com sucesso">
          A partir de agora, usa a nova palavra-passe para entrar.
        </Alert>
      )}
      <TextInput
        label="Palavra-passe atual"
        type="password"
        required
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <TextInput
        label="Nova palavra-passe"
        type="password"
        required
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <TextInput
        label="Confirmar nova palavra-passe"
        type="password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button type="submit" className="w-fit" disabled={loading}>
        {loading ? "A atualizar..." : "Atualizar palavra-passe"}
      </Button>
    </form>
  );
}

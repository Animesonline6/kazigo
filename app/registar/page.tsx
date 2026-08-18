"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Briefcase, Wrench, Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextInput, PasswordInput, Checkbox } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { Alert } from "@/components/ui/Alert";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/types";

const roleOptions: { value: Extract<UserRole, "worker" | "client" | "company">; label: string; icon: typeof Wrench }[] = [
  { value: "worker", label: "Sou trabalhador", icon: Wrench },
  { value: "client", label: "Sou cliente", icon: Briefcase },
  { value: "company", label: "Sou empresa", icon: Building2 },
];

export default function RegistarPage() {
  const router = useRouter();
  const supabase = createClient();

  const envMissing =
    !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const [role, setRole] = useState<UserRole>("worker");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!acceptedTerms) {
      setError("Tens de aceitar os Termos e a Política de Privacidade.");
      return;
    }
    if (password.length < 8) {
      setError("A palavra-passe deve ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    });

    setLoading(false);

    if (error) {
      // MODO DEBUG: mostra o erro real do Supabase para diagnóstico
      setError(`[DEBUG] ${error.message} (status: ${error.status ?? "?"})`);
      return;
    }

    if (data.user && !data.session) {
      // Confirmação de email exigida
      setSuccess(true);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleGoogleSignup() {
    setError(null);
    setGoogleLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?role=${role}`,
      },
    });

    if (error) {
      setError("Não foi possível continuar com Google. Tenta novamente.");
      setGoogleLoading(false);
    }
  }

  if (success) {
    return (
      <div className="container-kazigo flex min-h-[70vh] items-center justify-center py-14">
        <Card className="w-full max-w-md p-7 text-center sm:p-8">
          <h1 className="text-xl font-bold">Confirma o teu email</h1>
          <p className="mt-2 text-sm text-ink-faint">
            Enviámos um link de confirmação para <span className="font-medium text-ink">{email}</span>.
            Abre o email e toca no link para ativares a tua conta.
          </p>
          <Link href="/login" className="mt-6 inline-block font-semibold text-navy-700 hover:underline">
            Voltar ao login
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-kazigo flex min-h-[70vh] items-center justify-center py-14">
      <Card className="w-full max-w-md p-7 sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold">Criar conta na KaziGo</h1>
          <p className="mt-1 text-sm text-ink-faint">Encontra. Trabalha. Ganha.</p>
        </div>

        {error && (
          <Alert tone="danger" title="Não foi possível concluir o registo" className="mb-4">
            {error}
          </Alert>
        )}

        {envMissing && (
          <Alert tone="danger" title="[DEBUG] Configuração em falta" className="mb-4">
            As variáveis NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY não chegaram ao
            browser. Confirma as Environment Variables na Vercel e faz Redeploy.
          </Alert>
        )}

        <div className="mb-6 grid grid-cols-3 gap-2">
          {roleOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRole(opt.value)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-sm border p-3 text-center transition-colors",
                role === opt.value ? "border-teal-500 bg-teal-50 text-teal-700" : "border-border text-ink-faint hover:border-border-strong"
              )}
              aria-pressed={role === opt.value}
            >
              <opt.icon className="h-[18px] w-[18px]" aria-hidden="true" />
              <span className="text-xs font-medium">{opt.label}</span>
            </button>
          ))}
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <TextInput
            label="Nome completo"
            placeholder="O teu nome"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <TextInput
            label="Email"
            type="email"
            placeholder="tu@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput
            label="Palavra-passe"
            placeholder="Mínimo 8 caracteres"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Checkbox
            label="Aceito os Termos e a Política de Privacidade"
            required
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
          />
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "A criar conta..." : "Criar conta"}
          </Button>
        </form>

        <Divider label="ou" className="my-6" />

        <Button
          variant="outline"
          fullWidth
          onClick={handleGoogleSignup}
          disabled={googleLoading}
        >
          {googleLoading ? "A ligar ao Google..." : "Continuar com Google"}
        </Button>

        <p className="mt-6 text-center text-sm text-ink-faint">
          Já tens conta?{" "}
          <Link href="/login" className="font-semibold text-navy-700 hover:underline">
            Entrar
          </Link>
        </p>
      </Card>
    </div>
  );
}
